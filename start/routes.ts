/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ response }) => {
  return response.redirect().toRoute('auth.create')
})

Route.get('/images/:path/:name', 'EventosController.foto').as('eventos.foto')

Route.group(() => {
  Route.get('/editar', 'UsuariosController.edit').as('usuario.edit')
  Route.get('/logout', 'AuthController.logout').as('auth.logout')

  Route.get('/perfil', 'UsuariosController.show').as('usuario.perfil')

}).middleware('auth:web')

Route.group(() => {
  Route.group(() => {
    Route.get('/create', 'EventosController.create').as('eventos.create')
    Route.post('/store', 'EventosController.store').as('eventos.store')
    Route.get('/edit/:id', 'EventosController.edit').as('eventos.edit')
    Route.get('/delete/:id', 'EventosController.destroy').as('eventos.delete')
    Route.post('/update/:id', 'EventosController.store').as('eventos.update')
  }).middleware('auth:web')

  Route.post('/favorito', 'EventosController.like').as('eventos.favorito')
  Route.post('/desfavoritar', 'EventosController.dislike').as('eventos.desfavorito')

  Route.get('/show/:id', 'EventosController.show').as('eventos.show')
  Route.get('/search', 'EventosController.search').as('eventos.search')
  Route.get('/', 'EventosController.index').as('eventos.index')
  Route.get('/todos', 'EventosController.getAll').as('eventos.todos')

}).prefix('eventos')


Route.group(() => {
  Route.post('/store', 'ComentariosController.store').as('comentario.store')
  Route.get('/delete/:id', 'ComentariosController.destroy').as('comentario.delete')
  Route.post('/edit/:id', 'ComentariosController.update').as('comentario.update')
  Route.get('/evento/:id', 'ComentariosController.getByEvent').as('comentario.evento')
}).prefix('comentario')
  //.middleware('auth:web')

Route.get('/cadastro', 'UsuariosController.create').as('usuario.create')
Route.post('/cadastro', 'UsuariosController.store').as('usuario.store')
Route.get('/login', 'AuthController.create').as('auth.create')

Route.post('/login', 'AuthController.store').as('auth.store')

Route.get('/mapa', 'EventosController.map').as('mapa.index').middleware('auth:web')
