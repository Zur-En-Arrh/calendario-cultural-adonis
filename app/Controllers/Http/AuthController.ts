// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from '../../Models/Usuario'
import LoginValidator from '../../Validators/LoginValidator'
export default class AuthController {

  public async create({view}) {
    return view.render('login')
  }

  public async store({auth, request, response}) {
    const loginPayload = await request.validate(LoginValidator)

    try {
      console.log(loginPayload)
      await auth.use('web').attempt(loginPayload.email, loginPayload.password)
    }catch (e) {
      console.log(e)
      return response.redirect().toRoute('auth.create')
    }

    return response.redirect().toRoute('usuario.edit')
  }

  public async logout({auth, response}) {
    await auth.logout()
    response.redirect().toRoute('auth.create')
  }
}
