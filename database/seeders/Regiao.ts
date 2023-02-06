import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Regioe from 'App/Models/Regiao'

export default class extends BaseSeeder {
  public async run () {
    await Regioe.createMany([
      {
        nome:'Região Metropolitana',
      },
      {
        nome:'Região Noroeste Fluminense',
      },
      {
        nome:'Região Norte Fluminense',
      },
      {
        nome:'Região Serrana',
      },
      {
        nome:'Região das Baixadas Litorâneas',
      },
      {
        nome:'Região do Médio Paraíba',
      },
      {
        nome:'Região Centro-Sul Fluminense',
      },
      {
        nome:'Região da Costa Verde',
      }
    ])
  }
}
