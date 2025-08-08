import crypto from 'crypto'

const generateSha256Hash = (input: string): string => {
  const hash = crypto.createHash('sha256')
  hash.update(input)
  return hash.digest('hex')
}

export default generateSha256Hash
