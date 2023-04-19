import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { type Role } from '@prisma/client'
import { slugify } from 'transliteration'

export interface PublicUser {
  nickname: string
  role: Role
  userInfo: string
  image?: string
}

export const usersRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(z.object({ nickname: z.string() }))
    .query(async ({ ctx, input }) => {
      const publicUser = (await ctx.prisma.user.findUnique({
        where: {
          nickname: input.nickname,
        },
        select: {
          nickname: true,
          role: true,
          userInfo: true,
          image: true,
        },
      })) as PublicUser
      if (publicUser) {
        return publicUser
      } else {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Пользователь не найден.' })
      }
    }),

  isValidNewNickname: protectedProcedure
    .input(
      z.object({
        nickname: z
          .string({
            required_error: 'Никнейм обязателен',
            invalid_type_error: 'Никнейм должен быть строкой',
          })
          .min(5, { message: 'Слишком короткий никнейм' })
          .max(50, { message: 'Слишком длинный никнейм' })
          .refine((nickname) => nickname === slugify(nickname), { message: 'Невалидный никнейм' }),
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
        email: z
          .string({
            required_error: 'Почта обязательна',
            invalid_type_error: 'Почта должен быть строкой',
          })
          .email({ message: 'Недействительная почта' })
          .min(5, { message: 'Слишком короткая почта' })
          .max(100, { message: 'Слишком длинная почта' })
          .trim(),
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
        name: z
          .string({
            required_error: 'Имя обязательно',
            invalid_type_error: 'Имя должно быть строкой',
          })
          .trim()
          .min(3, { message: 'Слишком короткое имя' })
          .max(50, { message: 'Слишком длинное имя' })
          .refine((name) => name === name.replaceAll('\n', ''), { message: 'Невалидное имя' }),
        nickname: z
          .string({
            required_error: 'Никнейм обязателен',
            invalid_type_error: 'Никнейм должен быть строкой',
          })
          .min(5, { message: 'Слишком короткий никнейм' })
          .max(50, { message: 'Слишком длинный никнейм' })
          .refine((nickname) => nickname === slugify(nickname), { message: 'Невалидный никнейм' }),
        email: z
          .string({
            required_error: 'Почта обязательна',
            invalid_type_error: 'Почта должен быть строкой',
          })
          .email({ message: 'Недействительная почта' })
          .min(5, { message: 'Слишком короткая почта' })
          .max(100, { message: 'Слишком длинная почта' })
          .trim()
          .nullable(),
        telegramLink: z
          .string({
            required_error: 'Телеграм ссылка обязательна',
            invalid_type_error: 'Телеграм ссылка должен быть строкой',
          })
          .trim()
          .min(3, { message: 'Слишком короткая ссылка' })
          .max(50, { message: 'Слишком длинная ссылка' })
          .url({ message: 'Ссылка должна быть в виде URL' })
          .nullable(),
        userInfo: z
          .string({
            required_error: 'Описание профиля обязательно',
            invalid_type_error: 'Описание профиля быть строкой',
          })
          .max(280, { message: 'Слишком длинное описание профиля' })
          .trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          nickname: input.nickname,
          email: input.email,
          telegramLink: input.telegramLink,
          userInfo: input.userInfo,
        },
      })
    }),
})
