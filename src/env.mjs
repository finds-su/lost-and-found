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
    REDIS_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),

    MIREA_CLIENT_ID: z.string().nullish(),
    MIREA_CLIENT_SECRET: z.string().nullish(),

    MIREA_LKS_CLIENT_ID: z.string().nullish(),
    MIREA_LKS_CLIENT_SECRET: z.string().nullish(),

    GOOGLE_CLIENT_ID: z.string().nullish(),
    GOOGLE_CLIENT_SECRET: z.string().nullish(),

    GITHUB_CLIENT_ID: z.string().nullish(),
    GITHUB_CLIENT_SECRET: z.string().nullish(),

    CALLBACK_URL: z.string().url(),
    CALLBACK_SECRET_URL_STRING: z.string().min(1).max(32),
    VK_BOT_TOKEN: z.string().min(1),
    VK_GROUP_ID: z
      .string()
      .min(1)
      .transform((value) => Number(value)),
    TELEGRAM_BOT_TOKEN: z.string().min(1),
    TELEGRAM_BOT_NAME: z.string().min(1),

    IMAGE_CAPTION_HOST: z.string().url(),

    INNGEST_SIGNING_KEY: z.string().min(1),
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

    REDIS_URL: process.env.REDIS_URL,

    MIREA_CLIENT_ID: process.env.MIREA_CLIENT_ID,
    MIREA_CLIENT_SECRET: process.env.MIREA_CLIENT_SECRET,

    MIREA_LKS_CLIENT_ID: process.env.MIREA_LKS_CLIENT_ID,
    MIREA_LKS_CLIENT_SECRET: process.env.MIREA_LKS_CLIENT_SECRET,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    CALLBACK_URL: process.env.CALLBACK_URL,
    CALLBACK_SECRET_URL_STRING: process.env.CALLBACK_SECRET_URL_STRING,
    VK_BOT_TOKEN: process.env.VK_BOT_TOKEN,
    VK_GROUP_ID: process.env.VK_GROUP_ID,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME,

    IMAGE_CAPTION_HOST: process.env.IMAGE_CAPTION_HOST,

    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
