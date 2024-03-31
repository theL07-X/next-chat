'use client'
import clsx from 'clsx'

import { useAppContext } from '@/components/AppContext'

import ChatList from './ChatList'
import Menubar from './Menubar'
import Toolbar from './Toolbar'

export default function Navigation() {
  const {
    state: { displayNavigation },
  } = useAppContext()
  return (
    <nav
      className={clsx(
        'flex h-full w-[260px] flex-shrink-0 flex-col bg-gray-900 p-2 text-gray-300',
        {
          hidden: !displayNavigation,
        },
      )}
    >
      <Menubar />
      <ChatList />
      <Toolbar />
    </nav>
  )
}
