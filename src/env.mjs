import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    ANALYZE: z
      .enum(['true', '1', 'false', '0'])
      .transform((value) => value === 'true' || value === '1'),
    DISABLE_PWA: z
      .enum(['true', '1', 'false', '0'])
      .transform((value) => value === 'true' || value === '1'),
    S3_UPLOAD_KEY: z.string().min(1),
    S3_UPLOAD_SECRET: z.string().min(1),
    S3_UPLOAD_BUCKET: z.string().min(1),
    S3_UPLOAD_HOSTNAME: z.string().min(1),
    S3_UPLOAD_ENDPOINT_URL: z.string().url(),
    S3_UPLOAD_REGION: z.string().min(1),
    OPENAI_API_KEY: z.string().startsWith('sk-'),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    MIREA_CLIENT_ID: z.string().min(1),
    MIREA_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get typeerrors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS: z.string().transform((value) => value.split(',')),
    NEXT_PUBLIC_CDN_ENDPOINT_URL: z.string().url(),
    NEXT_PUBLIC_NEXTAUTH_URL: z.string().url(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get typeerrors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    DATABASE_URL: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`,
    NODE_ENV: process.env.NODE_ENV,

    ANALYZE: process.env.NODE_ENV === 'production' ? 'false' : process.env.ANALYZE,
    DISABLE_PWA: process.env.NODE_ENV === 'production' ? 'false' : process.env.DISABLE_PWA,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,

    S3_UPLOAD_KEY: process.env.S3_UPLOAD_KEY,
    S3_UPLOAD_SECRET: process.env.S3_UPLOAD_SECRET,
    S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET,
    S3_UPLOAD_HOSTNAME: process.env.S3_UPLOAD_HOSTNAME,
    S3_UPLOAD_ENDPOINT_URL: process.env.S3_UPLOAD_ENDPOINT_URL,
    NEXT_PUBLIC_CDN_ENDPOINT_URL: process.env.NEXT_PUBLIC_CDN_ENDPOINT_URL,
    S3_UPLOAD_REGION: process.env.S3_UPLOAD_REGION,
    NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS: process.env.NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS,

    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

    MIREA_CLIENT_ID: process.env.MIREA_CLIENT_ID,
    MIREA_CLIENT_SECRET: process.env.MIREA_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },
})
