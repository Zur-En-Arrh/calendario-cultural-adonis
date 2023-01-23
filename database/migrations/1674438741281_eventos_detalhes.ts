import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'eventos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('estacionamento')
      table.boolean('deficiencia')
      table.boolean('medico')
      table.boolean('seguranca')
      table.boolean('caixa')
      table.boolean('banheiro')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
