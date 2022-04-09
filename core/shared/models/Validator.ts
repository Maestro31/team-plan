import { AnySchema, ValidationError } from 'yup'

export class ValidationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class YupValidator implements Validator {
  constructor(private schema: AnySchema) {}

  public validate(props: any): void {
    try {
      this.schema.validateSync(props)
    } catch (e) {
      if (e instanceof ValidationError) {
        throw new ValidationException(e.message)
      }

      throw e
    }
  }
}

export interface Validator {
  validate(props: any): void
}
