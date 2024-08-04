import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {

  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public names: string

  @column()
  public lastnames: string

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public password: string
  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column()
  public played_games: number

  //lo de arriba no iria en el metodo, solo se  estara actualizando, lo de abajao se ira sumando se le pasara un uno, segun un usuario
  @column()
  public won_games: number

  @column()
  public lost_games: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
