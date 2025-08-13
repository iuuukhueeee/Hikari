import { HTTPException } from 'hono/http-exception'

// export const bootstrapUrl = (url: string): string => {
//   if (!url.startsWith('http://') && !url.startsWith('https://')) {
//     return `https://${url}`
//   }
//   return url
// }

const formatUrl = (url: string): string => {
  let newUrl = ''
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    newUrl = 'https://' + url
    if (!url.includes('www.')) {
      newUrl = newUrl.replace('https://', 'https://www.')
    }
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (!url.includes('www.')) {
      if (url.startsWith('http://')) {
        newUrl = url.replace('http://', 'http://www.')
      }

      if (url.startsWith('https://')) {
        newUrl = url.replace('https://', 'https://www.')
      }
    }
  }

  if (!newUrl) {
    console.log(url)
    return url
  }
  console.log(newUrl)
  return newUrl
}

// const parseUrl = (url: string): void => {
//   let parsedUrl = URL.parse(url)

//   if (!parsedUrl || !parsedUrl.protocol || !parsedUrl.host) {
//     throw new HTTPException(400, { message: 'Invalid URL format' })
//   }
// }

export default formatUrl
