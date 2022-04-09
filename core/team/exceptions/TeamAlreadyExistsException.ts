export class TeamAlreadyExistsException extends Error {
  constructor() {
    super('Team already exists with this name')
    this.name = this.constructor.name
  }
}
