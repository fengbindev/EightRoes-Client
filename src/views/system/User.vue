<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="用户名">
              <a-input placeholder="请输入" v-model="queryParam.userName"/>
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
      <a-button type="primary" icon="plus" @click="$refs.modal.add()" v-priv="'UserManagerPriv.Add'">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item> <a-icon type="delete" /><span @click="() => handleDeleteBatch(selectedRowKeys.join())" v-priv="'UserManagerPriv.Delete'">删除</span></a-menu-item>
          <a-menu-item><a-icon type="lock" /><span @click="() => handleEnable(selectedRowKeys.join())" v-priv="'UserManagerPriv.Enable'">启用</span></a-menu-item>
          <a-menu-item><a-icon type="lock" /><span @click="() => handleDisabled(selectedRowKeys.join())" v-priv="'UserManagerPriv.Disable'">禁用</span></a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="userName"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="status" slot-scope="text,record">
        <a-icon type="check" :style="{color: '#67c23a'}" v-if="record.status==='Y'" />
        <a-icon type="close" :style="{color: '#f56c6c'}" v-else/>
      </span>
      <span slot="roles" slot-scope="roles">
        <a-tag
          v-for="role in roles"
          color="blue"
          :key="role.roleCode"
        >
          {{ role.roleName }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="privRangeEnable" @click="handleScope(record)">数据权限</a>
        <a-divider v-if="privRangeEnable" type="vertical" />
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider v-if="editEnabel" type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">更多<a-icon type="down" /></a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a-popconfirm
                v-if="removeEnable"
                title="确定要删除吗?"
                @confirm="() => handleDelete(record.userName)"
              >
                <a v-if="removeEnable" href="javascript:;">删除</a>
              </a-popconfirm>
            </a-menu-item>
            <a-menu-item>
              <a v-priv="'UserManagerPriv.ChangePassword'" href="javascript:;" @click="modifyPasswordHandler(record.userName)">修改密码</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>
    <user-modal ref="modal" @ok="handleOk" />
    <menu-permission-modal ref="permissionModal" type="U" :id="id"/>
    <modify-password-modal :edit-pwd-modal.sync="editPwdModal" :user-name="userName" v-if="editPwdModal"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import MenuPermissionModal from '@/views/system/components/MenuPermissionModal'
import { getUserList, delUser, enableUser, disabledUser } from '@/api/system'
import UserModal from '@/views/system/components/UserModal'
import ModifyPasswordModal from '@/views/system/components/ModifyPasswordModal'
export default {
  name: 'User',
  components: {
    STable,
    UserModal,
    MenuPermissionModal,
    ModifyPasswordModal
  },
  data () {
    return {
      description: '',
      visible: false,
      editPwdModal: false,
      userName: '',
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
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: '真实姓名',
          dataIndex: 'realName'
        },
        {
          title: '用户状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '所属机构',
          dataIndex: 'branchName'
        },
        {
          title: '所属角色',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' }
        }, {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      privRangeEnable: this.$auth('UserManagerPriv.PrivRange'),
      editEnabel: this.$auth('UserManagerPriv.Edit'),
      removeEnable: this.$auth('UserManagerPriv.Delete')
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
      this.id = record.userName
      this.$refs.permissionModal.permission(record)
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    handleDeleteBatch (ids) {
      const that = this
      this.$confirm({
        title: '确定要删除吗？删除后无法恢复！',
        okType: 'danger',
        onOk () {
          that.handleDelete(ids)
        }
      })
    },
    handleDelete (ids) {
      delUser(ids).then(res => {
        if (res.status === 1) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleEnable (ids) {
      enableUser(ids).then(res => {
        if (res.status === 1) {
          this.$message.success(`启用成功`)
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleDisabled (ids) {
      disabledUser(ids).then(res => {
        if (res.status === 1) {
          this.$message.success(`禁用成功`)
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    modifyPasswordHandler (id) {
      this.userName = id
      this.editPwdModal = true
    }
  },
  watch: {
  }
}
</script>
