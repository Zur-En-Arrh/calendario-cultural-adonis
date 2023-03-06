import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Tipo from './Tipo'
import Cidade from './Cidade'
import Usuario from './Usuario'

export default class Evento extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public tipoId: number

  @hasOne(() => Tipo, {
    foreignKey: 'id',
    localKey: 'tipoId',
    serializeAs: 'tipo'
  })
  public tipo: HasOne<typeof Tipo>

  @column()
  public foto: string

  @column()
  public frequencia: string

  @column()
  public estacionamento : boolean

  @column()
  public deficiencia : boolean

  @column()
  public medico : boolean

  @column()
  public caixa : boolean

  @column()
  public banheiro : boolean

  @column()
  public seguranca : boolean

  @column()
  public cidadeId: number

  @column()
  public descricao: string

  @column()
  public endereco: string

  @column()
  public lat: number

  @column()
  public lng: number

  @hasOne(() => Cidade, {
    foreignKey: 'id',
    localKey: 'cidadeId',
    serializeAs: 'cidade'
  })
  public cidade: HasOne<typeof Cidade>


  @manyToMany(() => Usuario, {
    localKey: 'id',
    pivotForeignKey: 'evento_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'favoritos'
  })
  public usuarios: ManyToMany<typeof Usuario>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
