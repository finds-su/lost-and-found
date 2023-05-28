import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, AIrateLimiter } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { minNicknameLength, telegramUsernameRegex } from '@/constants.mjs'
import { generateAvatar } from '@/server/openai'
import { s3 } from '@/server/s3'
import { env } from '@/env.mjs'
import axios from 'axios'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { sanitizeKey } from 'next-s3-upload'
import { CopyObjectCommand } from '@aws-sdk/client-s3'

const zodNickname = z
  .string({
    required_error: 'Никнейм обязателен',
    invalid_type_error: 'Никнейм должен быть строкой',
  })
  .min(minNicknameLength, { message: 'Слишком короткий никнейм' })
  .max(40, { message: 'Слишком длинный никнейм' })
  .refine((nickname) => nickname === nickname.match(telegramUsernameRegex)?.at(0), {
    message: 'Невалидный никнейм',
  })

const zodEmail = z
  .string({
    required_error: 'Почта обязательна',
    invalid_type_error: 'Почта должен быть строкой',
  })
  .email({ message: 'Недействительная почта' })
  .max(100, { message: 'Слишком длинная почта' })
  .trim()

const zodName = z
  .string({
    required_error: 'Имя обязательно',
    invalid_type_error: 'Имя должно быть строкой',
  })
  .trim()
  .max(20, { message: 'Слишком длинное имя' })

const zodTelegramLink = z
  .string({
    required_error: 'Telegram username обязательно',
    invalid_type_error: 'Telegram username должно быть строкой',
  })
  .trim()
  .max(50, { message: 'Слишком длинное Telegram username' })
  .refine((username) => username === username.match(telegramUsernameRegex)?.at(0), {
    message: 'Невалидный Telegram username',
  })

const zodUserInfo = z
  .string({
    required_error: 'Описание профиля обязательно',
    invalid_type_error: 'Описание профиля быть строкой',
  })
  .max(280, { message: 'Слишком длинное описание профиля' })
  .trim()

export const usersRouter = createTRPCRouter({
  isValidNewNickname: protectedProcedure
    .input(
      z.object({
        nickname: zodNickname,
      }),
    )
    .query(async ({ ctx, input }) => {
      const usersCount = await ctx.prisma.user.count({ where: { nickname: input.nickname } })
      if (usersCount > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Никнейм существует',
        })
      }
      return true
    }),

  isValidNewEmail: protectedProcedure
    .input(
      z.object({
        email: zodEmail,
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } })
      if (user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Почта существует',
        })
      }
      return true
    }),

  editUser: protectedProcedure
    .input(
      z.object({
        name: zodName
          .nullable()
          .optional()
          .transform((value) => (value?.length === 0 ? null : value)),
        nickname: zodNickname,
        email: zodEmail
          .nullable()
          .optional()
          .transform((value) => (value?.length === 0 ? null : value)),
        telegramLink: zodTelegramLink
          .nullable()
          .transform((value) => (value?.length === 0 ? null : value)),
        userInfo: zodUserInfo.nullable().transform((value) => (value?.length === 0 ? null : value)),
        image: z
          .string()
          .url()
          .nullable()
          .optional()
          .transform((value) => (value?.length === 0 ? null : value)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
            telegramLink: input.telegramLink,
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
