import ComentarioValidator from 'App/Validators/ComentarioValidator';
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Comentario from "App/Models/Comentario"
import Ws from 'App/Services/Ws';

export default class ComentariosController {
  public async getByEvent({params, response}) : HttpContextContract {
    const query = await Comentario.query().where('eventoId', params.id).preload('usuario').orderBy('createdAt', 'desc')
    const comentarios = query.map(com => {
      let format = com.createdAt.day+'/'+com.createdAt.month+'/'+com.createdAt.year
      return {id: com.id, dataFormatada: format, comentario: com.comentario, userId: com.userId, eventoId: com.eventoId, usuario: com.usuario}
    })
    return response.send(comentarios)
  }

  public async store({response, request}) : HttpContextContract {
    const comentarioPayload = await request.validate(ComentarioValidator)
    const comentario = await Comentario.create(comentarioPayload)
    const dataFormatada = comentario.createdAt.day+'/'+comentario.createdAt.month+'/'+comentario.createdAt.year
    Ws.io.emit('novo:comentario', {...comentario, id: comentario.id, usuario: request.input('usuario'), dataFormatada})
    return response.send({res:'OK'})
  }

  public async destroy({params, response}) {
    const coment = await Comentario.find(params.id)
    const eventoId = coment.eventoId
    await coment.delete()
    Ws.io.emit('delecao:comentario', {id: params.id, eventoId})
    return response.send({res: 'OK'})
  }

  public async update({params, response, request}) {
    const comentarioPayload = await request.validate(ComentarioValidator)
    const coment = await Comentario.find(params.id)
    coment.comentario = comentarioPayload.comentario
    await coment.save()
    console.log(coment.comentario, comentarioPayload.comentario)
    const dataFormatada = coment.createdAt.day+'/'+coment.createdAt.month+'/'+coment.createdAt.year
    Ws.io.emit('mudanca:comentario', {...coment, id: params.id, dataFormatada, usuario: request.input('usuario')})
    return response.send({res: 'OK'})

  }
}
