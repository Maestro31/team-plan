import { Entity } from 'core/shared/models/Entity'
import { OwnerId } from './OwnerId'
import { TeamId } from './TeamId'

export interface TeamProps {
  id: TeamId
  name: string
  ownerId: OwnerId
}

export interface TeamDTO {
  id: string
  name: string
  ownerId: string
}

export class Team extends Entity<TeamId, TeamProps> {
  public toPrimitives(): Readonly<TeamDTO> {
    return {
      ...this.props,
      ownerId: this.props.ownerId.value,
      id: this.id.value,
    } as const
  }
}
