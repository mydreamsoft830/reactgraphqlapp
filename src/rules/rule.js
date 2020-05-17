import jsep from 'jsep'
import { matchesSubscription } from './mqtt'
import Expression from './expression'
import Sparkplug from './decoders/sparkplug'
import CSV from './decoders/csv'

jsep.addBinaryOp('->', 99)

class Rule {
  constructor (ruleStr) {
    this.ruleStr = ruleStr.replace(/(?:\r\n|\r|\n)/g, ' ').trim()

    console.dir(this.ruleStr)

    this.select = []
    this.from = []
    this.where = null

    this._parse()
  }

  static parse (ruleStr) {
    return new Rule(ruleStr)
  }

  _parse () {
    this._parseSelect()
    this._parseFrom()
    this._parseWhere()
  }

  _parseSelect () {
    const selectIdx = this.ruleStr.toLowerCase().indexOf('select ')
    const fromIdx = this.ruleStr.toLowerCase().indexOf(' from')

    if (selectIdx !== 0) throw new Error('Rule must start with SELECT clause')
    if (fromIdx < 0) throw new Error('Rule must have a FROM clause')

    const selectStr = this.ruleStr
      .slice(selectIdx + 'select'.length, fromIdx)
      .trim()

    this._splitWithEscape(selectStr, ',').forEach((s) =>
      this._parseSelectStatement(s)
    )

    // Consume rule string
    this.ruleStr = this.ruleStr.slice(fromIdx)
  }

  _splitWithEscape (str, splitChar) {
    const out = []
    const escapeStack = []

    let lastSplit = 0

    for (let i = 0; i < str.length; i++) {
      const c = str[i]

      if (
        ['"', "'", ')'].includes(c) &&
        escapeStack.length > 0 &&
        escapeStack[escapeStack.length - 1] === c
      ) {
        escapeStack.pop()
      } else if (['"', "'", '('].includes(c)) {
        if (c === '(') {
          escapeStack.push(')')
        } else {
          escapeStack.push(c)
        }
      } else if (c === splitChar && escapeStack.length === 0) {
        out.push(str.slice(lastSplit, i))
        lastSplit = i + 1
      }
    }

    if (lastSplit < str.length) {
      out.push(str.slice(lastSplit))
    }

    return out
  }

  _parseSelectStatement (statementStr) {
    const [expressionStr, aliasStr] = statementStr.trim().split(' as ')

    if (expressionStr === '*') {
      // * cannot be aliased
      if (aliasStr !== undefined) {
        throw new Error("Syntax error 'AS' cannot follow '*'")
      }

      this.select.push({
        selectAll: true,
        expr: null,
        as: null
      })
    } else {
      const ast = jsep.parse(expressionStr)
      this.select.push({
        expr: new Expression(ast),
        as: aliasStr || expressionStr
      })
    }
  }

  _parseFrom () {
    const fromIdx = this.ruleStr.toLowerCase().indexOf(' from')
    const whereIdx = this.ruleStr.toLowerCase().indexOf(' where')

    let fromStr
    if (whereIdx < 0) {
      fromStr = this.ruleStr.slice(fromIdx + ' from'.length).trim()
    } else {
      fromStr = this.ruleStr.slice(fromIdx + ' from'.length, whereIdx).trim()
    }

    fromStr.split(',').forEach((s) => this._parseFromStatement(s))

    // Consume rule string
    this.ruleStr = this.ruleStr.slice(whereIdx)
  }

  _parseFromStatement (statementStr) {
    const ast = jsep.parse(statementStr)
    this.from.push(new Expression(ast))
  }

  _parseWhere () {
    const whereIdx = this.ruleStr.toLowerCase().indexOf(' where')

    if (whereIdx < 0) return

    const whereStr = this.ruleStr.slice(whereIdx + ' where'.length).trim()

    const whereAst = jsep.parse(whereStr)
    this.where = new Expression(whereAst)
  }

  doesMatchTopic (topic) {
    return this.from.some((fromExpr) => {
      const topicLiteral = fromExpr.execute(null)

      if (Array.isArray(topicLiteral)) {
        return topicLiteral.some((sub) => matchesSubscription(topic, sub))
      } else if (typeof topicLiteral === 'string') {
        return matchesSubscription(topic, topicLiteral)
      } else {
        throw new Error('FROM much be a string or array of strings')
      }
    })
  }

  parsePayload (payload, topic, ctx) {
    if (this.from.length === 0) {
      return JSON.parse(payload)
    }

    for (const fromExpr of this.from) {
      const fromCtx = {}
      const topicLiteral = fromExpr.execute(null, fromCtx)

      let doesMatch = false
      if (Array.isArray(topicLiteral)) {
        doesMatch = topicLiteral.some((sub) => matchesSubscription(topic, sub))
      } else if (typeof topicLiteral === 'string') {
        doesMatch = matchesSubscription(topic, topicLiteral)
      } else {
        throw new Error('FROM much be a string or array of strings')
      }

      if (doesMatch) {
        ctx.decoder = fromCtx.decoder
        break
      }
    }

    switch (ctx.decoder) {
      case 'sparkplug':
        return Sparkplug.decodeSparkplugB(payload)
      case 'csv':
        return CSV.decodeCSV(payload)
      default:
        return JSON.parse(payload)
    }
  }

  _executeSingle (ctx, payloadObj, topic = '') {
    if (this.where) {
      const whereValue = this.where.execute(payloadObj)

      if (!whereValue) return null
    }

    let outObj = {}

    for (const statement of this.select) {
      if (statement.expr) {
        const value = statement.expr.execute(payloadObj, ctx)
        const alias = statement.as

        outObj[alias] = value
      } else if (statement.selectAll) {
        outObj = Object.assign(outObj, payloadObj)
      } else {
        throw new Error('Invalid SELECT statement')
      }
    }

    return outObj
  }

  execute (payload, topic = '') {
    const ctx = { topic }
    const payloadObj = this.parsePayload(payload, topic, ctx)

    if (!Array.isArray(payloadObj)) {
      return [this._executeSingle(ctx, payloadObj, topic)]
    } else {
      return payloadObj.map((obj) => this._executeSingle(ctx, obj, topic))
    }
  }
}

export default Rule