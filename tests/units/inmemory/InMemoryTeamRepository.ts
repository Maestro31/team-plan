import { Repository } from 'core/shared/models/Repository'
import { Team, TeamProps } from 'core/team/models/Team'
import { TeamRepository } from 'core/team/models/TeamRepository'

export class InMemoryTeamRepository extends Repository implements TeamRepository {
  private teams: { [key: string]: Team } = {}
  private _lastArguments: any[] = []
  private stubs: { [key: string]: any } = {}

  public get lastArguments() {
    return this._lastArguments
  }

  public async findBy(criteria: Partial<TeamProps>): Promise<Team | null> {
    this._lastArguments = [criteria]
    return this.stubs['findBy']
  }

  public async save(team: Team) {
    this.teams[team.id.value] = team
  }

  public all(): Team[] {
    return Object.values(this.teams)
  }

  public load(teams: Team[]) {
    this.teams = Object.fromEntries(teams.map((team) => [team.id, team]))
  }

  public stub(funcName: string, value: any) {
    this.stubs[funcName] = value
  }
}
