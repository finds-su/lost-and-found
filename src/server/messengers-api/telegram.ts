import { env } from '@/env.mjs'
import axios from 'axios'

class TelegramApi implements IMessengersApi {
  private static instance: TelegramApi
  private token: string
  private telegramBotName: string
  private isCallbackInitialized = false

  private constructor(token: string, telegramBotName: string) {
    this.token = token
    this.telegramBotName = telegramBotName
  }

  public static getInstance(token: string, telegramBotName: string): TelegramApi {
    if (!TelegramApi.instance) {
      TelegramApi.instance = new TelegramApi(token, telegramBotName)
    }

    return TelegramApi.instance
  }

  public async initCallback(): Promise<void> {
    if (this.isCallbackInitialized) {
      return
    }

    const url = `https://api.telegram.org/bot${this.token}/setWebhook?url=${env.CALLBACK_URL}/api/messengers/callback/${env.CALLBACK_SECRET_URL_STRING}`
    await axios.get(url)

    this.isCallbackInitialized = true
  }

  public async sendMessage(chatId: number | string, text: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`
    await axios.post(url, {
      chat_id: chatId,
      text,
    })
  }

  public async generateDeepLink(payload: string): Promise<string> {
    if (!this.isCallbackInitialized) {
      await this.initCallback()
    }

    const url = `https://t.me/${this.telegramBotName}?start=${payload}`
    return url
  }
}

export default TelegramApi.getInstance(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_BOT_NAME)
