'use client'
import React from 'react'

import clsx from 'clsx'
import { LuPanelLeft } from 'react-icons/lu'

import { useAppContext } from '@/components/AppContext'
import Button from '@/components/common/Button'

import { ActionType } from '@/reducers/AppReducer'

export default function Menu() {
  const {
    state: { displayNavigation },
    dispatch,
  } = useAppContext()
  /**显示导航点击 */
  const onShowNavigation = () => {
    dispatch({
      type: ActionType.UPDATE,
      field: 'displayNavigation',
      value: true,
    })
  }
  return (
    <Button
      className={clsx('fixed left-2 top-2', {
        hidden: displayNavigation,
      })}
      icon={LuPanelLeft}
      variant="outline"
      onClick={onShowNavigation}
    />
  )
}
