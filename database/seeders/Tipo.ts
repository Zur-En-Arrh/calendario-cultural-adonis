import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tipo from '../../app/Models/Tipo'

export default class extends BaseSeeder {

  public async run () {
    // Write your database queries inside the run method
    await Tipo.createMany([{
      nome: 'esportivo'
    },{
      nome: 'militar'
    },{
      nome: 'religioso'
    },{
      nome: 'cultural'
    },{
      nome: 'histórico'
    },{
      nome: 'civil'
    },{
      nome: 'musical'
    },{
      nome: 'político'
    }])
  }
}
