// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import Application from '@ioc:Adonis/Core/Application';
import Evento from '../../Models/Evento'
import EventoValidator from "App/Validators/EventoValidator";
import Tipo from "App/Models/Tipo";
import Cidade from "App/Models/Cidade";
import Regiao from "Database/seeders/Regiao";
import Regioe from "App/Models/Regiao";
import Database from "@ioc:Adonis/Lucid/Database";

export default class EventosController {

  public async index({view}) : HttpContextContract {
    const eventos = await Evento.query().preload('tipo').preload('cidade')
    const tipos = {}
    eventos.map(e => {
      if(e.tipo.nome in tipos) {
        tipos[e.tipo.nome].push(e)
      }else {
        tipos[e.tipo.nome] = [e]
      }
    })

    const categorias = await Tipo.all()
    const cidades = await Cidade.all()
    const regioes = await Regioe.all()
    const tiposIds = categorias.map(tipo => tipo.id)
    const tiposNomes = categorias.map(tipo => tipo.nome)
    const regioesIds = regioes.map(regioes => regioes.id)
    const regioesNomes = regioes.map(regioes => regioes.nome)
    const cidadesIds = cidades.map((cidade)=>cidade.id)
    const cidadesNomes = cidades.map((cidade)=>cidade.nome)
    const path = Application.tmpPath('/uploads')
    //return view.render('eventos/index', {eventos, path})
    return view.render('eventos', {path, tipos, tiposIds, tiposNomes, cidadesIds, cidadesNomes, regioesIds, regioesNomes})
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

  public async search({view, params, request}) : HttpContextContract {
    console.log(params,request.all())
    let eventos = 'SELECT * FROM eventos'
    let where = false
    
    if(request.input('busca')){
      eventos += ' WHERE nome LIKE "%'+ request.input('busca') +'%"'
      where = true
    }   
    if(request.input('tipo')){
      eventos += where ? ' AND tipo_id = ' + request.input('tipo') : ' WHERE tipo_id = ' + request.input('tipo')
      where = true
    }
    if(request.input('regiao')){
      eventos += where ? ' AND cidade_id IN (SELECT id FROM cidades WHERE regiao_id = ' + request.input('regiao') + ')' : ' WHERE cidade_id IN (SELECT id FROM cidades WHERE regiao_id = ' + request.input('regiao') + ')'
      where = true
    }
    if(request.input('cidade')){
      eventos += where ? ' AND cidade_id = ' + request.input('cidade') : ' WHERE cidade_id = ' + request.input('cidade')
    }

    eventos = await Database.rawQuery(eventos)
    
    const categorias = await Tipo.all()
    const cidades = await Cidade.all()
    const regioes = await Regioe.all()
    const tiposIds = categorias.map(tipo => tipo.id)
    const tiposNomes = categorias.map(tipo => tipo.nome)
    const regioesIds = regioes.map(regioes => regioes.id)
    const regioesNomes = regioes.map(regioes => regioes.nome)
    const cidadesIds = cidades.map((cidade)=>cidade.id)
    const cidadesNomes = cidades.map((cidade)=>cidade.nome)
    const path = Application.tmpPath('/uploads')
    //return view.render('eventos/index', {eventos, path})

    return view.render('search', {path, eventos, tiposIds, tiposNomes, cidadesIds, cidadesNomes, regioesIds, regioesNomes})
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
      evento.cidadeId = eventoPayload.cidadeId
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
        cidadeId: eventoPayload.cidadeId,
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
    const cidades = await Cidade.all()
    const cidadesIds = cidades.map((cidade)=>cidade.id)
    const cidadesNomes = cidades.map((cidade)=>cidade.nome)
    const evento = await Evento.find(params.id)
    const tipos = await Tipo.all()
    const tiposIds = tipos.map(tipo => tipo.id)
    const tiposNomes = tipos.map(tipo => tipo.nome)
    return view.render('eventos/edit', {evento, tiposIds, tiposNomes, cidadesIds, cidadesNomes})

  }

  public async destroy({params, response}) : HttpContextContract {
    const evento = await Evento.find(params.id)
    await evento.delete()
    return response.redirect().toRoute('eventos.index')
  }

  public async show({view, params}) : HttpContextContract {
    const evento = await Evento.query().where('id', params.id).preload('cidade').first()
    console.log(evento)
    evento.tipo = await Tipo.find(evento.tipoId)
    return view.render('eventos/show', {evento})
  }

}
