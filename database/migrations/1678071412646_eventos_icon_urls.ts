import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tipos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('icon_url').defaultTo('mark_civil.png')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
