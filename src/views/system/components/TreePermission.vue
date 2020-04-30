<template>
  <div>
    <a-tree
      v-if="treeData.length"
      checkable
      checkStrictly
      :treeData="treeData"
      :selectable="false"
      :defaultExpandAll="true"
      @check="this.onCheck"
      :checkedKeys="checkedKeys"
    />
    <a-empty description="没有任何权限" v-else/>
  </div>
</template>
<script>

export default {
  props: {
    'checkedKeys': {
      type: Array,
      required: true
    },
    'treeData': {
      type: Array,
      required: true
    }
  },
  computed: {
    tmpCheckedKeys: {
      get () {
        return this.checkedKeys
      },
      set (val) {
        this.$emit('update:checkedKeys', val)
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    onCheck (checkedKeys, e) {
      const checked = checkedKeys.checked
      let data = Object.assign([], this.treeData)
      const pos = e.node.pos.split('-')
      if (e.checked) {
        // 选中当前节点的所有父节点和所有的子节点
        let i = 1
        for (i = 1; i < pos.length - 1; i++) {
          if (!checked.includes(data[pos[i]].key)) {
            checked.push(data[pos[i]].key)
          }
          data = data[pos[i]].children
        }
        data = data[pos[i]].children
        if (data) {
          this.checkedAllChildrenKey(checked, data)
        }
      } else {
        for (let i = 1; i < pos.length; i++) {
          data = data[pos[i]].children
        }
        this.unCheckedAllChildrenKey(checked, data)
      }
      this.tmpCheckedKeys = checked
    },
    checkedAllChildrenKey (checked, children) {
      if (children) {
        for (let i = 0; i < children.length; i++) {
          if (!checked.includes(children[i].key)) {
            checked.push(children[i].key)
          }
          this.checkedAllChildrenKey(checked, children[i].children)
        }
      }
    },
    unCheckedAllChildrenKey (checked, children) {
      if (children) {
        for (let i = 0; i < children.length; i++) {
          if (checked.includes(children[i].key)) {
            var index = checked.indexOf(children[i].key)
              if (index > -1) {
              checked.splice(index, 1)
            }
          }
          this.unCheckedAllChildrenKey(checked, children[i].children)
        }
      }
    },
    /* 全选按钮点击事件 */
    checkedAllOnClickHandler () {
      if (this.tmpCheckedKeys.length > 0) {
        this.tmpCheckedKeys = []
      } else {
        const data = Object.assign([], this.treeData)
        this.checkedAllChildrenKey(this.tmpCheckedKeys, data)
      }
    }
  }
}
</script>
