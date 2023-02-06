import ComentarioValidator from 'App/Validators/ComentarioValidator';
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Comentario from "App/Models/Comentario"

export default class ComentariosController {
  public async store({response, request}) : HttpContextContract {
    const comentarioPayload = await request.validate(ComentarioValidator)
    const comentario = await Comentario.create(comentarioPayload)
    return {...comentario}
  }

  public async destroy({params, response}) {
    const coment = await Comentario.find(params.id)
    await coment.delete()
    return response.send({res: 'OK'})
  }

  public async update({params, response, request}) {
    const comentarioPayload = await request.validate(ComentarioValidator)
    const coment = await Comentario.find(params.id)
    coment.comentario = comentarioPayload.comentario
    await coment.save()

    return response.send({res: 'OK'})

  }
}
