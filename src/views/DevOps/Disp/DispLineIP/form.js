
/**
 * 定义常用变量方法
 */

const search = {
  id: '',
  region: ''
}

const myBackToTopStyle = {
  right: '50px',
  bottom: '40px',
  width: '40px',
  height: '40px',
  'z-index': '999',
  'border-radius': '4px',
  'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
  background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
}
const COLUMN = [
  { label: 'ID', prop: 'id', width: '65' },
  { label: 'IP/IP段', prop: 'back_ips' },
  { label: '线路名称', prop: 'name', width: '250' },
  { label: '线路标签', prop: 'key' },
  { label: '更新时间', prop: 'update_at' },
  { label: '备注', prop: 'remark' }
]

const COLUMN2 = [
  { label: 'ID', prop: 'id', width: '65' },
  { label: '线路名称', prop: 'name', width: '250' },
  { label: 'IP/IP段', prop: 'ip' },
  { label: '线路标签', prop: 'key' },
  { label: '更新时间', prop: 'update_at' },
  { label: '备注', prop: 'remark' }
]

const pagination = {
  page_sizes: [10, 20, 50, 100],
  page: 1,
  per_page: 10,
  total: 0
}

function getTreeList(list) {
  const arr = []
  list.forEach(i => {
    i.ID = i.id
    i.PId = i.pid
    i.ID = i.id
    i.Children = i.childs
    if (i.Children.length) i.Children = getTreeList(i.Children)
    arr.push(i)
  })
  return arr
}
const RULES = {
  line: [{ required: true, message: '请选择线路', trigger: ['change', 'blur'] }],
  back_ips: [{ required: true, message: '请输入IP/IP段', trigger: ['change', 'blur'] }],
  name: [{ required: true, message: '请输入线路名称', trigger: ['change', 'blur'] }],
  key: [{ required: true, message: '请输入线路关键词', trigger: ['change', 'blur'] }],
  status: [{ required: true, message: '选择线路状态', trigger: ['change', 'blur'] }],
  sort: [],
  remark: []
}
export {
  search, myBackToTopStyle, pagination, COLUMN, COLUMN2, getTreeList, RULES
}
