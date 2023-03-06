// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Usuario from '../../Models/Usuario'
import LoginValidator from '../../Validators/LoginValidator'
import { Exception } from '@adonisjs/core/build/standalone'
export default class AuthController {

  public async create({view}) {
    return view.render('login')
  }

  public async store({auth, request, response, session}) {
    const loginPayload = await request.validate(LoginValidator)
    const rememberMe = request.input('remember') == 'on'?true:false
    try {
      console.log(loginPayload)
      await auth.use('web').attempt(loginPayload.email, loginPayload.password, rememberMe)
    }catch (e) {
      session.flash({erro: 'Credenciais Inválidas'})
      return response.redirect().toRoute('auth.create')
    }

    return response.redirect().toRoute('usuario.perfil')
  }

  public async logout({auth, response}) {
    await auth.logout()
    response.redirect().toRoute('auth.create')
  }
}
