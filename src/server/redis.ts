import { env } from '@/env.mjs'
import * as redis from 'redis'

const REDIS_WINDOW_SECONDS = 60 * 60 * 24 // 24 hours
const REDIS_MAX_REQUESTS = 3

export const redisRateLimiter = async (
  id: string,
  prefix: string,
): Promise<{ success: boolean }> => {
  const redisClient = redis.createClient({ url: env.REDIS_URL })
  redisClient.on('error', (err) => console.log('Redis Client Error', err))
  await redisClient.connect()

  const key = `${prefix}:${id}`

  try {
    // Get the current request count for the user
    const count = await redisClient.get(key)

    if (count === null) {
      // If no previous count exists, set the count to 1 and expire it after the window
      await redisClient.set(key, 1)
      await redisClient.expire(key, REDIS_WINDOW_SECONDS)
    } else if (parseInt(count) < REDIS_MAX_REQUESTS) {
      // If the count is less than the max requests, increment the count
      await redisClient.incr(key)
    } else {
      // If the count is greater than or equal to the max requests, reject the request
      void redisClient.disconnect()
      return { success: false }
    }

    // Return the current count
    void redisClient.disconnect()
    return { success: true }
  } catch (error) {
    console.error(error)
    try {
      await redisClient.disconnect()
    } catch (e) {
      /* empty */
    }
    return { success: false }
  }
}
