import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  aIRateLimiter,
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
import { zodEditUserInput } from '@/lib/validation-types/users'
import { prisma } from '@/server/db'
import { SocialNetwork as PrismaSocialNetwork } from '@prisma/client'
import VkApi from '@/server/messengers-api/vk'
import TelegramApi from '@/server/messengers-api/telegram'

export const usersRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ nickname: z.string() }))
    .query(async ({ ctx, input }) => {
      const isOwner = !!(ctx.session && ctx.session.user.nickname === input.nickname)
      let user = await ctx.prisma.user.findUnique({
        where: {
          nickname: input.nickname,
        },
        select: {
          name: true,
          nickname: true,
          userInfo: true,
          role: true,
          image: true,
          ...(isOwner && {
            email: true,
            isBlocked: true,
            blockReason: true,
            socialNetworks: {
              select: {
                socialNetwork: true,
                externalId: true,
                username: true,
              },
            },
          }),
        },
      })
      if (user && user.socialNetworks === undefined) {
        user = { ...{ socialNetworks: [] }, ...user }
      }
      if (user && user.socialNetworks) {
        const existingNetworks = user.socialNetworks.map((network) => network.socialNetwork)
        const notExistingNetworks = Object.values(PrismaSocialNetwork).filter(
          (network) => !existingNetworks.includes(network),
        )
        user.socialNetworks.push(
          ...notExistingNetworks.map((socialNetwork) => ({
            socialNetwork,
            externalId: '',
            username: '',
          })),
        )
      }
      // ...Object.values(PrismaSocialNetwork).map((prismaSocialNetwork, index) => ({
      //     name: SocialNetwork[prismaSocialNetwork],
      //     register: editProfileForm.register(`socialNetworks.${index}.link`, {
      //       onChange: (value) => ({ socialNetwork: prismaSocialNetwork, link: value as string }),
      //     }),
      //     type: 'input' as 'input' | 'textArea',
      //   }))

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

      // Social networks linking with other services
      // if (input.socialNetworks) {
      //   input.socialNetworks.map(async (socialNetwork) => {
      //     await prisma.userSocialNetwork.upsert({
      //       where: {
      //         userId_socialNetwork: {
      //           userId: ctx.session.user.id,
      //           socialNetwork: socialNetwork.socialNetwork,
      //         },
      //       },
      //       update: {
      //         externalId: socialNetwork.externalId,
      //         username: socialNetwork.username,
      //       },
      //       create: {
      //         userId: ctx.session.user.id,
      //         socialNetwork: socialNetwork.socialNetwork,
      //         externalId: socialNetwork.externalId,
      //         username: socialNetwork.username,
      //       },
      //     })
      //   })
      // }
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
      await aIRateLimiter(ctx.session.user.id)
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

  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        image: true,
        role: true,
        email: true,
        isBlocked: true,
        blockReason: true,
        socialNetworks: {
          select: {
            socialNetwork: true,
            externalId: true,
            userId: true,
          },
        },
      },
    })
    return { user }
  }),

  getMySocialNetworks: protectedProcedure.query(async ({ ctx }) => {
    const socialNetworks = await ctx.prisma.userSocialNetwork.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        socialNetwork: true,
        externalId: true,
      },
    })
    return { socialNetworks }
  }),

  generateVkAuthLink: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        secretSocialNetworksAuthPayload: true,
      },
    })
    if (user === null) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Несуществующий пользователь',
      })
    }

    const authLink = await VkApi.generateDeepLink(user.secretSocialNetworksAuthPayload)
    return { authLink }
  }),

  generateTgAuthLink: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        secretSocialNetworksAuthPayload: true,
      },
    })
    if (user === null) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Несуществующий пользователь',
      })
    }

    const authLink = await TelegramApi.generateDeepLink(user.secretSocialNetworksAuthPayload)
    return { authLink }
  }),

  unlinkSocialNetwork: protectedProcedure
    .input(
      z.object({
        socialNetwork: z.enum(['VK', 'TELEGRAM']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userSocialNetwork.deleteMany({
        where: {
          userId: ctx.session.user.id,
          socialNetwork: input.socialNetwork,
        },
      })
      return null
    }),
})
