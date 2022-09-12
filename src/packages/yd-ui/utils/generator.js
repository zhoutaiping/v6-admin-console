// 数据仓库
export function store(type, inital, num = 0) {
  let data
  if (inital) {
    data = []
    if (num > 0) {
      for (let i = 0; i < num; i++) {
        data.push(inital)
      }
    }
  } else {
    data = type()
  }

  return {
    loading: false,
    _: data
  }
}

export function dialog() {
  return {
    loading: false,
    visible: false
  }
}

// export function form(form, rule) {
//   return {
//     _: form,
//     raw:
//     rule
//   }
// }
