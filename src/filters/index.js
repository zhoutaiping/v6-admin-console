// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'

export function labelView(value, origin, label = 'label', noknow = '未知') {
  if (!origin) return

  const item = origin.find(i => i.value === value)

  let name
  if (item) name = item[label]
  return name || noknow
}
