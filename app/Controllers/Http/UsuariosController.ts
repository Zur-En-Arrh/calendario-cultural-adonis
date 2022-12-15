// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from '../../Models/Usuario'
export default class UsuariosController {
  public async create({view, request}) {
    const usuarios = await Usuario.all()
    console.log(usuarios)
    return view.render('cadastro')
  }

  public async store({view, request}) {
    const {nome} = request.all()

    return nome
  }
}
