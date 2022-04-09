import { test } from '@japa/runner'
import { InvalidCommandException } from 'core/shared/exceptions/InvalidCommandException'
import { CreateTeam } from 'core/team/commands/CreateTeam'
import { TeamAlreadyExistsException } from 'core/team/exceptions/TeamAlreadyExistsException'
import { CreateTeamCommand, CreateTeamCommandProps } from 'core/team/models/CreateTeamCommand'
import { TeamBuilder } from 'tests/units/builders/team/TeamBuilder'
import { IncrementalIdentityGenerator } from 'tests/units/inmemory/IncrementalIdentityGenerator'
import { InMemoryTeamRepository } from 'tests/units/inmemory/InMemoryTeamRepository'

test.group('Create team command validation', () => {
  function buildCommand(attributes: Partial<CreateTeamCommandProps> = {}): CreateTeamCommand {
    return new CreateTeamCommand({
      userId: 'user-id',
      name: 'Team Name',
      ...attributes,
    })
  }

  test('should fail when userId is empty', ({ expect }) => {
    expect(() => buildCommand({ userId: '' })).toThrow(InvalidCommandException)
  })

  test('should fail when name is empty', ({ expect }) => {
    expect(() => buildCommand({ name: '' })).toThrow(InvalidCommandException)
  })

  test('should fail when name has less than 3 letters', ({ expect }) => {
    expect(() => buildCommand({ name: 'do' })).toThrow(InvalidCommandException)
  })
})

test.group('Create team command', (group) => {
  let teamRepository: InMemoryTeamRepository
  let createTeam: CreateTeam

  group.each.setup(() => {
    teamRepository = new InMemoryTeamRepository(new IncrementalIdentityGenerator('team'))
    createTeam = new CreateTeam(teamRepository)
  })

  test('should create a team', async ({ expect }) => {
    const command = new CreateTeamCommand({ userId: 'user-id', name: 'Team Name' })
    await createTeam.execute(command)

    expect(teamRepository.all()).toHaveLength(1)
  })

  test('should assign user as owner', async ({ expect }) => {
    const command = new CreateTeamCommand({ userId: 'user-id', name: 'Team Name' })
    await createTeam.execute(command)

    expect(teamRepository.all()[0].toPrimitives()).toMatchObject({ ownerId: 'user-id' })
  })

  test('should create team correctly', async ({ expect }) => {
    const command = new CreateTeamCommand({ userId: 'user-id', name: 'Team Name' })
    await createTeam.execute(command)

    expect(teamRepository.all()[0].toPrimitives()).toMatchObject({
      id: 'team-0',
      name: 'Team Name',
      ownerId: 'user-id',
    })
  })

  test('should fail when a team already exits with the same name', ({ expect }) => {
    const team = new TeamBuilder().withName('Team Name').build()

    teamRepository.stub('findBy', team)

    const command = new CreateTeamCommand({ userId: 'user-id', name: 'Team Name' })

    expect(createTeam.execute(command)).rejects.toThrow(TeamAlreadyExistsException)
    expect(teamRepository.lastArguments[0]).toEqual({ name: 'Team Name' })
  })
})
