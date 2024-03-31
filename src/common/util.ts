import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
export function groupByDate(chatList: Chat[]) {
  const groupMap = new Map<string, Chat[]>()
  chatList.forEach((item) => {
    const updateTime = new Date(item.updateTime)
    let key = '未知时间'
    if (dayjs().isSame(updateTime, 'day')) {
      key = '今天'
    } else if (
      dayjs(updateTime).isBetween(dayjs().subtract(7, 'day'), dayjs())
    ) {
      key = '最近7天'
    } else if (
      dayjs(updateTime).isBetween(dayjs().subtract(30, 'day'), dayjs())
    ) {
      key = '最近一个月'
    } else if (dayjs().isSame(updateTime, 'year')) {
      key = `${updateTime.getMonth() + 1}月`
    } else {
      key = `${dayjs(updateTime).format('YYYY年MM月DD日')}`
    }
    if (groupMap.has(key)) {
      groupMap.get(key)?.push(item)
    } else {
      groupMap.set(key, [item])
    }
  })
  groupMap.forEach((item) => {
    item.sort((a, b) => b.updateTime - a.updateTime)
  })
  const groupList = Array.from(groupMap).sort(([, list1], [, list2]) => {
    return (
      list2[list2.length - 1].updateTime - list1[list1.length - 1].updateTime
    )
  })
  return groupList
}

export function sleep(time: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve('time is up')
    }, time),
  )
}
