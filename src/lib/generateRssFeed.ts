import fs from 'fs'
import { Feed } from 'feed'
import { SortOption } from './types/sort-option'
import { prisma } from '@/server/db'

export default async function generateRssFeed() {
  const allPosts = await prisma.lostAndFoundItem.findMany({
    orderBy: {
      created: SortOption.newFirst,
    },
    select: {
      id: true,
      name: true,
      user: {
        select: {
          name: true,
          email: true,
          id: true,
          image: true,
          nickname: true,
        },
      },
      description: true,
      created: true,
      reason: true,
      slug: true,
      images: true,
      isInStoragePlace: true,
      campus: true,
    },
  })

  const siteURL = 'https://finds.mirea.ru/'
  const date = new Date()
  const author = {
    name: 'Mirea Ninja',
    email: 'contact@mirea.ninja',
    link: 'https://mirea.ninja',
  }

  const feed = new Feed({
    title: 'Бюро находок РТУ МИРЭА',
    description:
      'Бюро находок - это сервис, который помогает людям находить потерянные вещи и возвращать их владельцам.',
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/logo-icons/favicon-16x16.png`,
    favicon: `${siteURL}/logo-icons/favicon-16x16.png`,
    copyright: `All rights reserved ${date.getFullYear()}, Mirea Ninja`,
    updated: date,
    generator: 'awesome',
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`, // xml format
      json: `${siteURL}/rss/feed.json`, // json fromat
    },
    author,
  })

  allPosts.forEach((post) => {
    const url = `${siteURL}/${post.reason === 'LOST' ? 'losses' : 'finds'}/${post.slug}`
    feed.addItem({
      title: post.name,
      id: post.id.toString(),
      link: url,
      content: post.description,
      author: [
        {
          name: post.user.name || post.user.nickname,
          email: post.user.email || undefined,
          link: `${siteURL}/u/${post.user.nickname}`,
        },
      ],
      contributor: [
        {
          name: post.user.name || post.user.nickname,
          email: post.user.email || undefined,
          link: `${siteURL}/u/${post.user.nickname}`,
        },
      ],
      image: post.images[0] || undefined,
      date: post.created,
    })
  })

  const xml = feed.rss2()
  const json = feed.json1()

  fs.writeFileSync('./public/rss/feed.xml', xml)
  fs.writeFileSync('./public/rss/feed.json', json)

  return { xml, json }
}
