'use client'
import React from 'react'

import { MdDarkMode, MdInfo, MdLightMode } from 'react-icons/md'

import { useAppContext } from '@/components/AppContext'
import Button from '@/components/common/Button'

import { ActionType } from '@/reducers/AppReducer'

export default function Toolbar() {
  const {
    state: { themeMode },
    dispatch,
  } = useAppContext()
  /**切换主题色点击 */
  const onToggleTheme = () => {
    dispatch({
      type: ActionType.UPDATE,
      field: 'themeMode',
      value: themeMode === 'light' ? 'dark' : 'light',
    })
  }
  return (
    <div className="flex w-full flex-shrink-0 justify-between bg-gray-600 px-2">
      <Button
        icon={themeMode === 'light' ? MdDarkMode : MdLightMode}
        variant="text"
        onClick={onToggleTheme}
      />
      <Button icon={MdInfo} variant="text" />
    </div>
  )
}
