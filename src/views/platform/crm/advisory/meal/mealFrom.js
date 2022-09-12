
const test_user_list = [
  { text: '测试用户', value: '1' },
  { text: '非测试用户', value: '0' },
  { text: '未知', value: '2' }
]
const plan_status_list = [
  { text: '全部', value: '' },
  { text: '未到期', value: '1' },
  { text: '已到期', value: '2' }
]
function getArrItem(list) {
  let item_text = ''
  list.forEach((item, index) => {
    if (index > 0) {
      item_text = item_text + ',' + item
    } else if (index === 0) {
      item_text = item
    }
  })
  return item_text
}

const PLATFORM = [
  { lable: '全部所属平台', value: '' },
  { lable: '云盾', value: '1' },
  { lable: '白山云', value: '2' },
  { label: 'Canvas用户端', value: '3' }
]

const PLATFORM_TEXT = { 1: '云盾', 2: '白山云', 3: 'Canvas用户端' }

export {
  PLATFORM, PLATFORM_TEXT,
  plan_status_list, test_user_list, getArrItem
}

