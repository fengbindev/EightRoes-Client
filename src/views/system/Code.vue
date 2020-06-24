<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item>
              <a-input placeholder="请输入代码类别或名称" v-model="queryParam.searchName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.modal.add()" v-priv="'CodeManagerPriv.Add'">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="() => handleDelete()" v-priv="'CodeManagerPriv.Delete'">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="codeType"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
      :columns="columns"
      :data="loadData"
    >
      <a slot="codeType" slot-scope="codeType" @click="$refs.itemListModal.open(codeType, allowAddItem)">{{ codeType }}</a>
      <span slot="fixed" slot-scope="text,record">
        <a-icon type="check" :style="{color: '#67c23a'}" v-if="record.fixed" />
        <a-icon type="close" :style="{color: '#f56c6c'}" v-else/>
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)" :disabled="record.fixed">编辑</a>
        <a-divider v-if="editEnabel" type="vertical" />
        <a-popconfirm
          v-if="removeEnable"
          title="确定要删除吗?"
          @confirm="() => handleDelete()"
        >
          <a v-if="removeEnable" href="javascript:;" :disabled="record.fixed">删除</a>
        </a-popconfirm>
      </span>
    </s-table>
    <code-modal ref="modal" @ok="handleOk"/>
    <code-item-list ref="itemListModal"/>
  </a-card>
</template>

<script>
import CodeModal from '@/views/system/components/CodeModal'
import CodeItemList from '@/views/system/components/CodeItemList'
import { STable } from '@/components'
import { getCodeList, delCode } from '@/api/system'
export default {
  name: 'Code',
  components: {
    STable,
    CodeModal,
    CodeItemList
  },
  data () {
    return {
      description: '',
      id: '',
      mdl: {},
      permissions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '代码类别',
          dataIndex: 'codeType',
          scopedSlots: { customRender: 'codeType' }
        },
        {
          title: '代码名称',
          dataIndex: 'codeName'
        },
        {
          title: '固定配置项',
          dataIndex: 'fixed',
          scopedSlots: { customRender: 'fixed' }
        },
        {
          title: '备注',
          dataIndex: 'memo'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getCodeList(Object.assign(parameter, {
            searchName: this.queryParam.searchName ? this.queryParam.searchName.trim() : ''
          }))
      },
      selectedRowKeys: [],
      selectedRows: [],
      editEnabel: this.$auth('CodeManagerPriv.Edit'),
      removeEnable: this.$auth('CodeManagerPriv.Delete')
    }
  },
  created () {
  },
  methods: {
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    handleDelete () {
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
      delCode(ids).then(res => {
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
