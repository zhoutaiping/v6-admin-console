import moment from 'moment'

/*
 * @moduleName:通用工具类
 * @Author: dawdler
 * @Date: 2019-01-09 15:30:18
 * @LastModifiedBy: dawdler
 * @LastEditTime: 2019-03-22 16:31:42
 */
export default {
  getTreeData,
  each,
  CountDown
}
/*
each(arr, (item, children) => {
    item.value = xx;
    // 该item 包含children，因此直接赋值,不需要单独处理children里面的值
});
 * [_each description]  倒查、展平、数据回调返回回当前一条数据和子集
 * @param  {[Array]}   data     [description]
 * @param  {Function}  callback [description]
 * @param  {String}    childName[description]
 * @return {[Array]}            [description]
 * 默认使用副本,在callback处理数据，如果不使用副本，那么需要重新对treeData赋值
    treeData = each(treeData, (item, children) => {
        item.value = xx;
    });
 */
export function each(data, callback, childName = 'children') {
  let current
  let children
  for (let i = 0, len = data.length; i < len; i++) {
    current = data[i]
    children = []
    if (current[childName] && current[childName].length > 0) {
      children = current[childName]
    }
    callback && callback(current, children)
    if (children.length > 0) {
      each(children, callback, childName)
    }
  }
}

/**
 * @Author yihuang",
 * @param data     数据
 * @param id       要比对的名称
 * @param val      要比对的值
 * @param name     要返回的名称
 * @param children 子集名称
 * @param isRow    是否返回这一行的数据
 * @注 迭代判断多层
 * //=======================
 * 返回这一条数据的中文名
 * let name=utils.getTreeData(arr, 'flowId', item.decategoryId, 'name');
 * //=======================
 * 返回所有匹配的数据
 * let arr=utils.getTreeData(arr, 'flowId', item.decategoryId, 'name','children',true);
 */
export function getTreeData(
  data,
  id = 'id',
  val = '',
  name = 'name',
  children = 'children',
  isRow = false
) {
  const arr = []
  each(
    data,
    item => {
      if (item[id] === val) {
        arr.push(item)
      }
    },
    children
  )
  return arr.length > 0 ? (isRow ? arr : arr[0][name]) : null
}

export function CountDown(datetime, d, type) {
  // 求时间差：
  const date1 = moment(new Date()) // 开始时间
  const date2 = moment(datetime) // 结束时间
  const date3 = Number(date2 - date1) // 时间差的毫秒数
  // 计算出相差天数
  const days = Math.floor(date3 / (24 * 3600 * 1000))

  // 计算出小时数

  const leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))

  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000)

  const dayStr = days >= 0 ? Number(days) + '天 ' : '过期' + Math.abs(Number(days)) + '天 '
  const hoursStr = hours >= 0 ? Number(hours) + '小时 ' : Math.abs(Number(hours)) + '小时 '
  const minutesStr = minutes >= 0 ? Number(minutes) + '分钟 ' : Math.abs(Number(minutes)) + '分钟 '
  const secondsStr = seconds >= 0 ? Number(seconds) + '秒 ' : Math.abs(Number(seconds)) + '秒 '
  let leftTime = dayStr + hoursStr + minutesStr + secondsStr

  if (type === 2) {
    leftTime = Number(days) + '天 ' + Number(hours) + '小时 ' + Number(minutes) + ' 分钟' + Number(seconds) + ' 秒'
  }
  return leftTime
}

export function formartArrLabel(list, value, key) {
  const arr = JSON.parse(JSON.stringify(list))
  let val = ''
  for (let index = 0; index < arr.length; index++) {
    if (arr[index].value === value) {
      val = arr[index][key]
      break
    } else {
      if (arr[index].children && arr[index].children.length) {
        const k_y = formartArrLabel(arr[index].children, value, key)
        if (k_y) {
          val = k_y
          break
        }
      }
    }
  }
  return val
}

export function formartObjArr(data = {}) {
  const list = []
  Object.keys(data).forEach(i => {
    list.push({
      label: data[i],
      value: i
    })
  })
  return list
}
