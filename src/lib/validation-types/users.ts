import { z } from 'zod'
import {
  maxEmailLength,
  maxNameLength,
  maxNicknameLength,
  maxUserInfoLength,
  minNicknameLength,
  telegramUsernameRegex,
} from '@/lib/constants'
import { SocialNetwork } from '@prisma/client'

export const zodNickname = z
  .string({
    required_error: 'Никнейм обязателен',
    invalid_type_error: 'Никнейм должен быть строкой',
  })
  .min(minNicknameLength, { message: 'Слишком короткий никнейм' })
  .max(maxNicknameLength, { message: 'Слишком длинный никнейм' })
  .refine((nickname) => nickname === nickname.match(telegramUsernameRegex)?.at(0), {
    message: 'Невалидный никнейм',
  })

export const zodEmail = z
  .string({
    required_error: 'Почта обязательна',
    invalid_type_error: 'Почта должен быть строкой',
  })
  .email({ message: 'Недействительная почта' })
  .max(maxEmailLength, { message: 'Слишком длинная почта' })
  .trim()

export const zodName = z
  .string({
    required_error: 'Имя обязательно',
    invalid_type_error: 'Имя должно быть строкой',
  })
  .trim()
  .max(maxNameLength, { message: 'Слишком длинное имя' })

export const zodUserInfo = z
  .string({
    required_error: 'Описание профиля обязательно',
    invalid_type_error: 'Описание профиля быть строкой',
  })
  .max(maxUserInfoLength, { message: 'Слишком длинное описание профиля' })
  .trim()

export const zodEditUserInput = z.object({
  name: zodName
    .nullable()
    .optional()
    .transform((value) => (value?.length === 0 ? null : value)),
  nickname: zodNickname,
  email: zodEmail
    .nullable()
    .optional()
    .transform((value) => (value?.length === 0 ? null : value)),
  userInfo: zodUserInfo.nullable().transform((value) => (value?.length === 0 ? null : value)),
  image: z
    .string()
    .url()
    .nullable()
    .optional()
    .transform((value) => (value?.length === 0 ? null : value)),
  socialNetworks: z
    .array(z.object({ socialNetwork: z.nativeEnum(SocialNetwork), link: z.string() }))
    .optional(),
})
