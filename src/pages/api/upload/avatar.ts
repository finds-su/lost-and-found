import { APIRoute, sanitizeKey } from 'next-s3-upload'
import { env } from '@/env.mjs'
import { getSession } from 'next-auth/react'

export default APIRoute.configure({
  accessKeyId: env.S3_UPLOAD_KEY,
  secretAccessKey: env.S3_UPLOAD_SECRET,
  bucket: env.S3_UPLOAD_BUCKET,
  endpoint: env.S3_UPLOAD_ENDPOINT_URL,
  async key(req, filename) {
    const session = await getSession({ req })
    const extension = sanitizeKey(filename).split('.').at(-1)
    if (session) {
      return `${session.user.id}/avatar.${extension ?? ''}`
    }
    throw new Error('Неавторизован')
  },
})
