import { useMemo, useState } from 'react'

import clsx from 'clsx'
import { MdOutlineTipsAndUpdates } from 'react-icons/md'

import Button from '@/components/common/Button'
import { useEventBusContext } from '@/components/EventBusContext'

import examples from '@/data/examples.json'

export default function Example() {
  /**是否显示全部示例内容 */
  const [showFull, setShowFull] = useState(false)

  /**示例列表 */
  const list = useMemo(() => {
    return showFull ? examples : examples.slice(0, 15)
  }, [showFull])
  /**展开 & 收起点击 */
  const onToggle = () => {
    return setShowFull(!showFull)
  }
  const { publish } = useEventBusContext()
  return (
    <>
      <div className="mb-4 mt-20 text-4xl">
        <MdOutlineTipsAndUpdates />
      </div>
      <ul className="flex flex-wrap justify-center gap-3.5">
        {list.map((item) => {
          return (
            <li
              key={item.act}
              onClick={() => publish('createNewChat', item.prompt)}
            >
              <Button>{item.act}</Button>
            </li>
          )
        })}
      </ul>
      {!showFull && <p className="p-2">...</p>}
      <div
        className={clsx('flex w-full items-center space-x-2', {
          'mt-1': showFull,
        })}
      >
        <hr className="flex-1 border-t border-dotted border-gray-200 dark:border-gray-600" />
        <Button variant="text" onClick={onToggle}>
          {showFull ? '收起' : '查看全部'}
        </Button>
        <hr className="flex-1 border-t border-dotted border-gray-200 dark:border-gray-600" />
      </div>
    </>
  )
}
