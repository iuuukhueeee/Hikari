import { Hono } from 'hono'
import prismaClients from './lib/prisma'
import generateUUID from './lib/generateUUID'
import { HTTPException } from 'hono/http-exception'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// app.get('/', async (c) => {
//   const prisma = await prismaClients.fetch(c.env.DB)
//   const users = await prisma.user.findMany()

//   return c.json(users)
// })

app.get('/redirect', (c) => {
  return c.redirect('https://yusou.dev')
})

app.get('/', async (c) => {
  const prisma = await prismaClients.fetch(c.env.DB)
  const originalUrl = c.req.query('url')

  console.log(originalUrl)

  if (originalUrl) {
    const url = await prisma.url.create({
      data: {
        originalUrl: originalUrl,
        shortUrl: generateUUID(),
        description: null
      }
    })

    return c.json(url)

  }

  throw new HTTPException(400, { message: 'url parameter is required' })
})

app.post('/', async (c) => {
  const prisma = await prismaClients.fetch(c.env.DB)
  const { originalUrl, shortUrl, description } = await c.req.json()

  const url = await prisma.url.create({
    data: {
      originalUrl: originalUrl,
      shortUrl: shortUrl ?? generateUUID(),
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
