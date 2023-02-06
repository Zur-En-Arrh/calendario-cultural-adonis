import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'eventos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('cidade')
      table.integer('cidade_id').references('cidades.id').defaultTo(6)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
