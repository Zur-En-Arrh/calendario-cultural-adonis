import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Evento extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string


  @column()
  public cidade: string


  @column()
  public foto: string


  @column()
  public frequencia: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
