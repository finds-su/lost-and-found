interface IMessengersApi {
  initCallback(): Promise<void>
  sendMessage(chatId: number | string, text: string): Promise<void>
  generateDeepLink(payload: string): Promise<string>
}
