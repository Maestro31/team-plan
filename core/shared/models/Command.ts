import { InvalidCommandException } from '../exceptions/InvalidCommandException'
import { ValidationException, Validator } from './Validator'

export abstract class Command<CommandProps> {
  constructor(protected props: CommandProps, private validator?: Validator) {}

  public get<K extends keyof CommandProps>(propName: K): CommandProps[K] {
    return this.props[propName]
  }

  protected validate(props: CommandProps) {
    if (!this.validator) {
      return
    }

    try {
      this.validator.validate(props)
    } catch (e) {
      if (e instanceof ValidationException) {
        throw new InvalidCommandException(e.message)
      }

      throw e
    }
  }
}
