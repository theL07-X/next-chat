'use client'
import { HiPlus } from 'react-icons/hi'
import { LuPanelLeft } from 'react-icons/lu'

import { useAppContext } from '@/components/AppContext'
import Button from '@/components/common/Button'

import { ActionType } from '@/reducers/AppReducer'

export default function Menubar() {
  const { dispatch } = useAppContext()
  /**隐藏导航点击 */
  const onHideNavigation = () => {
    dispatch({
      type: ActionType.UPDATE,
      field: 'displayNavigation',
      value: false,
    })
  }
  /**新建对话  当前选中对话置空 */
  const onStartNewClick = () => {
    dispatch({
      type: ActionType.UPDATE,
      field: 'selectedChat',
      value: undefined,
    })
  }
  return (
    <div className="flex flex-shrink-0 space-x-3">
      <Button
        icon={HiPlus}
        variant="outline"
        className="flex-1"
        onClick={onStartNewClick}
      >
        新建对话
      </Button>
      <Button icon={LuPanelLeft} variant="outline" onClick={onHideNavigation} />
    </div>
  )
}
