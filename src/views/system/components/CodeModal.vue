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
        label="代码类别"
      >
        <a-input
          :disabled="method=='edit'"
          v-decorator="['codeType',{rules: [{ required: true, message: '请输入代码类别' }]}]"
          placeholder="代码类别"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="代码名称"
      >
        <a-input
          v-decorator="['codeName',{rules: [{ required: true, message: '请输入代码名称' }]}]"
          placeholder="代码名称"/>
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
import { saveCode } from '@/api/system'
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
      form: this.$form.createForm(this),
      oldCodeType: ''
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    add () {
      this.method = 'add'
      this.form.resetFields()
      this.edit({})
    },
    edit (record) {
      if (record.codeType) {
        this.oldCodeType = record.codeType
        this.method = 'edit'
      }
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'codeType', 'codeName', 'memo'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.method = this.method
          values.oldCodeType = this.oldCodeType
          console.log('Received values of form: ', values)
          // this.$emit('ok')
          this.confirmLoading = true
          saveCode(values).then(res => {
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
