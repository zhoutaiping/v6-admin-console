const search = {
  type: ''
}

const data = []
function setTagTreee(Tag) {
  const tagTree = []
  if (Tag && Object.keys(Tag).length) {
    for (var i in Tag) {
      const tagNode = {
        label: i,
        ID: 0,
        PID: 0,
        nodelevel: 'type',
        Children: setTagNode(Tag[i])
      }
      tagTree.push(tagNode)
    }
  }
  return tagTree
}
function setTagNode(list) {
  const arr = []
  list.forEach(i => {
    i.label = i.tag
    i.ID = i.id
    i.PId = i.pid
    i.nodelevel = 'tag'
    i.Children = i.childs.length && setTagNode(i.childs) || []
    arr.push(i)
  })
  return arr
}

function getTagTreeList(data) {
  const arr = []
  const obj = JSON.parse(JSON.stringify(data))
  for (var i in obj) {
    const item = obj[i]
    if (Object.keys(item).length && item) {
      item.label = item.tag
      item.value = item.tag_id
      item.ID = i.id
      item.PId = i.pid
      item.nodelevel = 'tag'
      item.Children = []
      if (Object.keys(item.childs).length && item.childs) item.Children = getTagTreeList(item.childs)
      arr.push(item)
    }
  }
  return arr
}
export {
  search, data, setTagTreee, setTagNode, getTagTreeList
}
