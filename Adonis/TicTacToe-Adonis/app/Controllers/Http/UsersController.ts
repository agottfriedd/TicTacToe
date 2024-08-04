import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({auth, response}: HttpContextContract) {
    const user = auth.user
    if (user) {
      return response.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        played_games: user.played_games,
        won_games: user.won_games,
        lost_games: user.lost_games
      })
    }
    return response.status(401).json({message: 'No autorizado'})
  }


  public async store({response, request}: HttpContextContract) {
    const body = request.only([
      'names',
      'lastnames',
      'username',
      'email',
      'password'
    ])

    //VALIDACIONES
    if(await User.findBy('username', body.username)) {
      return response.status(400).json({message: 'Username en uso'})
    }
    if(await User.findBy('email', body.email)) {
      return response.status(400).json({message: 'Email en uso'})
    }

    const user = (await User.create(body))
    return response.status (201).json(user)
  }


  public async show({response, params}: HttpContextContract) {
    try{
      const user = await User.findOrFail(params.id)
      return response.status(200).json(user)
    } catch (error) {
      return response.status(404).json({message: 'Usuario no encontrado'})
    }
  }


  public async update({response, request, params}: HttpContextContract) {
    try{
      const user = await User.findOrFail(params.id)
      const body = request.only([
        'names',
        'lastnames',
        'username',
        'email',
        'password'
      ])

      //VALIDACIONES
      if(await User.findBy('username', body.username) && user.username !== body.username) {
        return response.status(400).json({message: 'Username en uso'})
      }
      if(await User.findBy('email', body.email) && user.email !== body.email) {
        return response.status(400).json({message: 'Email en uso'})
      }

      user.merge(body)
      await user.save()
      return response.status(200).json(user)
    } catch (error) {
      return response.status(404).json({message: 'Usuario no encontrado'})
    }
  }


  public async destroy({response, params}: HttpContextContract) {
    try{
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.status(200).json({message: 'Usuario eliminado'})
    } catch (error) {
      return response.status(404).json({message: 'Usuario no encontrado'})
    }
  }

  
  public async updateStats({ response, request, params }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('username', params.username)
      const { result } = request.only(['result'])
      console.log('Resultado recibido:', result)
  
      user.played_games += 1
  
      if (result === 'win') {
        user.won_games += 1
      } else if (result === 'loss') {
        user.lost_games += 1
      }
      // No need to update anything for 'draw'
  
      await user.save()
  
      return response.status(200).json({
        message: 'Estadísticas actualizadas',
        user: {
          id: user.id,
          username: user.username,
          played_games: user.played_games,
          won_games: user.won_games,
          lost_games: user.lost_games
        }
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Error al actualizar estadísticas' })
    }
  }
}
