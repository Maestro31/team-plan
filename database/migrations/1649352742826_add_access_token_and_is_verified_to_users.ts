import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddAccessTokenAndIsVerifiedToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('access_token')
      table.string('provider').notNullable()
      table.string('name')
      table.boolean('is_verified')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('access_token')
      table.dropColumn('provider')
      table.dropColumn('name')
      table.dropColumn('is_verified')
    })
  }
}
