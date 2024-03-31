export type State = {
  /**是否显示导航栏 */
  displayNavigation: boolean
  /**主题 */
  themeMode: 'light' | 'dark'
  /**3.5 | 4 选择 */
  currentModel: 'gpt-3.5-turbo' | 'gpt-4'
  /**消息列表 */
  messageList: Message[]
  /**正在回复中的消息id */
  streamingId: string
  /**当前选中的对话 */
  selectedChat?: { id: Chat['id']; title?: string }
}

export enum ActionType {
  UPDATE = 'UPDATE',
  ADD_MESSAGE = 'ADD_MESSAGE',
  UPDATE_MESSAGE = 'UPDATE_MESSAGE',
  REMOVE_MESSAGE = 'REMOVE_MESSAGE',
}

type MessageAction = {
  type:
    | ActionType.ADD_MESSAGE
    | ActionType.UPDATE_MESSAGE
    | ActionType.REMOVE_MESSAGE
  message: Message
}

type UpdateAction = {
  type: ActionType.UPDATE
  field: keyof State
  value: State[keyof State]
}

export type Action = UpdateAction | MessageAction

export const initState: State = {
  displayNavigation: true,
  themeMode: 'light',
  currentModel: 'gpt-3.5-turbo',
  messageList: [],
  streamingId: '',
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.UPDATE:
      return {
        ...state,
        [action.field]: action.value,
      }
    case ActionType.ADD_MESSAGE: {
      const messageList = [...state.messageList, action.message]
      return { ...state, messageList }
    }
    case ActionType.UPDATE_MESSAGE: {
      const messageList = state.messageList.map((message) => {
        if (message.id === action.message.id) {
          return action.message
        }
        return message
      })
      return { ...state, messageList }
    }
    case ActionType.REMOVE_MESSAGE: {
      const messageList = state.messageList.filter(
        (message) => message.id !== action.message.id,
      )
      return { ...state, messageList }
    }
    default:
      return state
  }
}
