export default (type, val) => {
  if (type === 'money') {
    if (isNaN(val)) {
      return val
    } else {
      return Number(val).toFixed(2)
    }
  } else {
    return val
  }
}
