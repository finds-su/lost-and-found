import { createNextApiHandler } from '@trpc/server/adapters/next'

import { env } from '@/env.mjs'
import { createTRPCContext } from '@/server/api/trpc'
import { appRouter } from '@/server/api/root'
import { ZodError } from 'zod'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ path, error }) => {
    if (error.cause instanceof ZodError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error.message = JSON.parse(error.message)[0].message as string
    }
    if (env.NODE_ENV === 'development') {
      console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
    }
  },
})
