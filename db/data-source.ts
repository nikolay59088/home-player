import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Users } from './entity/Users.ts'


export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './homePlayer.db',
  synchronize: true,
  logging: false,
  entities: [Users],
  migrations: [],
  subscribers: [],
})
