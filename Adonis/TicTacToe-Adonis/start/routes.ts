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
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: "Welcome to Frank's Tic-Tac-Toe" }
})

//USERS
Route.get('/users', 'UsersController.index').middleware('auth:api')
Route.post('/users', 'UsersController.store')
Route.get('/users/:id', 'UsersController.show').middleware('auth:api')
//Route.put('/users/:id', 'UsersController.update').middleware('auth:api')
Route.delete('/users/:id', 'UsersController.destroy').middleware('auth:api')
Route.put('/users/:username/stats', 'UsersController.updateStats').middleware('auth:api')
//GAMES
Route.get('/games', 'GamesController.index').middleware('auth:api')
Route.post('/games', 'GamesController.store').middleware('auth:api')
Route.get('/games/:id', 'GamesController.show').middleware('auth:api')
Route.put('/games/:id', 'GamesController.update').middleware('auth:api')
Route.delete('/games/:id', 'GamesController.destroy').middleware('auth:api')
Route.post('/game', 'GamesController.startGame').middleware('auth')

//AUTH
Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout').middleware('auth:api')
