import React from 'react'

import clsx from 'clsx'
import { PiLightningFill, PiShootingStarFill } from 'react-icons/pi'

import { useAppContext } from '@/components/AppContext'

import { ActionType, State } from '@/reducers/AppReducer'

type ModelItem = {
  id: State['currentModel']
  name: string
  icon: React.ReactNode
}
export default function ModelSelect() {
  const models: ModelItem[] = [
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5',
      icon: <PiLightningFill />,
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      icon: <PiShootingStarFill />,
    },
  ]
  const {
    state: { currentModel },
    dispatch,
  } = useAppContext()
  /**模式选择点击 */
  const onSelectModel = (id: State['currentModel']) => {
    return dispatch({
      type: ActionType.UPDATE,
      field: 'currentModel',
      value: id,
    })
  }
  return (
    <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
      {models.map((item) => {
        const selected = item.id === currentModel
        return (
          <button
            key={item.id}
            onClick={() => onSelectModel(item.id)}
            className={clsx(
              'group flex min-w-[148px] items-center justify-center space-x-2 rounded-lg border py-2.5 text-sm font-medium hover:text-gray-900 hover:dark:text-gray-100',
              {
                'border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100':
                  selected,
                'border-transparent text-gray-500': !selected,
              },
            )}
          >
            <span
              className={clsx(
                'transition-colors duration-100 group-hover:text-[#26cf8e]',
                {
                  'text-[#26cf8e]': selected,
                },
              )}
            >
              {item.icon}
            </span>
            <span className="transition-colors duration-100">{item.name}</span>
          </button>
        )
      })}
    </div>
  )
}
