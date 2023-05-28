import { APIRoute, sanitizeKey } from 'next-s3-upload'
import { env } from '@/env.mjs'
import { getSession } from 'next-auth/react'

export default APIRoute.configure({
  accessKeyId: env.S3_UPLOAD_KEY,
  secretAccessKey: env.S3_UPLOAD_SECRET,
  bucket: env.S3_UPLOAD_BUCKET,
  region: env.S3_UPLOAD_REGION,
  endpoint: `https://${env.S3_UPLOAD_HOSTNAME}`,
  async key(req, filename) {
    const session = await getSession({ req })
    if (session) {
      return `tmp/${session.user.id}/${sanitizeKey(filename)}`
    }
    throw new Error('UNAUTHORIZED')
  },
})
