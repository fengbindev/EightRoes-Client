import Vue from 'vue'
import Privilege from '@/utils/privilege.js'

const action = Vue.directive('priv', {
  inserted: function (el, binding, vnode) {
    const privId = binding.expression
    const flag = Privilege.hasPriv(privId)
    if (!flag) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export default action
