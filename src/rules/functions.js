import { v4 } from 'uuid'
import crypto from 'crypto-browserify'

const uuid = { v4 }

class FunctionInstance {
  constructor (name, signature, func) {
    this.name = name
    this.signature = signature
    this.func = func
  }

  execute (ctx, args) {
    const castArgs = this.checkSignature(args)
    return this.func(ctx, castArgs, this)
  }

  checkSignature (args) {
    if (Array.isArray(this.signature)) {
      return this.checkSignatureStringArray(args)
    }

    return this.checkSignatureObject(args)
  }

  checkSignatureObject (args) {
    const castArgs = []
    const type = this.signature.type

    if (!this.signature.repeat && args.length !== 0) {
      throw new Error(this.signatureAsError())
    }

    args.forEach((thisArg, i) => {
      const argType = typeof thisArg

      if (type !== 'any' && argType !== type) {
        castArgs[i] = this.attemptCastAs(thisArg, type)
      } else {
        castArgs[i] = thisArg
      }
    })

    return castArgs
  }

  checkSignatureStringArray (args) {
    const castArgs = []

    if (args.length !== this.signature.length) {
      throw new Error(this.signatureAsError())
    }

    this.signature.forEach((sig, i) => {
      const thisArg = args[i]
      const argType = typeof thisArg
      const isSignatureObject = typeof sig === 'object'
      const signatureType = isSignatureObject ? sig.type : sig

      if (isSignatureObject) {
        if (sig.oneOf && !sig.oneOf.includes(args[i])) {
          throw new Error(this.signatureAsError())
        }
      }

      if (signatureType !== 'any' && argType !== signatureType) {
        castArgs[i] = this.attemptCastAs(thisArg, signatureType)
      } else {
        castArgs[i] = thisArg
      }
    })

    return castArgs
  }

  signatureAsError () {
    return `Invalid arguments to function '${
      this.name
    }'. Must match (${this.signatureString()})`
  }

  signatureString () {
    if (Array.isArray(this.signature)) {
      if (this.signature.length > 0) {
        return this.signature
          .map((sig) => {
            if (typeof sig === 'object') {
              let out = sig.type

              if (sig.oneOf) {
                const options = sig.oneOf.map((val) => `"${val}""`).join()
                out += ` [one of ${options}]`
              }

              return out
            }

            return sig
          })
          .join(', ')
      }

      return 'none'
    } else {
      // Object signature type
      let signature = this.signature.type

      if (this.signature.repeat) {
        signature += `[, ${this.signature.type}]`
      }

      return signature
    }
  }

  attemptCastAs (value, type) {
    const valueType = typeof value

    // Don't attempt to convert an object, array, null or undefined
    if (
      ['object', 'undefined'].includes(valueType) ||
      value === null ||
      Array.isArray(value)
    ) {
      throw new Error(this.signatureAsError())
    }

    switch (type) {
      case 'number': {
        const castValue = Number(value)
        if (isNaN(castValue)) {
          throw new Error(this.signatureAsError())
        }

        return castValue
      }
      case 'string': {
        /*
          1234 => "1234"
          false => "false"
        */
        return String(value)
      }
      case 'boolean': {
        // 0 => false, 1+ => true,
        if (valueType === 'number') return Boolean(value)

        // "true" => true, "false" => false, otherwise throw an error
        if (
          valueType === 'string' &&
          ['true', 'false'].includes(value.toLowerCase())
        ) {
          return value.toLowerCase() === 'true'
        }

        throw new Error(this.signatureAsError())
      }
      default:
        throw new Error(this.signatureAsError())
    }
  }
}

const FUNCTION_MAP = {
  abs: new FunctionInstance('ABS', ['number'], (ctx, args) =>
    Math.abs(args[0])
  ),
  acos: new FunctionInstance('ACOS', ['number'], (ctx, args) =>
    Math.acos(args[0])
  ),
  asin: new FunctionInstance('ASIN', ['number'], (ctx, args) =>
    Math.asin(args[0])
  ),
  atan: new FunctionInstance('ATAN', ['number'], (ctx, args) =>
    Math.atan(args[0])
  ),
  atan2: new FunctionInstance('ATAN2', ['number', 'number'], (ctx, args) =>
    Math.atan2(args[0], args[1])
  ),
  bitand: new FunctionInstance(
    'BITAND',
    ['number', 'number'],
    (ctx, args) => args[0] & args[1]
  ),
  bitor: new FunctionInstance(
    'BITOR',
    ['number', 'number'],
    (ctx, args) => args[0] | args[1]
  ),
  bitxor: new FunctionInstance(
    'BITXOR',
    ['number', 'number'],
    (ctx, args) => args[0] ^ args[1]
  ),
  // TODO: Should this only return an unsigned result?
  bitnot: new FunctionInstance('BITNOT', ['number'], (ctx, args) => ~args[0]),
  ceil: new FunctionInstance('CEIL', ['number'], (ctx, args) =>
    Math.ceil(args[0])
  ),
  chr: new FunctionInstance('CHR', ['number'], (ctx, args) =>
    String.fromCharCode(args[0])
  ),
  cos: new FunctionInstance('COS', ['number'], (ctx, args) =>
    Math.cos(args[0])
  ),
  cosh: new FunctionInstance('COSH', ['number'], (ctx, args) =>
    Math.cosh(args[0])
  ),
  endswith: new FunctionInstance(
    'ENDSWITH',
    ['string', 'string'],
    (ctx, args) => args[0].endsWith(args[1])
  ),
  exp: new FunctionInstance('EXP', ['number'], (ctx, args) =>
    Math.exp(args[0])
  ),
  floor: new FunctionInstance('FLOOR', ['number'], (ctx, args) =>
    Math.floor(args[0])
  ),
  indexof: new FunctionInstance('INDEXOF', ['string', 'string'], (ctx, args) =>
    args[0].indexOf(args[1])
  ),
  isnull: new FunctionInstance(
    'ISNULL',
    ['any'],
    (ctx, args) => args[0] === null
  ),
  isundefined: new FunctionInstance(
    'ISUNDEFINED',
    ['any'],
    (ctx, args) => args[0] === undefined
  ),
  length: new FunctionInstance(
    'LENGTH',
    ['string'],
    (ctx, args) => args[0].length
  ),
  ln: new FunctionInstance('LN', ['number'], (ctx, args) => Math.log(args[0])),
  log: new FunctionInstance('LOG', ['number'], (ctx, args) =>
    Math.log10(args[0])
  ),
  lower: new FunctionInstance('LOWER', ['string'], (ctx, args) =>
    args[0].toLowerCase()
  ),
  lpad: new FunctionInstance('LPAD', ['string', 'number'], (ctx, args) =>
    args[0].padStart(args[0].length + args[1], ' ')
  ),
  ltrim: new FunctionInstance('LTRIM', ['string'], (ctx, args) =>
    args[0].trimStart()
  ),
  remainder: new FunctionInstance(
    'REMAINDER',
    ['number', 'number'],
    (ctx, args) => args[0] % args[1]
  ),
  mod: new FunctionInstance(
    'MOD',
    ['number', 'number'],
    (ctx, args) => args[0] % args[1]
  ),
  nanvl: new FunctionInstance('NANVL', ['any', 'any'], (ctx, args) =>
    isNaN(args[0]) ? args[1] : args[0]
  ),
  newuuid: new FunctionInstance('NEWUUID', [], () => uuid.v4()),
  numbytes: new FunctionInstance('NUMBYTES', ['string'], (ctx, args) =>
    Buffer.byteLength(args[0])
  ),
  power: new FunctionInstance('POWER', ['number', 'number'], (ctx, args) =>
    Math.pow(args[0], args[1])
  ),
  rand: new FunctionInstance('RAND', [], () => Math.random()),
  replace: new FunctionInstance(
    'REPLACE',
    ['string', 'string', 'string'],
    (ctx, args) => args[0].replaceAll(args[1], args[2])
  ),
  rpad: new FunctionInstance('RPAD', ['string', 'number'], (ctx, args) =>
    args[0].padEnd(args[0].length + args[1], ' ')
  ),
  rtrim: new FunctionInstance('RTRIM', ['string'], (ctx, args) =>
    args[0].trimEnd()
  ),
  round: new FunctionInstance('ROUND', ['number'], (ctx, args) =>
    Math.round(args[0])
  ),
  sign: new FunctionInstance('SIGN', ['number'], (ctx, args) =>
    Math.sign(args[0])
  ),
  sin: new FunctionInstance('SIN', ['number'], (ctx, args) =>
    Math.sin(args[0])
  ),
  sinh: new FunctionInstance('SINH', ['number'], (ctx, args) =>
    Math.sinh(args[0])
  ),
  sqrt: new FunctionInstance('SQRT', ['number'], (ctx, args) =>
    Math.sqrt(args[0])
  ),
  startswith: new FunctionInstance(
    'STARTSWITH',
    ['string', 'string'],
    (ctx, args) => args[0].startsWith(args[1])
  ),
  tan: new FunctionInstance('TAN', ['number'], (ctx, args) =>
    Math.tan(args[0])
  ),
  tanh: new FunctionInstance('TANH', ['number'], (ctx, args) =>
    Math.tanh(args[0])
  ),
  timestamp: new FunctionInstance('TIMESTAMP', [], () =>
    Math.round(Date.now() / 1000)
  ),
  trim: new FunctionInstance('TRIM', ['string'], (ctx, args) => args[0].trim()),
  trunc: new FunctionInstance('TRUNC', ['number', 'number'], (ctx, args) => {
    const multiplier = Math.pow(10, args[1])
    return Math.trunc(args[0] * multiplier) / multiplier
  }),
  upper: new FunctionInstance('UPPER', ['string'], (ctx, args) =>
    args[0].toUpperCase()
  ),
  topic: new FunctionInstance('TOPIC', ['number'], (ctx, args) => {
    const topicParts = ctx.topic.split('/')
    return topicParts[args[0]] || null
  }),
  unix_timestamp: new FunctionInstance('UNIX_TIMESTAMP', [], () =>
    Math.round(Date.now() / 1000)
  ),
  unix_timestamp_ms: new FunctionInstance('UNIX_TIMESTAMP_MS', [], () =>
    Date.now()
  ),
  md5: new FunctionInstance('MD5', ['string'], (ctx, args) => {
    return crypto
      .createHash('md5')
      .update(args[0])
      .digest('hex')
  }),
  sha1: new FunctionInstance('SHA1', ['string'], (ctx, args) => {
    return crypto
      .createHash('sha1')
      .update(args[0])
      .digest('hex')
  }),
  sha224: new FunctionInstance('SHA224', ['string'], (ctx, args) => {
    return crypto
      .createHash('sha224')
      .update(args[0])
      .digest('hex')
  }),
  sha256: new FunctionInstance('SHA256', ['string'], (ctx, args) => {
    return crypto
      .createHash('sha256')
      .update(args[0])
      .digest('hex')
  }),
  sha384: new FunctionInstance('SHA384', ['string'], (ctx, args) => {
    return crypto
      .createHash('sha384')
      .update(args[0])
      .digest('hex')
  }),
  sha512: new FunctionInstance('SHA512', ['string'], (ctx, args) => {
    return crypto
      .createHash('sha512')
      .update(args[0])
      .digest('hex')
  }),
  concat: new FunctionInstance(
    'CONCAT',
    { type: 'any', repeat: true },
    (ctx, args, instance) => {
      if (args.length === 0) return undefined
      if (args.length === 1) return args[0]

      const containsArray = args.reduce(
        (result, arg) => result || Array.isArray(arg),
        false
      )

      if (!containsArray) {
        return args.map((arg) => instance.attemptCastAs(arg, 'string')).join('')
      } else if (Array.isArray(args[0])) {
        let output = args[0]
        for (let i = 1; i < args.length; i++) {
          output = output.concat(args[i])
        }

        return output
      }

      throw new Error(instance.signatureAsError())
    }
  ),
  encode: new FunctionInstance(
    'ENCODE',
    ['string', { type: 'string', oneOf: ['base64'] }],
    (ctx, args, instance) => {
      if (args[1] !== 'base64') {
        throw new Error(instance.signatureAsError())
      }

      return Buffer.from(args[0], 'utf8').toString(args[1])
    }
  ),
  decode: new FunctionInstance(
    'DECODE',
    ['string', { type: 'string', oneOf: ['base64'] }],
    (ctx, args, instance) => {
      if (args[1] !== 'base64') {
        throw new Error(instance.signatureAsError())
      }

      return Buffer.from(args[0], args[1]).toString('utf8')
    }
  ),
  parse_time: new FunctionInstance(
    'PARSE_TIME',
    ['string'],
    (ctx, args, instance) => {
      // TODO: This should take a second argument with a time pattern to parse the string
      // i.e. time_to_epoch("18 December 2015", "dd MMMM yyyy")

      try {
        return new Date(args[0]).getTime()
      } catch (e) {
        return null
      }
    }
  ),
  cast: new FunctionInstance(
    'CAST',
    [
      { type: 'any' },
      { type: 'string', oneOf: ['string', 'number', 'boolean'] }
    ],
    (ctx, args, instance) => {
      return instance.attemptCastAs(args[0], args[1])
    }
  ),
  /* TODO
      regexp_matches
      regexp_replace
      regexp_substr
      substring(String, Int[, Int])
      time_to_epoch(String, String)
      transform(String, Object, Array)
    */

  sparkplug: new FunctionInstance('Sparkplug', ['string'], (ctx, args) => {
    ctx.decoder = 'sparkplug'
    return args[0]
  }),
  csv: new FunctionInstance('CSV', ['string'], (ctx, args) => {
    ctx.decoder = 'csv'
    return args[0]
  })
}

function callFunction (name, ctx, args) {
  const func = FUNCTION_MAP[name.toLowerCase()]

  if (!func) {
    throw new Error(`Unsupported call expression '${name}'`)
  }

  return func.execute(ctx, args)
}

export default callFunction
