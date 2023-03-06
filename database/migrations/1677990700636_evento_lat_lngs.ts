import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'eventos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.double('lat').defaultTo(-22.9144619)
      table.double('lng').defaultTo(-43.6885977)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
