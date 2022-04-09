import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import { Team } from 'core/team/models/Team'
import { TeamId } from 'core/team/models/TeamId'
import { OwnerId } from 'core/team/models/OwnerId'

export class TeamBuilder {
  private id?: TeamId
  private name?: string
  private ownerId?: OwnerId

  public withId(id: TeamId) {
    this.id = id
    return this
  }

  public withName(name: string) {
    this.name = name
    return this
  }

  public withOwnerId(ownerId: OwnerId) {
    this.ownerId = ownerId
    return this
  }

  public build() {
    return new Team({
      id: this.id ?? new TeamId(uuidv4()),
      name: this.name ?? faker.company.companyName(),
      ownerId: this.ownerId ?? new OwnerId(uuidv4()),
    })
  }
}
