function getTagTree(data) {
  const arr = []
  for (var i in data) {
    if (Object.keys(data[i]).length && data[i]) {
      data[i].label = data[i].tag
      data[i].value = data[i].tag_id
      data[i].ID = i.id
      data[i].PId = i.pid
      data[i].nodelevel = 'tag'
      data[i].Children = []
      if (Object.keys(data[i].childs).length && data[i].childs) data[i].Children = getTagTree(data[i].childs)
      arr.push(data[i])
    }
  }
  return arr
}

function getTreeList(list) {
  const arr = []
  list.forEach(i => {
    i.label = i.name
    i.value = (i.id).toString()
    i.ID = i.id
    i.PId = i.pid
    i.children = []
    if (i.childs && i.childs.length) i.children = getTreeList(i.childs)
    if (i.children.length === 0) delete i.children
    arr.push(i)
  })
  return arr
}
function ObjectArr(obj) {
  const arr = []
  if (obj && Object.keys(obj).length) {
    for (var i in obj) {
      if (obj[i]) arr.push(Number(i))
    }
  }
  return arr
}
export {
  getTagTree, getTreeList, ObjectArr
}
