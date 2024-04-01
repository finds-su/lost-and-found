import { env } from '@/env.mjs'
import axios, { type AxiosInstance } from 'axios'

type CallbackServer = {
  id: number
  url: string
  title: string
}

type VkError = {
  error_code: number
  error_msg: string
}

type CallbackServerResponse = {
  response: {
    count: number
    items: CallbackServer[]
  }
  error?: VkError
}

class VkApi implements IMessengersApi {
  private static instance: VkApi
  private client: AxiosInstance
  private isCallbackInitialized = false

  private constructor(token: string, groupId: number) {
    this.client = axios.create({
      baseURL: 'https://api.vk.com/method',
      params: {
        access_token: token,
        group_id: groupId,
        v: '5.131',
      },
    })
  }

  public static getInstance(token: string, groupId: number): VkApi {
    if (!VkApi.instance) {
      VkApi.instance = new VkApi(token, groupId)
    }

    return VkApi.instance
  }

  private async request<T>(method: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get(method, { params })

    const withError = response.data as { error?: VkError }

    if (withError.error) {
      throw new Error(withError.error.error_msg)
    }

    return response.data as T
  }

  private async addCallbackServer(): Promise<number> {
    const url = `/groups.addCallbackServer?url=${env.CALLBACK_URL}/api/messengers/callback/${env.CALLBACK_SECRET_URL_STRING}&title=FindsServer`
    const res = await this.request<{ response: { server_id: number } }>(url)

    return res.response.server_id
  }

  public async getCallbackConfirmationCode(): Promise<string> {
    const url = '/groups.getCallbackConfirmationCode'
    const res = await this.request<{ response: { code: string } }>(url)

    return res.response.code
  }

  public async initCallback(): Promise<void> {
    if (this.isCallbackInitialized) {
      return
    }

    const url = '/groups.getCallbackServers'
    const callbackServersRes = await this.request<CallbackServerResponse>(url)

    let serverId: number

    const callbackUrl = `${env.CALLBACK_URL}/api/messengers/callback/${env.CALLBACK_SECRET_URL_STRING}`

    const currentCallbackServer = callbackServersRes.response.items.find(
      (server: CallbackServer) => server.url === callbackUrl,
    )

    if (!currentCallbackServer) {
      if (callbackServersRes.response.count < 10) {
        serverId = await this.addCallbackServer()
      } else {
        throw new Error('Callback servers limit reached. Please, delete some callback servers.')
      }
    } else {
      serverId = currentCallbackServer.id
    }

    console.log('Server', serverId)

    const params = {
      server_id: serverId,
      api_version: '5.131',
      message_new: 1,
    }
    await this.request('/groups.setCallbackSettings', params)

    this.isCallbackInitialized = true
  }

  public async sendMessage(chatId: number | string, text: string): Promise<void> {
    const params = {
      peer_id: chatId,
      message: text,
      random_id: Math.floor(Math.random() * 100000000),
    }
    await this.request('/messages.send', params)
  }

  public async generateDeepLink(payload: string): Promise<string> {
    if (!this.isCallbackInitialized) {
      await this.initCallback()
    }

    const url = `https://vk.com/write-${env.VK_GROUP_ID}?ref=${payload}&ref_source=lost-and-found-web`
    return url
  }
}

export default VkApi.getInstance(env.VK_BOT_TOKEN, env.VK_GROUP_ID)
