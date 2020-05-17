export class ValidationError extends Error {
  constructor (details) {
    super('A validation error has occured')
    this.details = details
  }
}
