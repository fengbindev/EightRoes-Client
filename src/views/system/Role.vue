<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="角色名称">
              <a-input placeholder="请输入" v-model="queryParam.roleName"/>
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
      <a-button type="primary" icon="plus" @click="$refs.modal.add()" v-priv="'RoleManagerPriv.Add'">新建</a-button>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="roleCode"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="privRangeEnable" @click="handleScope(record)">数据权限</a>
        <a-divider v-if="privRangeEnable" type="vertical" />
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider v-if="editEnabel" type="vertical" />
        <a-popconfirm
          v-if="removeEnable"
          title="确定要删除吗?"
          @confirm="() => handleDelete(record.roleCode)"
        >
          <a v-if="removeEnable" href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </s-table>
    <role-modal ref="modal" @ok="handleOk" />
    <menu-permission-modal ref="permissionModal" type="R" :id="id"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import MenuPermissionModal from '@/views/system/components/MenuPermissionModal'
import { getRoleList, delRole } from '@/api/system'
import RoleModal from '@/views/system/components/RoleModal'
// import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    STable,
    RoleModal,
    MenuPermissionModal
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
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
          title: '角色名称',
          dataIndex: 'roleName'
        },
        {
          title: '角色代码',
          dataIndex: 'roleCode'
        },
        {
          title: '所属机构',
          dataIndex: 'branchName'
        },
        {
          title: '备注',
          dataIndex: 'memo'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        }, {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getRoleList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      privRangeEnable: this.$auth('RoleManagerPriv.PrivRange'),
      editEnabel: this.$auth('RoleManagerPriv.Edit'),
      removeEnable: this.$auth('RoleManagerPriv.Delete')
    }
  },
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleScope (record) {
      this.id = record.roleCode
      this.$refs.permissionModal.permission(record)
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    handleDelete (id) {
      delRole(id).then(res => {
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
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
