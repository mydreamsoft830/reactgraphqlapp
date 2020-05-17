// TODO: Asserts on everything
// TODO: Strictness on parsing and emitting the invalid character offset on error
import { ValidationError } from './errors'

const AggregationMethods = ['avg', 'min', 'max', 'sum']

export default class TimeseriesQueryParser {
  static parse(queryStr) {
    const parser = new TimeseriesQueryParser(queryStr)
    return parser.parse()
  }

  constructor(queryStr) {
    this.queryStr = queryStr
  }

  parse() {
    this.parseAggregationMethod()
    this.parseMeasurement()
    this.parseFields()
    this.parseScope()
    this.parseAggregationGroups()
    return this.toJson()
  }

  parseAggregationMethod() {
    const firstColon = this.queryStr.indexOf(':')
    if (firstColon < 0 || firstColon > 3) {
      throw new ValidationError({
        query: ['needs to specify an aggregation method']
      })
    }

    this.aggregateMethod = this.queryStr.slice(0, firstColon)

    if (!AggregationMethods.includes(this.aggregateMethod)) {
      throw new ValidationError({
        query: [
          `Must be one of ${AggregationMethods.map((v) => `'${v}'`).join(', ')}`
        ]
      })
    }
    this.queryStr = this.queryStr.slice(firstColon + 1)
  }

  parseMeasurement() {
    const firstBracket = this.queryStr.indexOf('(')

    if (firstBracket < 0) {
      throw new ValidationError({
        query: ['must specify fields']
      })
    }

    this.measurement = this.queryStr.slice(0, firstBracket)

    if (this.measurement.length === 0) {
      throw new ValidationError({
        query: ['measurement must be present']
      })
    }

    this.queryStr = this.queryStr.slice(firstBracket)
  }

  parseFields() {
    const openBracket = this.queryStr.indexOf('(')
    const closeBracket = this.queryStr.indexOf(')')

    // Allow empty fields, this gets expanded to all fields later on
    if (openBracket < 0 && closeBracket < 0) {
      this.fields = []
      return
    }

    if (closeBracket < 0 || closeBracket < openBracket) {
      throw new ValidationError({
        query: ['missing close bracket on fields']
      })
    }

    if (openBracket + 1 === closeBracket) {
      this.fields = []
    } else {
      const fieldsStr = this.queryStr.slice(openBracket + 1, closeBracket)
      this.fields = fieldsStr.split(',').map((field) => field.trim())
    }

    this.queryStr = this.queryStr.slice(closeBracket + 1)
  }

  parseScope() {
    const openBrace = this.queryStr.indexOf('{')
    const closeBrace = this.queryStr.indexOf('}')

    // Allow empty scope, this gets expanded to all fields later on
    if (openBrace < 0 && closeBrace < 0) {
      this.scope = {}
      return
    }

    if (openBrace + 1 === closeBrace) {
      this.scope = []
    } else {
      const tagsStr = this.queryStr.slice(openBrace + 1, closeBrace)

      this.scope = tagsStr.split(',').reduce((tagsArr, field) => {
        const [tagName, tagValue] = field.trim().split(':')

        if (tagValue === undefined) {
          throw new ValidationError({
            query: ['scope value must be present']
          })
        }

        return [{ name: tagName, value: tagValue }].concat(tagsArr)
      }, [])
    }

    this.queryStr = this.queryStr.slice(closeBrace + 1)
  }

  parseAggregationGroups() {
    const byStrIndex = this.queryStr.indexOf(' by ')

    if (byStrIndex < 0) {
      this.aggregationGroups = []
      return
    }

    this.queryStr = this.queryStr.slice(byStrIndex + 2)

    const openBrace = this.queryStr.indexOf('{')
    const closeBrace = this.queryStr.indexOf('}')

    if (openBrace < 0) {
      throw new ValidationError({
        query: ['missing open brace on aggregation group']
      })
    }

    if (closeBrace < 0) {
      throw new ValidationError({
        query: ['missing closing brace on aggregation group']
      })
    }

    if (closeBrace < openBrace) {
      throw new ValidationError({
        query: ['aggregation group malformed']
      })
    }

    if (openBrace + 1 === closeBrace) {
      this.aggregationGroups = {}
    } else {
      const groupsStr = this.queryStr.slice(openBrace + 1, closeBrace)

      this.aggregationGroups = groupsStr.split(',').map((group) => group.trim())
    }

    this.queryStr = this.queryStr.slice(closeBrace + 1)
  }

  toJson() {
    return {
      aggregateMethod: this.aggregateMethod,
      aggregationGroups: this.aggregationGroups,
      measurement: this.measurement,
      fields: this.fields,
      scope: this.scope
    }
  }
}
