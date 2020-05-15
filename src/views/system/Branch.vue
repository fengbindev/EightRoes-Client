<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="部门名称" >
              <a-input placeholder="请输入" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="this.fetch">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.modal.add()" v-priv="'BranchManagerPriv.Add'">新建</a-button>
    </div>
    <a-table
      ref="table"
      rowKey="branchInnercode"
      :expandedRowKeys="expandedRowKeys"
      @expandedRowsChange="expandedRowsChange"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :dataSource="data">
      <span slot="action" slot-scope="text, record">
        <a v-if="privRangeEnable" @click="handlePermission(record)">权限范围</a>
        <a-divider v-if="privRangeEnable" type="vertical" />
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider v-if="editEnabel" type="vertical" />
        <a-popconfirm
          v-if="removeEnable"
          title="确定要删除吗?"
          @confirm="() => handleDelete(record.branchInnercode)"
        >
          <a v-if="removeEnable" href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <branch-modal ref="modal" @ok="handleOk"/>
    <menu-permission-modal ref="permissionModal" type="B" :id="id"/>
  </a-card>
</template>

<script>
import { Table as T } from 'ant-design-vue'
import { getBranchList, delBranch } from '@/api/system'
import BranchModal from '@/views/system/components/BranchModal'
import MenuPermissionModal from '@/views/system/components/MenuPermissionModal'

// import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    T,
    BranchModal,
    MenuPermissionModal
  },
  data () {
    return {
      description: '',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'name'
        },
        {
          title: '排序',
          dataIndex: 'orderFlag'
        },
        {
          title: '编码',
          dataIndex: 'branchCode'
        },
        {
          title: '机构主管',
          dataIndex: 'manager'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '15%',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      id: '',
      data: [],
      expandedRowKeys: [],
      pagination: false,
      loading: false,
      privRangeEnable: this.$auth('BranchManagerPriv.PrivRange'),
      editEnabel: this.$auth('BranchManagerPriv.Edit'),
      removeEnable: this.$auth('BranchManagerPriv.Delete')
    }
  },
  filters: {
  },
  created () {
    this.fetch()
  },
  methods: {
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handlePermission (record) {
      this.id = record.branchInnercode
      this.$refs.permissionModal.permission(record)
    },
    handleOk () {
      this.fetch()
    },
    handleDelete (ids) {
      delBranch(ids).then(res => {
        if (res.status === 1) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    fetch () {
      this.loading = true
      getBranchList(Object.assign(this.queryParam)).then(res => {
        this.expandedRowKeys = res.data.map(data => data.branchInnercode)
        this.data = res.data
        this.loading = false
      })
    },
    expandedRowsChange (expandedRows) {
      this.expandedRowKeys = expandedRows
    }
  },
  watch: {
  }
}
</script>
