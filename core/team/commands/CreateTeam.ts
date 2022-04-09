import { CommandHandler } from 'core/shared/models/CommandHandler'
import { TeamAlreadyExistsException } from '../exceptions/TeamAlreadyExistsException'
import { CreateTeamCommand } from '../models/CreateTeamCommand'
import { OwnerId } from '../models/OwnerId'
import { Team } from '../models/Team'
import { TeamId } from '../models/TeamId'
import { TeamRepository } from '../models/TeamRepository'

export class CreateTeam implements CommandHandler<CreateTeamCommand, Promise<void>> {
  constructor(private teamRepository: TeamRepository) {}

  public async execute(payload: CreateTeamCommand): Promise<void> {
    const existingTeam = await this.teamRepository.findBy({ name: payload.get('name') })

    if (existingTeam) {
      throw new TeamAlreadyExistsException()
    }

    const team = new Team({
      id: new TeamId(this.teamRepository.nextIdentity()),
      name: payload.get('name'),
      ownerId: new OwnerId(payload.get('userId')),
    })

    await this.teamRepository.save(team)
  }
}
