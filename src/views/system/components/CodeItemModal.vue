<template>
  <a-modal
    title="操作"
    :width="600"
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
          :disabled="true"
          v-decorator="['codeType',{rules: [{ required: true, message: '请输入代码类别' }]}]"
          placeholder="代码类别"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="代码值"
      >
        <a-input
          v-decorator="['codeValue',{rules: [{ required: true, message: '请输入代码值' }]}]"
          placeholder="代码值"/>
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
import { saveCodeItem } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'CodeItemModel',
  components: {
  },
  props: {
    codeType: {
      type: String,
      required: true
    }
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
      oldCodeValue: ''
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
      if (record.codeValue) {
        this.method = 'edit'
        this.oldCodeValue = record.codeValue
      }
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'codeValue', 'codeName', 'memo'))
        this.form.setFieldsValue({ 'codeType': this.codeType })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.method = this.method
          values.oldCodeValue = this.oldCodeValue
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveCodeItem(values).then(res => {
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
