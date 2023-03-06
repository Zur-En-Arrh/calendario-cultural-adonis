import NodeGeocoder from 'node-geocoder';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from '../../Models/Usuario'
import Evento from 'App/Models/Evento'
import UsuarioValidator from '../../Validators/UsuarioValidator'

const options = {
  provider: 'google',
  apiKey: 'AIzaSyCQeareefn39XfUvF3pDMLIvXPCXZOpis4',
}
export default class UsuariosController {
  geocoder = NodeGeocoder(options);

  public async create({view, request}) : HttpContextContract{
    const usuarios = await Usuario.all()
    return view.render('cadastro')
  }

  public async show({auth, view, request}) : HttpContextContract {
    const eventos = await Evento.query().whereHas('usuarios', (userQuery) => {
      userQuery.where('id', auth.user.id)
    })
    return view.render('usuarios/profile', {eventos: eventos})
  }

  public async store({view, request, response}) : HttpContextContract {
    const userPayload = await request.validate(UsuarioValidator)

    const [geo] = await this.geocoder.geocode(userPayload.endereco)

    userPayload.lat = geo.latitude
    userPayload.lng = geo.longitude

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

    if(id)
       return response.redirect().toRoute('usuario.edit')
    return response.redirect().toRoute('auth.create')
  }

  public async edit({auth, view}) {
    console.log("User-->", auth.user)
    return view.render('cadastro')
  }
}
