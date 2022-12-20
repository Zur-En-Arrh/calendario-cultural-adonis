import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from '../../Models/Usuario'
import UsuarioValidator from '../../Validators/UsuarioValidator'

export default class UsuariosController {
  public async create({view, request}) : HttpContextContract{
    const usuarios = await Usuario.all()
    console.log(usuarios)
    return view.render('cadastro')
  }

  public async store({view, request, response}) : HttpContextContract {
    const userPayload = await request.validate(UsuarioValidator)

    console.log(userPayload)

    let query = null
    const id = request.input('id')
    if(id)
    {
        const user = await Usuario.findOrFail(id)
        Object.keys(userPayload).forEach(attr => {
          if(attr != 'id' && attr != 'password')
              user[attr] = userPayload[attr]
        })
        query = await user.save()
    }else   query = await Usuario.create(userPayload)

    console.log(query)
    if(id)
       return response.redirect().toRoute('usuario.edit')
    return response.redirect().toRoute('auth.create')
  }

  public async edit({view, request, auth}) {
    //console.log("User-->", auth.user)
    return view.render('cadastro')
  }
}
