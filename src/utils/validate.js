import dnsDomain from './verify'

export function isvalidUsername(str) {
  return str.trim()
}
/** 合法域名 */

export function validateDomain(val) {
  return dnsDomain.test(val)
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
