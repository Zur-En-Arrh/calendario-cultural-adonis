import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Evento from './Evento';
import Usuario from './Usuario';

export default class Comentario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public comentario: string

  @column()
  public userId: number

  @hasOne(() => Usuario, {
    foreignKey: 'id',
    localKey: 'userId',
    serializeAs: 'usuario'
  })
  public usuario: HasOne<typeof Usuario>

  @column()
  public eventoId: number

  @hasOne(() => Evento, {
    foreignKey: 'id',
    localKey: 'eventoId',
    serializeAs: 'evento'
  })
  public evento: HasOne<typeof Evento>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
