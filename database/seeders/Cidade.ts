import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cidade from 'App/Models/Cidade'

export default class extends BaseSeeder {
  public async run () {
    await Cidade.createMany([
      {
        nome:'Resende',
        regiaoId: 1
      },
      {
        nome:'Niterói',
        regiaoId: 1
      },
      {
        nome:'Japeri',
        regiaoId: 1
      },
      {
        nome:'Petrópolis',
        regiaoId: 4
      },
      {
        nome:'Mesquita',
        regiaoId: 1
      },
      {
        nome:'Rio de Janeiro',
        regiaoId: 1
      },
      {
        nome:'Belford Roxo',
        regiaoId: 1
      },
      {
        nome:'Nova Iguaçu',
        regiaoId: 1
      }
    ])
  }
}
