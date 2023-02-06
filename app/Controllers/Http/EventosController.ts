import { typeHttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import Application from '@ioc:Adonis/Core/Application';
import Evento from '../../Models/Evento'
import EventoValidator from "App/Validators/EventoValidator";
import Tipo from "App/Models/Tipo";
import Comentario from "App/Models/Comentario"

export default class EventosController {

  public async index({view}) : HttpContextContract {
    const eventos = await Evento.query().preload('tipo')
    const tipos = {}
    eventos.map(e => {
      if(e.tipo.nome in tipos) {
        tipos[e.tipo.nome].push(e)
      }else {
        tipos[e.tipo.nome] = [e]
      }
    })

    const categorias = await Tipo.all()
    const tiposIds = categorias.map(tipo => tipo.id)
    const tiposNomes = categorias.map(tipo => tipo.nome)
    const path = Application.tmpPath('/uploads')
    //return view.render('eventos/index', {eventos, path})
    return view.render('eventos', {path, tipos, tiposIds, tiposNomes})
  }

  public async foto({view, response, params}) : HttpContextContract {
    response.header('Content-Type', 'image/gif');
    let file
    if(params.path == 'public')
      file = Application.publicPath(`images/${params.name}`)
    else
      file = Application.resourcesPath(`img/${params.name}`)

    return response.download(file)
  }

  public async create({view}) : HttpContextContract {
    const tipos = await Tipo.all()
    const tiposIds = tipos.map(tipo => tipo.id)
    const tiposNomes = tipos.map(tipo => tipo.nome)
    return view.render('eventos/create', {tiposIds, tiposNomes})
  }

  public async store({request, view, response, params}) : HttpContextContract {
    const id = params.id
    const eventoPayload = await request.validate(EventoValidator)
    if(id)
    {
      const evento = await Evento.find(id)

      if(eventoPayload.foto) {
        eventoPayload.foto.clientName = new Date().getTime().toString()+'.'+eventoPayload.foto.extname
        evento.foto = eventoPayload.foto.clientName
        await eventoPayload.foto.move(Application.publicPath('images'))
      }

      evento.nome = eventoPayload.nome
      evento.cidade = eventoPayload.cidade
      evento.frequencia = eventoPayload.frequencia
      evento.tipoId = eventoPayload.tipoId
      evento.estacionamento = eventoPayload.estacionamento,
      evento.medico = eventoPayload.medica
      evento.banheiro = eventoPayload.banheiro
      evento.deficiencia = eventoPayload.deficiencia
      evento.seguranca = eventoPayload.seguranca
      evento.caixa = eventoPayload.caixa
      evento.save()
      return response.redirect().toRoute('eventos.index')
    } else {
      eventoPayload.foto.clientName = new Date().getTime().toString()+'.'+eventoPayload.foto.extname
      await Evento.create({
        nome: eventoPayload.nome,
        frequencia: eventoPayload.frequencia,
        cidade: eventoPayload.cidade,
        foto: eventoPayload.foto.clientName,
        tipoId: eventoPayload.tipoId,
        estacionamento: eventoPayload.estacionamento,
        medico: eventoPayload.medica,
        banheiro: eventoPayload.banheiro,
        deficiencia: eventoPayload.deficiencia,
        seguranca: eventoPayload.seguranca,
        caixa: eventoPayload.caixa,
      })
      await eventoPayload.foto.move(Application.publicPath('images'))
      return response.redirect().toRoute('eventos.index')
    }

  }

  public async edit({view, params}) : HttpContextContract {
    const evento = await Evento.find(params.id)
    const tipos = await Tipo.all()
    const tiposIds = tipos.map(tipo => tipo.id)
    const tiposNomes = tipos.map(tipo => tipo.nome)
    return view.render('eventos/edit', {evento, tiposIds, tiposNomes})

  }

  public async destroy({params, response}) : HttpContextContract {
    const evento = await Evento.find(params.id)
    await evento.delete()
    return response.redirect().toRoute('eventos.index')
  }

  public async show({view, params}) : HttpContextContract {
    const evento = await Evento.find(params.id)
    evento.tipo = await Tipo.find(evento.tipoId)
    const comentarios = await Comentario.query().where('eventoId', params.id).preload('usuario').orderBy('createdAt', 'desc')
    return view.render('eventos/show', {evento, comentarios})
  }

}
