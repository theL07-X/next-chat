'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type EventBusContentProps = {
  /**订阅 */
  subscribe: (event: string, callback: EventBusListener) => void
  /**取消 */
  unsubscribe: (event: string, callback: EventBusListener) => void
  /**发布 */
  publish: (event: string, ...args: unknown[]) => void
}

const EventBusContext = createContext<EventBusContentProps>(null!)

export function useEventBusContext() {
  return useContext(EventBusContext)
}

export default function EventBusProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [listeners, setListeners] = useState<
    Record<string, EventBusListener[]>
  >({})
  const subscribe = useCallback(
    (event: string, callback: EventBusListener) => {
      if (!listeners[event]) {
        listeners[event] = []
      }
      listeners[event].push(callback)
      setListeners(listeners)
    },
    [listeners],
  )

  const unsubscribe = useCallback(
    (event: string, callback: EventBusListener) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(
          (listener) => listener !== callback,
        )
        setListeners(listeners)
      }
    },
    [listeners],
  )
  const publish = useCallback(
    (event: string, ...args: unknown[]) => {
      if (listeners[event]) {
        listeners[event].forEach((listener) => {
          listener(...args)
        })
      }
    },
    [listeners],
  )

  const contextValue = useMemo(() => {
    return {
      subscribe,
      unsubscribe,
      publish,
    }
  }, [subscribe, unsubscribe, publish])

  return (
    <EventBusContext.Provider value={contextValue}>
      {children}
    </EventBusContext.Provider>
  )
}
