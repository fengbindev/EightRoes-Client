<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
  >
    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="所属机构"
      >
        <a-tree-select
          v-decorator="['branchInnercode', {rules: [{ required: true, message: '请选择所属机构' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="depts"
          placeholder="请选择所属机构"
          treeDefaultExpandAll
          :disabled="method==='edit'"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="角色名称"
      >
        <a-input
          v-decorator="['roleName',{rules: [{ required: true, message: '请输入名称' }]}]"
          placeholder="起一个名字"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="角色代码"
      >
        <a-input
          :disabled="method==='edit'"
          v-decorator="['roleCode',{rules: [{ required: true, message: '请输入角色代码' }]}]"
          placeholder="角色代码"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="备注"
      >
        <a-input
          v-decorator="['memo']"
          placeholder="备注"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { getBranchList, saveRole } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'RoleModal',
  components: {
  },
  data () {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      depts: [],
      method: 'add',
      mdl: {},
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    getBranchList({ 'isSelect': 'Y' }).then(res => {
      this.depts = this.depts.concat(res.data)
    })
  },
  methods: {
    add (parentId) {
      this.method = 'add'
      this.form.resetFields()
      this.edit({})
    },
    edit (record) {
      if (record.roleCode) {
        this.method = 'edit'
      }
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'roleCode', 'roleName', 'branchInnercode', 'memo'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.method = this.method
          console.log('Received values of form: ', values)
          // this.$emit('ok')
          this.confirmLoading = true
          saveRole(values).then(res => {
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
            this.confirmLoading = false
          })
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

<style scoped>
  .ant-form-item-children .ant-input-number {
    width: 100%
  }
</style>
