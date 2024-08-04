import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'

export default class GamesController {
  public async index({response}: HttpContextContract) {
    const games = await Game.all()
    return response.status(200).json(games)
  }


  public async store({response, request}: HttpContextContract) {
    const body = request.only([
      'player_one',
      'player_two',
      'winner'
    ])

    const game = (await Game.create(body))
    return response.status (201).json(game)
  }

  public async show({response, params}: HttpContextContract) {
    try{
      const game = await Game.findOrFail(params.id)
      return response.status(200).json(game)
    } catch (error) {
      return response.status(404).json({message: 'Juego no encontrado'})
    }
  }

  public async update({response, request, params}: HttpContextContract) {
    try{
      const game = await Game.findOrFail(params.id)
      const body = request.only([
        'player_one',
        'player_two',
        'winner'
      ])

      game.merge(body)
      await game.save()
      return response.status(200).json(game)
    } catch (error) {
      return response.status(404).json({message: 'Juego no encontrado'})
    }
  }

  public async destroy({response, params}: HttpContextContract) {
    try{
      const game = await Game.findOrFail(params.id)
      await game.delete()
      return response.status(204)
    } catch (error) {
      return response.status(404).json({message: 'Juego no encontrado'})
    }
  }

  public async startGame({ request, response }: HttpContextContract) {
    const { player1, player2 } = request.body()
    return response.json({ player1, player2, message: 'Game started' })
  }
}
