import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public nome: string

  @column()
  public sobrenome: string

  @column()
  public sexo: string

  @column({
    consume: (value) => {
      let data = new Date(value)
      let mes = data.getMonth() + 1
      let dia = data.getDate()
      let mesString = mes.toString()
      let diaString = dia.toString()
      console.log("para para para", data.getFullYear()+"-"+data.getMonth()+"-"+data.getDate())
      if(mes < 10)
        mesString = "0"+mes
      if(dia < 10)
        diaString = "0"+dia
      return data.getFullYear()+"-"+mesString+"-"+diaString
    }
  })
  public dataNascimento: Date

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (usuario: Usuario) {
    if (usuario.$dirty.password) {
      usuario.password = await Hash.make(usuario.password)
    }

    /*
    let data = new Date(usuario.dataNascimento)

    if(usuario.$dirty.dataNascimento) {
      usuario.dataNascimento = data.getFullYear()+"-"+data.getMonth()+"-"+data.getDate()
    }
    */
  }
}
