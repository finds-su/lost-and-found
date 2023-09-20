import type { NextApiRequest, NextApiResponse } from 'next'
import generateRssFeed from '@/lib/generateRssFeed'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { xml, json } = await generateRssFeed()

  res.setHeader('Content-Type', 'application/xml')

  res.status(200).send(xml)
}
