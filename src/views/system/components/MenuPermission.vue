<template>
  <div class="right-list-toolbar right-list-panel-card">
    <toolbar>
      <a-button icon="save" :loading="saveDataLoading" @click="saveClikeHandler">保存</a-button>
      <a-button icon="check" :loading="checkDataLoading" @click="checkedAllOnClickHandler">全选</a-button>
    </toolbar>
    <div class="tree-wrapper">
      <a-spin :spinning="spinning">
        <tree-permission :checkedKeys.sync="checkedKeys" :treeData="treeData" ref="treePermission"></tree-permission>
      </a-spin>
    </div>
  </div>
</template>
<script>
import Toolbar from '@/components/Toolbar/Toolbar'
import TreePermission from '@/views/system/components/TreePermission.vue'
import { getPermissionTree, savePermission } from '@/api/system'
import { asyncRouterMap } from '@/config/router.config'
import { getMenuTreePermission } from '@/utils/permissions'
export default {
  name: 'BranchModal',
  components: {
    Toolbar,
    TreePermission
  },
  props: {
    id: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      checkedKeys: [],
      treeData: [],
      spinning: false,
      saveDataLoading: false,
      checkDataLoading: false,
      queryParam: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.spinning = true
      this.queryParam.id = this.id
      this.queryParam.type = this.type
      getPermissionTree(Object.assign(this.queryParam)).then(res => {
        this.treeData = getMenuTreePermission(res.data.tree, [], asyncRouterMap[0].children)
        this.checkedKeys = res.data.value
      }).finally(() => {
        this.spinning = false
      })
    },
    checkedAllOnClickHandler () {
      this.checkDataLoading = true
      this.$refs.treePermission.checkedAllOnClickHandler()
      this.checkDataLoading = false
    },
    saveClikeHandler () {
      this.saveDataLoading = true
      const params = { id: this.id, type: this.type, data: this.checkedKeys.join() }
      savePermission(params).then(res => {
        if (res.status === 1) {
          this.$message.success('保存成功')
          this.$emit('ok')
          this.visible = false
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      }).finally(() => {
        this.saveDataLoading = false
      })
    }
  }
  // watch: {
  //   id: function (value, oldValue) {
  //     if (value) {
  //       this.getData()
  //     } else {
  //       this.treeData = []
  //       this.checkedKeys = []
  //     }
  //   }
  // }
}
</script>

<style lang="less" scoped>
  .tree-wrapper {
    margin-top: 5px;
    min-height: 400px;
    /deep/ .tree_float {
      float: left;
    };
    /deep/ .tree_clear {
     clear: both;
    }

    /deep/ .ant-tree-child-tree > li {
      padding-top: 8px;
    }
  }
</style>
