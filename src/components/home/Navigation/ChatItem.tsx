import { useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdCheck, MdClose, MdDeleteOutline } from 'react-icons/md'
import { PiChatBold, PiTrashBold } from 'react-icons/pi'

import { useAppContext } from '@/components/AppContext'
import { useEventBusContext } from '@/components/EventBusContext'

import { ActionType } from '@/reducers/AppReducer'

type Props = {
  item: Chat
  selected: boolean
  onSelected: (chat: Chat) => void
}

type BtnItem = {
  icon: React.ReactNode
  type: 'edit' | 'delete' | 'confirm' | 'cancel'
}

export default function ChatItem({ item, selected, onSelected }: Props) {
  const { dispatch } = useAppContext()
  /**是否处于编辑 */
  const [editing, setEditing] = useState(false)
  /**是否处于删除 */
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    setEditing(false)
    setDeleting(false)
  }, [selected])
  /**选中当前对话点击 */
  const onSelect = () => {
    return onSelected(item)
  }
  /**右侧按钮展示列表 */
  const btnList = useMemo<BtnItem[]>(() => {
    if (editing || deleting)
      return [
        { icon: <MdCheck />, type: 'confirm' },
        { icon: <MdClose />, type: 'cancel' },
      ]
    return [
      { icon: <AiOutlineEdit />, type: 'edit' },
      { icon: <MdDeleteOutline />, type: 'delete' },
    ]
  }, [editing, deleting])
  const [title, setTitle] = useState(item.title)
  /**标题更改 */
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const { publish } = useEventBusContext()
  /**更新 */
  const updateChat = async () => {
    try {
      const response = await fetch('/api/chat/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id, title }),
      })
      if (!response.ok) {
        console.log(response.statusText)
        return
      }
      const { code } = await response.json()
      if (code === 200) {
        publish('fetchChatList')
        setEditing(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  /**删除 */
  const deleteChat = async () => {
    try {
      const response = await fetch(`/api/chat/delete?id=${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        console.log(response.statusText)
        return
      }
      const { code } = await response.json()
      if (code === 200) {
        publish('fetchChatList')
        dispatch({
          type: ActionType.UPDATE,
          field: 'selectedChat',
          value: undefined,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  /**右侧操作按钮点击 */
  const onBtnClick = (e: React.MouseEvent, type: BtnItem['type']) => {
    console.log(btnList)
    e.stopPropagation()
    console.log(type)
    setDeleting(() => type === 'delete')
    setEditing(() => type === 'edit')
    if (type === 'confirm') {
      if (editing) {
        updateChat()
      } else {
        deleteChat()
      }
    }
  }
  return (
    <li
      onClick={onSelect}
      className={clsx(
        'group relative mb-1 flex cursor-pointer items-center space-x-3 rounded-md p-3 hover:bg-gray-800',
        {
          'bg-gray-800 pr-[3.5em]': selected,
        },
      )}
    >
      <div>{deleting ? <PiTrashBold /> : <PiChatBold />}</div>
      {editing ? (
        <input
          autoFocus={true}
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={title}
          onChange={onChangeInput}
        />
      ) : (
        <div className="relative flex-1 overflow-hidden whitespace-nowrap">
          {item.title}
          <span
            className={clsx(
              'absolute inset-y-0 right-0 w-8 bg-gradient-to-l group-hover:from-gray-800',
              {
                'from-gray-800': selected,
                'from-gray-900': !selected,
              },
            )}
          ></span>
        </div>
      )}

      {selected && (
        <div className="absolute right-1 flex">
          {btnList.map((item) => (
            <button
              key={item.type}
              onClick={(e) => onBtnClick(e, item.type)}
              className="p-1 hover:text-white"
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}
    </li>
  )
}
