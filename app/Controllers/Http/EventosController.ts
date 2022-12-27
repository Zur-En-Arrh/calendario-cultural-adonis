// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import Application from '@ioc:Adonis/Core/Application';
import Evento from '../../Models/Evento'
import EventoValidator from "App/Validators/EventoValidator";

export default class EventosController {

  public async index({view}) : HttpContextContract {
    const eventos = await Evento.all()
    console.log(eventos)
    const path = Application.tmpPath('/uploads')
    return view.render('eventos/index', {eventos, path})
  }

  public async create({view}) : HttpContextContract {
    return view.render('eventos/create')
  }

  public async store({request, view, response}) : HttpContextContract {
    const eventoPayload = await request.validate(EventoValidator)
    eventoPayload.foto.clientName = new Date().getTime().toString()+'.'+eventoPayload.foto.extname

    await Evento.create({
      nome: eventoPayload.nome,
      frequencia: eventoPayload.frequencia,
      cidade: eventoPayload.cidade,
      foto: eventoPayload.foto.clientName
    })

    await eventoPayload.foto.move(Application.publicPath('images'))
    return response.redirect().toRoute('eventos.create')
  }
}
