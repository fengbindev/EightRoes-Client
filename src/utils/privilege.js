// eslint-disable-next-line no-unused-vars
/* global localStorage */

import store from '@/store'
const Privilege = function (obj) {
  if (typeof (obj) === 'string') {
    obj = JSON.parse(obj)
  }
  this.data = obj.priv
  Privilege.instance = this
}

Privilege.prototype.hasPriv = function (k) {
  if (!k) {
    return false
  }
  const userName = store.getters.userName
  const adminUserName = store.getters.adminUserName
  if (adminUserName && userName && adminUserName === userName) {
    return true
  }
  k = k.replace(/'/g, '')
  const flag = this.data.hasOwnProperty(k)
  return flag
}
Privilege.prototype.update = function (obj) {
  if (!obj) {
    return
  }
  if (typeof (obj) === 'string') {
    obj = JSON.parse(obj)
  }
  this.data = obj
}

Privilege.hasPriv = function (privID) {
  var arr = privID.split('||')
  var flag = false
  const userName = store.getters.userName
  const adminUserName = store.getters.adminUserName
  if (adminUserName && userName && adminUserName === userName) {
    flag = true
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        continue
      }
      var item = arr[i]
      if (Privilege.PrivParams) {
        for (var k in Privilege.PrivParams) {
          item = item.replace('${' + k + '}', Privilege.PrivParams[k])// 替换变量
        }
      }
      if (Privilege.instance.hasPriv(item)) {
        flag = true
      }
    }
  }
  return flag
}

export default Privilege
