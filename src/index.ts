import { Hono } from 'hono'
import prismaClients from './lib/prisma'
import generateUUID from './lib/generateUUID'
import { HTTPException } from 'hono/http-exception'
import formatUrl from './lib/formatUrl'

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
  const uuid = generateUUID()

  if (originalUrl) {
    const formatedUrl = formatUrl(originalUrl)

    const url = await prisma.url.create({
      data: {
        originalUrl: formatedUrl,
        shortUrl: uuid,
        displayUrl: `https://hikari.nguyenducthien9.workers.dev/${uuid}`,
        description: null,
      },
    })

    return c.text(url.displayUrl)
  }

  throw new HTTPException(400, { message: 'url parameter is required' })
})

app.post('/', async (c) => {
  const prisma = await prismaClients.fetch(c.env.DB)
  const { originalUrl, shortUrl, description } = await c.req.json()
  const uuid = generateUUID()

  if (originalUrl) {
    const formatedUrl = formatUrl(originalUrl)

    const isExist =
      shortUrl &&
      (await prisma.url.findUnique({
        where: {
          shortUrl: shortUrl,
        },
      }))

    if (isExist) {
      throw new HTTPException(409, { message: 'Short URL already exists' })
    }

    const url = await prisma.url.create({
      data: {
        originalUrl: formatedUrl,
        shortUrl: shortUrl ?? uuid,
        description: description ?? null,
        displayUrl: `https://hikari.nguyenducthien9.workers.dev/${shortUrl ?? uuid}`,
      },
    })

    return c.text(url.displayUrl)
  }
  throw new HTTPException(400, { message: 'url parameter is required' })
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
