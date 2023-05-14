import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export const generateAvatar = async (prompt: string) => {
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: '256x256',
  })
  return response.data.data[0]?.url
}
