import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Game extends BaseModel {

  public static table = 'games'

  @column({ isPrimary: true })
  public id: number

  @column()
  public player_one: string

  @column()
  public player_two: string

  @column()
  public winner: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
