import { Hono } from 'hono'
import prismaClients from './lib/prisma'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const prisma = await prismaClients.fetch(c.env.DB)
  const users = await prisma.user.findMany()

  return c.json(users)
})

export default app
