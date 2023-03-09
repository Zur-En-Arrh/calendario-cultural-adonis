import Application from '@ioc:Adonis/Core/Application';
import Evento from '../../Models/Evento'
import EventoValidator from "App/Validators/EventoValidator";
import Tipo from "App/Models/Tipo";
import Cidade from "App/Models/Cidade";
import Usuario from '../../Models/Usuario';
import Regioe from "App/Models/Regiao";
import Database from "@ioc:Adonis/Lucid/Database";
import NodeGeocoder from 'node-geocoder';

const options = {
  provider: 'google',
  apiKey: 'AIzaSyCQeareefn39XfUvF3pDMLIvXPCXZOpis4',
}

export default class EventosController {

  geocoder = NodeGeocoder(options);

  public async map({view}) : HttpContextContract {
    return view.render('mapa')
  }

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


  public async search({params, request, view}) : HttpContextContract {
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
    eventos.map(async (e) => {
      e.cidade = await Cidade.find(e.cidade_id)
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
    return view.render('search', {path, eventos, tiposIds, tiposNomes, cidadesIds, cidadesNomes, regioesIds, regioesNomes})
  }

  public async foto({params, response}) : HttpContextContract {
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

  public async store({auth, bouncer, params, request, response}) : HttpContextContract {

    if(await bouncer.with('EventoPolicy').denies('destroy', auth.user)) {
      return response.redirect().toRoute('eventos.show', {id: params.id})
    }

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
      evento.descricao =  eventoPayload.descricao
      evento.endereco =  eventoPayload.endereco

      const [geo] = await this.geocoder.geocode(evento.endereco)

      evento.lat = geo.latitude
      evento.lng = geo.longitude
      evento.save()
      return response.redirect().toRoute('eventos.index')
    } else {
      eventoPayload.foto.clientName = new Date().getTime().toString()+'.'+eventoPayload.foto.extname
      const [geo] = await this.geocoder.geocode(eventoPayload.endereco)

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
        descricao: eventoPayload.descricao,
        endereco: eventoPayload.endereco,
        lat: geo.latitude,
        lng: geo.longitude
      })
      await eventoPayload.foto.move(Application.publicPath('images'))
      return response.redirect().toRoute('eventos.index')
    }

  }

  public async edit({auth, bouncer, params, response, view}) : HttpContextContract {

    if(await bouncer.with('EventoPolicy').denies('edit', auth.user)) {
      return response.redirect().toRoute('eventos.show', {id: params.id})
    }

    const evento = await Evento.find(params.id)
    if(evento) {
      const cidades = await Cidade.all()
      const cidadesIds = cidades.map((cidade)=>cidade.id)
      const cidadesNomes = cidades.map((cidade)=>cidade.nome)
      const tipos = await Tipo.all()
      const tiposIds = tipos.map(tipo => tipo.id)
      const tiposNomes = tipos.map(tipo => tipo.nome)
      return view.render('eventos/edit', {evento, tiposIds, tiposNomes, cidadesIds, cidadesNomes})
    } else {
      return response.redirect().toRoute('eventos.index')
    }

  }

  public async destroy({auth, bouncer, params, response}) : HttpContextContract {

    if(await bouncer.with('EventoPolicy').denies('destroy', auth.user)) {
      return response.redirect().toRoute('eventos.show', {id: params.id})
    }

    const evento = await Evento.find(params.id)
    await evento.delete()
    return response.redirect().toRoute('eventos.index')
  }

  public async show({view, params, response}) : HttpContextContract {
    const evento = await Evento.query().where('id', params.id).preload('cidade').preload('usuarios').first()
    if(evento) {
      evento.tipo = await Tipo.find(evento.tipoId)

      /*const query = await Comentario.query().where('eventoId', params.id).preload('usuario').orderBy('createdAt', 'desc')
      const comentarios = query.map(com => {
        let format = com.createdAt.day+'/'+com.createdAt.month+'/'+com.createdAt.year
        return {id: com.id, dataFormatada: format, comentario: com.comentario, userId: com.userId, eventoId: com.eventoId, usuario: com.usuario}
      })*/
      return view.render('eventos/show', {evento})
    } else {
      return response.redirect().toRoute('eventos.index')
    }
  }

  public async like({response, request}) : HttpContextContract {
    const user = await Usuario.find(request.input('userId'))
    const evento = await Evento.find(request.input('eventoId'))
    if(evento && user)
      await evento.related('usuarios').attach([user.id])
    return response.send({evento: request.input('eventoId'), usuario: request.input('userId')})
  }

  public async dislike({response, request}) : HttpContextContract {
    const user = await Usuario.find(request.input('userId'))
    const evento = await Evento.find(request.input('eventoId'))
    if(evento && user)
      await evento.related('usuarios').detach([user.id])
    return response.send({evento: request.input('eventoId'), usuario: request.input('userId')})
  }

  public async getAll({response }): HttpContextContract {
    const eventos = await Evento.query().preload('tipo').preload('cidade')
    return response.send(eventos)
  }

}
