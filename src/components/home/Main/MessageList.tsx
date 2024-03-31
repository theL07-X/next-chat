import { useEffect } from 'react'

import clsx from 'clsx'
import { RxAvatar } from 'react-icons/rx'
import { SiOpenai } from 'react-icons/si'

import { useAppContext } from '@/components/AppContext'
import Markdown from '@/components/common/Markdown'

import { ActionType } from '@/reducers/AppReducer'

export default function MessageList() {
  const {
    state: { messageList, streamingId, selectedChat },
    dispatch,
  } = useAppContext()

  useEffect(() => {
    const getData = async (chatId: string) => {
      try {
        const res = await fetch(`/api/message/list?chatId=${chatId}`)
        if (res.ok) {
          const { data } = await res.json()
          dispatch({
            type: ActionType.UPDATE,
            field: 'messageList',
            value: data,
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (selectedChat) {
      getData(selectedChat.id)
    } else {
      dispatch({
        type: ActionType.UPDATE,
        field: 'messageList',
        value: [],
      })
    }
  }, [dispatch, selectedChat])
  return (
    <div className="w-full pb-48 pt-10 dark:text-gray-300">
      <ul>
        {messageList.map((message) => {
          const isUser = message.role === 'user'
          return (
            <li
              key={message.id}
              className={clsx(
                isUser
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-gray-50 dark:bg-gray-700',
              )}
            >
              <div className="mx-auto flex w-full max-w-4xl space-x-6 px-4 py-6 text-lg">
                <div className="text-3xl leading-[1]">
                  {isUser ? <RxAvatar /> : <SiOpenai />}
                </div>
                <div className="flex-1">
                  <Markdown>{`${message.content}${streamingId === message.id ? '|' : ''}`}</Markdown>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
