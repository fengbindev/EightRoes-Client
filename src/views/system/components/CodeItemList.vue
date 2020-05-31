<template>
  <a-modal
    title="操作"
    :width="800"
    v-model="visible"
    :maskClosable="false"
    :footer="null"
  >
    <div class="right-list-toolbar right-list-panel-card">
      <toolbar>
        <a-button icon="plus" @click="$refs.modal.add()" v-priv="'CodeManagerPriv.Add'">新建</a-button>
        <a-button icon="save" @click="editClickHandler" :disabled="selectedRows.length != 1 || editEnable" v-priv="'CodeManagerPriv.Edit'">编辑</a-button>
        <a-button icon="delete" @click="delClickHandler" :disabled="selectedRows.length === 0 || delEnable" v-priv="'CodeManagerPriv.Delete'">删除</a-button>
      </toolbar>
      <div class="modal-table">
        <a-table
          ref="table"
          rowKey="codeValue"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
          :columns="columns"
          :data-source="data"
          :loading="loading"
        >
          <span slot="fixed" slot-scope="text,record">
            <a-icon type="check" :style="{color: '#67c23a'}" v-if="record.fixed" />
            <a-icon type="close" :style="{color: '#f56c6c'}" v-else/>
          </span>
        </a-table>
      </div>
      <code-item-modal ref="modal" @ok="handleOk" :codeType="codeType"/>
    </div>
  </a-modal>
</template>
<script>
import Toolbar from '@/components/Toolbar/Toolbar'
import CodeItemModal from '@/views/system/components/CodeItemModal'
import { STable } from '@/components'
import { getCodeItemList, delCodeItem } from '@/api/system'
export default {
  name: 'CodeItemList',
  components: {
    Toolbar,
    STable,
    CodeItemModal
  },
  data () {
    return {
      visible: false,
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],
      codeType: '',
      data: [],
      editEnable: false,
      delEnable: false,
      columns: [
        {
          title: '代码值',
          dataIndex: 'codeValue'
        },
        {
          title: '代码名称',
          dataIndex: 'codeName'
        },
        {
          title: '代码类别',
          dataIndex: 'codeType'
        },
        {
          title: '固定配置项',
          dataIndex: 'fixed',
          scopedSlots: { customRender: 'fixed' }
        },
        {
          title: '备注',
          dataIndex: 'memo'
        }
      ]
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    loadData () {
      this.loading = true
       getCodeItemList(this.codeType).then(res => {
         this.data = res.data
         this.loading = false
       })
    },
    open (codeType) {
      this.codeType = codeType
      this.visible = true
      this.loadData()
    },
    handleOk () {
      this.loadData()
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.editEnable = false
      this.delEnable = false
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows[i].fixed) {
          this.editEnable = true
          this.delEnable = true
        }
      }
    },
    editClickHandler () {
      const row = this.selectedRows[0]
      this.$refs.modal.edit(row)
    },
    delClickHandler () {
      const selectedRows = this.selectedRows
      for (let i = 0; i < selectedRows.length; i++) {
        const row = selectedRows[i]
        if (row.fixed) {
          this.$error({
            title: '错误',
            content: '所选记录中含有固定配置项,不能修改'
          })
          return
        }
      }
      const ids = this.selectedRowKeys.join()
      delCodeItem(this.codeType, ids).then(res => {
        if (res.status === 1) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
.modal-table {
  margin-top: 10px;
  height: 450px;
  overflow-y: auto;

  /deep/ .ant-empty-normal {
    margin: 140px 0 !important;
  }
}

</style>
