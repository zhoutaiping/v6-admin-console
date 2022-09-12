function isIp(value) {
  var regexp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  var valid = regexp.test(value)
  if (!valid) return false
  return value.split('.').every(function(num) {
    if (num.length > 1 && num.charAt(0) === '0') return false
    if (parseInt(num, 10) > 255) return false
    return true
  })
}
export {
  isIp
}
