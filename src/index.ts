import { Hono } from 'hono'
import prismaClients from './lib/prisma'
import generateSha256Hash from './lib/generateSha256Hash'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const prisma = await prismaClients.fetch(c.env.DB)
  const users = await prisma.user.findMany()

  return c.json(users)
})

app.get('/redirect', (c) => {
  return c.redirect('https://yusou.dev')
})

app.post('/', async (c) => {
  const prisma = await prismaClients.fetch(c.env.DB)
  const { originalUrl, shortUrl, description } = await c.req.json()

  const url = await prisma.url.create({
    data: {
      originalUrl: originalUrl,
      shortUrl: shortUrl ?? generateSha256Hash(originalUrl),
      description: description ?? null,
    },
  })

  return c.json(url)
})

app.get('/:url', async (c) => {
  const url = c.req.param('url')
  const prisma = await prismaClients.fetch(c.env.DB)

  const foundUrl = await prisma.url.findUnique({
    where: {
      shortUrl: url,
    },
  })

  if (!foundUrl) {
    return c.text('URL not found', 404)
  }

  return c.redirect(foundUrl.originalUrl)
})

export default app
