import { useEffect, useMemo, useRef, useState } from 'react'

import { useAppContext } from '@/components/AppContext'
import { useEventBusContext } from '@/components/EventBusContext'

import ChatItem from './ChatItem'

import { groupByDate } from '@/common/util'
import { ActionType } from '@/reducers/AppReducer'

export default function ChatList() {
  const { subscribe, unsubscribe } = useEventBusContext()

  const [chatList, setChatList] = useState<Chat[]>([])
  /**当前页数 */
  const pageRef = useRef(1)
  /**是否还有剩余 */
  const hasMoreRef = useRef(false)
  /**正在加载 */
  const loadRef = useRef(false)
  /**获取数据 */
  const getData = async () => {
    if (loadRef.current) return
    loadRef.current = true
    const res = await fetch(`/api/chat/list?page=${pageRef.current}`)
    if (res.ok) {
      const { data } = await res.json()
      hasMoreRef.current = data.hasMore
      if (pageRef.current === 1) {
        setChatList(data.list)
      } else {
        setChatList((list) => [...list, ...data.list])
      }
      pageRef.current++
    }
    loadRef.current = false
  }
  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {
    const callback: EventBusListener = () => {
      pageRef.current = 1
      getData()
    }
    subscribe('fetchChatList', callback)
    return () => {
      unsubscribe('fetchChatList', callback)
    }
  }, [subscribe, unsubscribe])
  const {
    state: { selectedChat },
    dispatch,
  } = useAppContext()

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const groupList = useMemo(() => {
    return groupByDate(chatList)
  }, [chatList])

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    const div = loadMoreRef.current
    if (!div) return
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreRef.current) {
        getData()
      }
    })
    observer.observe(div)
    return () => {
      if (observer && div) {
        observer.unobserve(div)
        observer = null
      }
    }
  }, [])
  return (
    <div className="mb-[48px] mt-2 flex flex-1 flex-col overflow-y-auto">
      {groupList.map(([date, list]) => {
        return (
          <div key={date}>
            <h5 className="sticky top-0 z-10 bg-gray-900 p-3 text-sm text-gray-500">
              {date}
            </h5>
            <ul>
              {list.map((item) => {
                const selected = selectedChat?.id === item.id
                return (
                  <ChatItem
                    key={item.id}
                    selected={selected}
                    item={item}
                    onSelected={() =>
                      dispatch({
                        type: ActionType.UPDATE,
                        field: 'selectedChat',
                        value: item,
                      })
                    }
                  />
                )
              })}
            </ul>
          </div>
        )
      })}
      <div ref={loadMoreRef}>&nbsp;</div>
    </div>
  )
}
