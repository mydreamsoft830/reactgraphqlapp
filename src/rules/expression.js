// TODO: Context object containing projectId, deviceId, tagset etc.

import callFunction from './functions'

class Expression {
  constructor (ast) {
    this.ast = ast
  }

  execute (obj, ctx = {}) {
    return this._executeNode(this.ast, obj, ctx)
  }

  _executeNode (node, obj, ctx) {
    switch (node.type) {
      case 'BinaryExpression':
        return this._executeBinaryExpression(node, obj, ctx)
      case 'Literal':
        return this._executeLiteral(node, obj, ctx)
      case 'Identifier':
        return this._executeIdentifier(node, obj, ctx)
      case 'CallExpression':
        return this._executeCallExpression(node, obj, ctx)
      case 'UnaryExpression':
        return this._executeUnaryExpression(node, obj, ctx)
      case 'MemberExpression':
        return this._executeMemberExpression(node, obj, ctx)
      case 'ArrayExpression':
        return this._executeArrayExpression(node, obj, ctx)
      default:
        throw new Error(`Unsupported node type '${node.type}'`)
    }
  }

  _executeUnaryExpression (node, obj, ctx) {
    switch (node.operator) {
      case '-':
        return -1 * this._executeNode(node.argument, obj, ctx)
      case '!':
        return !this._executeNode(node.argument, obj, ctx)
      default:
        throw new Error(`Unsupported binary expression '${node.operator}'`)
    }
  }

  _executeBinaryExpression (node, obj, ctx) {
    switch (node.operator) {
      case '*':
        return (
          this._executeNode(node.left, obj, ctx) *
          this._executeNode(node.right, obj, ctx)
        )
      case '+':
        return (
          this._executeNode(node.left, obj, ctx) +
          this._executeNode(node.right, obj, ctx)
        )
      case '-':
        return (
          this._executeNode(node.left, obj, ctx) -
          this._executeNode(node.right, obj, ctx)
        )
      case '/':
        return (
          this._executeNode(node.left, obj, ctx) /
          this._executeNode(node.right, obj, ctx)
        )
      case '%':
        return (
          this._executeNode(node.left, obj, ctx) %
          this._executeNode(node.right, obj, ctx)
        )
      case '>':
        return (
          this._executeNode(node.left, obj, ctx) >
          this._executeNode(node.right, obj, ctx)
        )
      case '>=':
        return (
          this._executeNode(node.left, obj, ctx) >=
          this._executeNode(node.right, obj, ctx)
        )
      case '<':
        return (
          this._executeNode(node.left, obj, ctx) <
          this._executeNode(node.right, obj, ctx)
        )
      case '<=':
        return (
          this._executeNode(node.left, obj, ctx) <=
          this._executeNode(node.right, obj, ctx)
        )
      case '<>':
        return (
          this._executeNode(node.left, obj, ctx) !==
          this._executeNode(node.right, obj, ctx)
        )
      case '=':
        return (
          this._executeNode(node.left, obj, ctx) ===
          this._executeNode(node.right, obj, ctx)
        )
      case '->': {
        const leftObject = this._executeNode(node.left, obj, ctx)
        const rightKey = this._executeNode(node.right, obj, ctx)

        return leftObject[rightKey]
      }
      default:
        throw new Error(`Unsupported binary expression '${node.operator}'`)
    }
  }

  _executeLiteral (node) {
    return node.value
  }

  _executeIdentifier (node, obj) {
    return obj[node.name]
  }

  _executeCallExpression (node, obj, ctx) {
    const functionName = node.callee.name
    const args = node.arguments.map((arg) => this._executeNode(arg, obj, ctx))

    return callFunction(functionName, ctx, args)
  }

  _executeMemberExpression (node, obj, ctx) {
    const object = this._executeNode(node.object, obj, ctx)
    const property =
      node.property.type === 'Identifier'
        ? node.property.name
        : this._executeNode(node.property, obj, ctx)

    return object[property]
  }

  _executeArrayExpression (node, obj, ctx) {
    return node.elements.map((elem) => this._executeNode(elem, obj, ctx))
  }
}

export default Expression
