import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Tipo from './Tipo'

export default class Evento extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public cidade: string

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
