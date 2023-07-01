import type { NextApiRequest, NextApiResponse } from 'next'
import { renderTrpcPanel } from 'trpc-panel'
import { appRouter } from '@/server/api/root'
import { env } from '@/env.mjs'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: `${env.NEXTAUTH_URL}/api/trpc`,
      transformer: 'superjson',
    }),
  )
}
