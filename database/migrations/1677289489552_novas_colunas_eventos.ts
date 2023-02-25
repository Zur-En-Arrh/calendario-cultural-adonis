import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'eventos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('descricao')
      table.string('endereco').defaultTo('Rua Itacuruçá, 55')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
