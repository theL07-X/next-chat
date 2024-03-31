interface Chat {
  id: string
  /**标题 */
  title: string
  /**更新时间 */
  updateTime: number
}

interface Message {
  id: string
  /**消息角色 */
  role: 'user' | 'assistant'
  /**内容 */
  content: string
  /**对话Id */
  chatId: string
}

interface MessageRequestBody {
  /**当前消息列表 */
  messages: Message[]
  /**当前模型 */
  model: 'gpt-3.5-turbo' | 'gpt-4'
}
