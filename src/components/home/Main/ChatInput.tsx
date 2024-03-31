import { useEffect, useMemo, useRef, useState } from 'react'
import TextareaAutoSize from 'react-textarea-autosize'

import { FiSend } from 'react-icons/fi'
import { MdRefresh } from 'react-icons/md'
import { PiLightningFill, PiStopBold } from 'react-icons/pi'

import { useAppContext } from '@/components/AppContext'
import Button from '@/components/common/Button'
import { useEventBusContext } from '@/components/EventBusContext'

import { ActionType } from '@/reducers/AppReducer'

export default function ChatInput() {
  /**输入框内容 */
  const [messageText, setMessageText] = useState('')
  const {
    state: { messageList, currentModel, streamingId, selectedChat },
    dispatch,
  } = useAppContext()

  const { publish, subscribe, unsubscribe } = useEventBusContext()

  /**发送 */
  const send = async (content: string) => {
    if (!content) return
    // 创建用户消息
    const message = await createOrUpdateMessage({
      id: '',
      role: 'user',
      content: content,
      chatId: chatIdRef.current,
    })
    const messages = [...messageList, message]
    dispatch({
      type: ActionType.ADD_MESSAGE,
      message,
    })
    doSend(messages)
    if (!selectedChat?.title || selectedChat?.title === '新对话') {
      updateChatTitle(messages)
    }
  }
  /**更新消息列表标题 */
  const updateChatTitle = async (messages: Message[]) => {
    const message: Message = {
      id: '',
      role: 'user',
      content:
        "使用 5 到 10 个字直接返回这句话的简要主题，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回'新对话'",
      chatId: chatIdRef.current,
    }
    const chatId = chatIdRef.current
    const body: MessageRequestBody = {
      messages: [...messages, message],
      model: currentModel,
    }
    let response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    if (!response.body) {
      console.log('body error')
      return
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    let title = ''
    while (!done) {
      const result = await reader.read()
      done = result.done
      const chunk = decoder.decode(result.value)
      title += chunk
    }
    response = await fetch('/api/chat/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: chatId, title }),
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    const { code } = await response.json()
    if (code === 200) {
      publish('fetchChatList')
    }
  }
  useEffect(() => {
    const callback: EventBusListener = (data: string) => {
      send(data)
    }
    subscribe('createNewChat', callback)
    return () => {
      unsubscribe('createNewChat', callback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**是否停止生成 */
  const stopRef = useRef(false)
  const chatIdRef = useRef('')
  useEffect(() => {
    if (chatIdRef.current === selectedChat?.id) return
    chatIdRef.current = selectedChat?.id ?? ''
    stopRef.current = true
  }, [selectedChat?.id])
  const createOrUpdateMessage = async (message: Message) => {
    const response = await fetch('/api/message/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    const { data } = await response.json()
    if (!chatIdRef.current) {
      chatIdRef.current = data.message.chatId
      publish('fetchChatList')
      dispatch({
        type: ActionType.UPDATE,
        field: 'selectedChat',
        value: { id: chatIdRef.current },
      })
    }
    return data.message
  }

  const deleteMessage = async (id: string) => {
    const response = await fetch(`/api/message/delete?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      return
    }
    const { code } = await response.json()
    return code === 200
  }

  /**操作按钮设置 */
  const actionBtn = useMemo(() => {
    return streamingId
      ? {
          icon: PiStopBold,
          value: '停止生成',
          type: 'stop',
        }
      : {
          icon: MdRefresh,
          value: '重新生成',
          type: 'refresh',
        }
  }, [streamingId])
  /**按钮点击事件 */
  const onActionClick = () => {
    const { type } = actionBtn
    if (type === 'stop') {
      stopRef.current = true
    } else {
      resend()
    }
  }

  /**重新发送 */
  const resend = async () => {
    const messages = [...messageList]
    if (messageList.length) {
      const lastMessage = messageList[messageList.length - 1]
      if (lastMessage.role === 'assistant') {
        const success = await deleteMessage(lastMessage.id)
        if (!success) return
        dispatch({
          type: ActionType.REMOVE_MESSAGE,
          message: lastMessage,
        })
        messages.pop()
      }
    }
    doSend(messages)
  }
  /**发送消息接口 */
  const doSend = async (messages: Message[]) => {
    const body: MessageRequestBody = { messages, model: currentModel }
    setMessageText('')
    const controller = new AbortController()
    // 停止生成
    stopRef.current = false
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    if (!response.body) {
      console.log('body error')
      return
    }
    const responseMessage = await createOrUpdateMessage({
      id: '',
      role: 'assistant',
      content: '',
      chatId: chatIdRef.current,
    })
    dispatch({ type: ActionType.ADD_MESSAGE, message: responseMessage })
    // 添加当前回复消息的streamingId
    dispatch({
      type: ActionType.UPDATE,
      field: 'streamingId',
      value: responseMessage.id,
    })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    // 读取
    while (!done) {
      if (stopRef.current) {
        controller.abort()
        break
      }
      const result = await reader.read()
      done = result.done
      const chunk = decoder.decode(result.value)
      responseMessage.content += chunk
      // 更新消息
      dispatch({
        type: ActionType.UPDATE_MESSAGE,
        message: responseMessage,
      })
    }
    createOrUpdateMessage(responseMessage)
    // 重置streamingId
    dispatch({
      type: ActionType.UPDATE,
      field: 'streamingId',
      value: '',
    })
  }
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-4 px-4">
        {!!messageList.length && (
          <Button
            icon={actionBtn.icon}
            variant="primary"
            className="font-medium"
            onClick={onActionClick}
          >
            {actionBtn.value}
          </Button>
        )}
        <div className="flex w-full items-end rounded-lg border border-black/10 bg-white py-4 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:border-gray-800/50 dark:bg-gray-700">
          <div className="mx-3 mb-2.5 text-[#26cf8e]">
            <PiLightningFill />
          </div>
          <TextareaAutoSize
            className="mb-1.5 max-h-64 flex-1 resize-none border-0 bg-transparent text-black outline-none dark:text-white"
            placeholder="输入一条消息..."
            rows={1}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <Button
            className="mx-3 !rounded-lg"
            icon={FiSend}
            disabled={!messageText.trim() || !!streamingId}
            variant="primary"
            onClick={() => send(messageText.trim())}
          />
        </div>
        <footer className="px-4 pb-6 text-center text-sm text-gray-700 dark:text-gray-300">
          ©️{new Date().getFullYear()}&nbsp;基于第三方提供的接口
        </footer>
      </div>
    </div>
  )
}
