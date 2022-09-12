import JSEncrypt from 'jsencrypt'
import Encrypt from 'encryptlong'
import { deepClone } from '@/utils'
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCre2lnKqvaC+y7rw0zKOEC+OdO
OwJLf3Ylw/9qyKZQ/qyNRNc6m2EEnnqhpe6diCQWtN6Ea4j+SfvJrRgnLXF6byY6
yeQ5S9v+IbylqzmknM+dvMqxPjDkrg/8RY1AwhoJ9j067iBBiNFabNdq+yEgEa18
sGYhZfjjpMpPXfxy8wIDAQAB
-----END PUBLIC KEY-----`

export default {
  /** JSEncrypt 加密*/
  rsaPublicData(data) {
    const jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(publicKey)
    var result = jsencrypt.encrypt(data)
    return result
  },
  /** Encrypt 加密*/
  encrypt(data) {
    const PUBLICKEY = publicKey

    const encryptot = new Encrypt()
    encryptot.setPrivateKey(PUBLICKEY)

    var result = encryptot.encryptLong(data)
    return result
  },

  setRsa(data) {
    const res = deepClone(data)
    Object.keys(res).forEach(key => {
      res[key] = this.rsaPublicData(res[key])
    })
    return res
  }

}
