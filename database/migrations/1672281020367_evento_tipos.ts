import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'eventos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tipo_id').unsigned().references('tipos.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
