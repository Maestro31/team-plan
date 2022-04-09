import { Command } from 'core/shared/models/Command'
import { YupValidator } from 'core/shared/models/Validator'
import { object, string } from 'yup'

export interface CreateTeamCommandProps {
  userId: string
  name: string
}

const teamCommandSchema = object({
  userId: string().required(),
  name: string().required().min(3),
})

export class CreateTeamCommand extends Command<CreateTeamCommandProps> {
  constructor(protected props: CreateTeamCommandProps) {
    super(props, new YupValidator(teamCommandSchema))
    this.validate(props)
  }
}
