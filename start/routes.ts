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

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
Route.group(() => {
  Route.get('/editar', 'UsuariosController.edit').as('usuario.edit')
  Route.get('/logout', 'AuthController.logout').as('auth.logout')

}).middleware('auth:web')

Route.group(() => {
  Route.get('/create', 'EventosController.create').as('eventos.create')
  Route.post('/store', 'EventosController.store').as('eventos.store')
  Route.get('/', 'EventosController.index').as('eventos.index')
})
  .middleware('auth:web')
  .prefix('eventos')



Route.get('/cadastro', 'UsuariosController.create').as('usuario.create')
Route.post('/cadastro', 'UsuariosController.store').as('usuario.store')
Route.get('/login', 'AuthController.create').as('auth.create')

Route.post('/login', 'AuthController.store').as('auth.store')
