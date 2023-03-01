import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cidade from 'App/Models/Cidade'

export default class extends BaseSeeder {
  public async run () {
    await Cidade.createMany([
      {
        nome:'Paraty',
        regiaoId: 8
      }
    ])
  }
}
