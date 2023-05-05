import { APIRoute } from 'next-s3-upload'
import { env } from '@/env.mjs'

export default APIRoute.configure({
  accessKeyId: env.S3_UPLOAD_KEY,
  secretAccessKey: env.S3_UPLOAD_SECRET,
  bucket: env.S3_UPLOAD_BUCKET,
  endpoint: env.S3_UPLOAD_ENDPOINT_URL,
})
