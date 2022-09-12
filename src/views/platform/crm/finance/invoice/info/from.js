
function sortList(list, key, group) {
  const arr = list
  arr.sort((a, b) => {
    return parseInt(b[key], 10) - parseInt(a[key], 10)
  })
  return unique(arr, group)
}

function unique(list, key) {
  const newlist = []
  const group = []
  list.forEach(element => {
    const find = group.indexOf(element[key].replace(/^\s+|\s+$/g, ''))
    if (find < 0) {
      newlist.push(element)
      group.push(element[key].replace(/^\s+|\s+$/g, ''))
    }
  })

  return newlist
}

export {
  sortList
}
