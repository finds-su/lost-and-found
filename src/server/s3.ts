import { S3Client } from '@aws-sdk/client-s3'
import { env } from '@/env.mjs'

export const s3 = new S3Client({
  endpoint: env.S3_UPLOAD_ENDPOINT_URL,
  region: env.S3_UPLOAD_REGION,
  credentials: {
    accessKeyId: env.S3_UPLOAD_KEY,
    secretAccessKey: env.S3_UPLOAD_SECRET,
  },
})
