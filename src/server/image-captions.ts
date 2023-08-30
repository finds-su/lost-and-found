import { env } from '@/env.mjs'

export const generateImageCaption = async (imageUrl: string) => {
  const response = await fetch(imageUrl)

  const buffer = await response.blob()

  const formData = new FormData()
  formData.append('file', buffer, 'image.jpg')
  const aiResponse = await fetch(`${env.IMAGE_CAPTION_HOST}/image-caption`, {
    method: 'POST',
    body: formData,
  })

  const text = await aiResponse.text()

  // Remove quotes
  return text.slice(1, -1)
}
