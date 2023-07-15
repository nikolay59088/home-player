import { PrismaClient } from '@prisma/client'

let db: PrismaClient;

//check if we are running in production mode
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
} else {
//check if there is already a connection to the database

  // @ts-ignore
  if (!global.db) {
    // @ts-ignore
    global.db = new PrismaClient()
  }

  // @ts-ignore
  db = global.db
}

export { db };
