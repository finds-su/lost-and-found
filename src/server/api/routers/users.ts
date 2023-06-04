import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  AIrateLimiter,
  publicProcedure,
} from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { generateAvatar } from '@/server/openai'
import { s3 } from '@/server/s3'
import { env } from '@/env.mjs'
import axios from 'axios'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { sanitizeKey } from 'next-s3-upload'
import { CopyObjectCommand } from '@aws-sdk/client-s3'
import { zodEditUserInput } from '@/lib/validationTypes/users'

export const usersRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ nickname: z.string() }))
    .query(async ({ ctx, input }) => {
      const isOwner = !!(ctx.session && ctx.session.user.nickname === input.nickname)
      const user = await ctx.prisma.user.findUnique({
        where: {
          nickname: input.nickname,
        },
        select: {
          name: true,
          nickname: true,
          socialNetworks: {
            select: {
              socialNetwork: isOwner,
              link: isOwner,
            },
          },
          email: isOwner,
          userInfo: true,
          role: true,
          image: true,
          isBlocked: isOwner,
          blockReason: isOwner,
        },
      })
      return { user, isOwner }
    }),

  editUser: protectedProcedure.input(zodEditUserInput).mutation(async ({ ctx, input }) => {
    if (input.image) {
      // transfer preloaded image from bucket/tmp/user_id/file to bucket/user_id/file
      const key = input.image.split(`/tmp/${ctx.session.user.id}/`)[1]
      if (key) {
        const newKey = `${ctx.session.user.id}/${sanitizeKey(key)}`
        const copyCommand = new CopyObjectCommand({
          CopySource: `${env.S3_UPLOAD_BUCKET}/tmp/${ctx.session.user.id}/${key}`,
          Bucket: env.S3_UPLOAD_BUCKET,
          Key: newKey,
        })
        await s3.send(copyCommand)
        input.image = `${env.NEXT_PUBLIC_CDN_ENDPOINT_URL}/${newKey}`
      } else {
        input.image = undefined // do not change photo
      }
    }
    await ctx.prisma.$transaction(async (tx) => {
      const userToUpdate = await tx.user.findFirst({ where: { id: ctx.session.user.id } })
      if (userToUpdate === null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Несуществующий пользователь',
        })
      }
      if (
        userToUpdate.nickname !== input.nickname &&
        (await tx.user.findFirst({ where: { nickname: input.nickname } })) !== null
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Пользователь с таким никнеймом существует',
        })
      }
      await tx.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          nickname: input.nickname,
          image: input.image,
          email: input.email,
          userInfo: input.userInfo,
        },
      })
    })
  }),

  generateAIAvatar: protectedProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .optional()
          .transform((value) => {
            if (value === undefined || value.length !== 0) {
              return value
            }
            return 'придумай аватар'
          }),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.prompt === undefined) {
        return null
      }
      await AIrateLimiter(ctx.session.user.id)
      const url = await generateAvatar(input.prompt)
      if (url) {
        const response = await axios.get(url, {
          decompress: false,
          responseType: 'arraybuffer',
        })
        const key = `tmp/${ctx.session.user.id}/ai-${sanitizeKey(
          Math.floor(Math.random() * 10000000).toString(),
        )}.png`
        await s3.send(
          new PutObjectCommand({
            Bucket: env.S3_UPLOAD_BUCKET,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            Body: response.data,
            Key: key,
          }),
        )
        return `${env.NEXT_PUBLIC_CDN_ENDPOINT_URL}/${key}`
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Ошибка генерации аватара',
      })
    }),
})
