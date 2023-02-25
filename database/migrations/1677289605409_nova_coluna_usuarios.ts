import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('endereco').defaultTo('Avenida Governador Roberto Silveira, Moquetá')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
