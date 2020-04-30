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
      <a-form-item style="display:none">
        <a-input v-decorator="['branchInnercode']"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="上级机构"
      >
        <a-tree-select
          v-decorator="['parentInnercode', {rules: [{ required: true, message: '请选择上级机构' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="depts"
          placeholder="上级机构"
          treeDefaultExpandAll
          @change="branchChangeHandler"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="显示顺序"
      >
        <a-input-number
          v-decorator="['orderFlag',{rules: [{ required: true, message: '请输入显示顺序' }, {type: 'integer', message: '请输入整数'}]}]"
          placeholder="显示顺序"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="名称"
      >
        <a-input
          v-decorator="['name',{rules: [{ required: true, message: '请输入名称' }]}]"
          placeholder="起一个名字"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="编号"
      >
        <a-input
          v-decorator="['branchCode',{rules: [{ required: true, message: '请输入名称' }]}]"
          placeholder="编号"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="机构主管">
        <a-select
          v-decorator="['manager']"
          mode="multiple"
          placeholder="请选择"
        >
          <a-select-option v-for="user in userOptions" :key="user.userName">{{
            user.userName
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="电话"
      >
        <a-input
          v-decorator="['phone']"
          placeholder="电话"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="传真"
      >
        <a-input
          v-decorator="['fax']"
          placeholder="传真"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { getBranchList, saveBranch, getBranchUserList } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'BranchModal',
  components: {
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
      depts: [],
      userOptions: [],
      selectManager: [],
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
    getBranchUserList().then(res => {
      this.userOptions = res.data
    })
  },
  methods: {
    add (parentId) {
      this.form.resetFields()
      this.edit({ parentId: parentId || 0, orderFlag: 0 })
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'branchInnercode', 'parentInnercode', 'branchCode', 'phone', 'name', 'orderFlag', 'fax'))
        this.form.setFieldsValue({ 'orderFlag': parseInt(this.mdl.orderFlag) })
        this.form.setFieldsValue({ 'manager': this.mdl.manager ? this.mdl.manager.split(',') : [] })
        // this.form.setFieldsValue({ ...record })
      })
    },
    // 机构选择树change事件
    branchChangeHandler (value, label, extra) {
      // 根据机构编码获取角色
      const params = { 'branchInnercode': value }
      getBranchUserList(params).then(res => {
        this.userOptions = res.data
        this.form.setFieldsValue({ 'manager': [] })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (values.manager) {
            values.manager = values.manager.join()
          }
          this.confirmLoading = true
          saveBranch(values).then(res => {
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
  }
}
</script>

<style scoped>
  .ant-form-item-children .ant-input-number {
    width: 100%
  }
</style>
