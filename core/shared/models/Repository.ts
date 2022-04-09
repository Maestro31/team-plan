import { IdentityGenerator } from './IdentityGenerator'

export abstract class Repository {
  constructor(private identityGenerator: IdentityGenerator) {}

  public nextIdentity(): string {
    return this.identityGenerator.generate()
  }
}
