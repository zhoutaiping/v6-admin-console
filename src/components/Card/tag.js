const l_array = require('lodash/array')

function getNode(list, id) { // 获取标签
  let tagNode = null
  const len = list.length
  for (let i = 0; i < len; i++) {
    if (Number(list[i].tag_id) === id) {
      tagNode = list[i]
      break
    } else {
      tagNode = getNodeItem(list[i].item, id)
      if (tagNode) {
        break
      }
    }
  }
  if (tagNode) return tagNode
}
function getNodeItem(list, value) {
  let tagNode = null
  for (let i = 0; i < list.length; i++) {
    if (Number(list[i].tag_id) === Number(value)) {
      tagNode = list[i]
      break
    } else {
      if (list[i].item && list[i].item.length) {
        tagNode = getNodeItem(list[i].item, value)
        if (tagNode) break
      }
    }
  }
  if (tagNode) return tagNode
}

function getTypeIds(list) { // 获取该类型下全部 ids
  const ids = {}
  list.forEach(i => {
    const id = getIds(i.item)
    ids[i.value] = id
  })
  return ids
}
function getIds(list) {
  let id = []
  list.forEach(i => {
    if (i.tag_id) id.push(i.tag_id)
    if (i.item && i.item.length) {
      const next_id = getIds(i.item)
      id = [... new Set(l_array.concat(next_id, id))]
    }
  })
  return id
}

export {
  getNode, getTypeIds
}
