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
        label="用户名"
      >
        <a-input
          :disabled="method==='edit'"
          v-decorator="['userName',{rules: [{ required: true, message: '用户名不能为空' }]}]"
          placeholder="请输入用户名"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="真实姓名"
      >
        <a-input
          v-decorator="['realName']"
          placeholder="请输入真实姓名"/>
      </a-form-item>

      <a-form-item
        v-if="method==='add'"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="密码"
      >
        <a-input
          type="password"
          v-decorator="['password',{rules: [{ required: true, message: '请输入密码', },{ validator: validateToNextPassword }]}]"
          placeholder="请输入密码"/>
      </a-form-item>

      <a-form-item
        v-if="method==='add'"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="确认密码"
      >
        <a-input
          type="password"
          v-decorator="['confirmPassword',{rules: [{ required: true, message: '请输入确认密码' },{ validator: compareToFirstPassword}]}]"
          placeholder="请输入确认密码"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="所属机构"
      >
        <a-tree-select
          v-decorator="['branchInnercode', {rules: [{ required: true, message: '请选择所属机构' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="depts"
          placeholder="所属机构"
          treeDefaultExpandAll
          @change="branchChangeHandler"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="所属角色">
        <a-select
          v-decorator="['roles',{rules: [{ required: true, message: '请选择角色' }]}]"
          mode="multiple"
          placeholder="请选择角色"
        >
          <a-select-option v-for="role in roleOptions" :key="role.roleCode">{{
            role.roleName
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="邮箱"
      >
        <a-input
          v-decorator="['email',{rules: [{ type: 'email', message: '邮箱格式不正确' }]}]"
          placeholder="请输入邮箱"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="手机号码"
      >
        <a-input
          v-decorator="['mobile']"
          placeholder="请输入联系电话"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { getBranchList, getRoleListByBranch, saveUser, initpwdcheck } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'UserModal',
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
      roleOptions: [],
      method: 'add',
      mdl: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      passwordVeriry: {}
    }
  },
  beforeCreate () {
  },
  created () {
    getBranchList({ 'isSelect': 'Y' }).then(res => {
      this.depts = this.depts.concat(res.data)
    })
    initpwdcheck().then(res => {
      this.passwordVeriry = { maxLen: res.data.maxLen, minLen: res.data.minLen }
    })
  },
  methods: {
    add (parentId) {
      this.method = 'add'
      this.form.resetFields()
      this.edit({})
    },
    edit (record) {
      if (record.userName) {
        this.method = 'edit'
      }
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'userName', 'realName', 'branchInnercode', 'email', 'mobile'))
        const roles = this.mdl.roles ? this.mdl.roles.map(data => data.roleCode) : []
        this.form.setFieldsValue({ 'roles': roles || [] })
        // this.form.setFieldsValue({ ...record })
      })
    },
    // 机构选择树change事件
    branchChangeHandler (value, label, extra) {
      // 根据机构编码获取角色
      const params = { 'branchInnercode': value }
      getRoleListByBranch(params).then(res => {
        this.roleOptions = res.data
        this.form.setFieldsValue({ 'roles': [] })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.method = this.method
          if (values.roles) {
            values.roles = values.roles.join()
          }
          console.log('Received values of form: ', values)
          // this.$emit('ok')
          this.confirmLoading = true
          saveUser(values).then(res => {
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
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form
      if (value) {
        if (value.length < this.passwordVeriry.minLen || value.length > this.passwordVeriry.maxLen) {
          // eslint-disable-next-line standard/no-callback-literal
          callback(`必须是${this.passwordVeriry.minLen}-${this.passwordVeriry.maxLen}位的字符`)
        } else {
          form.validateFields(['confirmPassword'], { force: true })
        }
      }
      callback()
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        // eslint-disable-next-line standard/no-callback-literal
        callback('您输入的两个密码不一致!')
      } else {
        callback()
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped>
  .ant-form-item-children .ant-input-number {
    width: 100%
  }
</style>
