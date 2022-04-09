import { Repository } from 'core/shared/models/Repository'
import { Team, TeamProps } from './Team'

export interface TeamRepository extends Repository {
  save(team: Team): Promise<void>
  findBy(criteria: Partial<TeamProps>): Promise<Team | null>
}
