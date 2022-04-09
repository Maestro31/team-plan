import { IdentityGenerator } from 'core/shared/models/IdentityGenerator'

export class IncrementalIdentityGenerator implements IdentityGenerator {
  private count: number = 0
  constructor(private prefix: string = 'uuid') {}

  public generate() {
    return `${this.prefix}-${this.count++}`
  }
}
