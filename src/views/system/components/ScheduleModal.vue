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
        label="类型"
      >
        <a-input
          disabled
          v-decorator="['typeCode',{rules: [{ required: true, message: '请输入类型' }]}]"
          placeholder="类型"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="id"
      >
        <a-input
          disabled
          v-decorator="['id',{rules: [{ required: true, message: '请输入id' }]}]"
          placeholder="id"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
      >
        <a-input
          disabled
          v-decorator="['sourceName',{rules: [{ required: true, message: '请输入描述' }]}]"
          placeholder="描述"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="状态"
      >
        <a-switch v-decorator="['isUsing', { valuePropName: 'checked',rules: [{ required: true, message: '状态不能为空' }] }]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="cron表达式"
      >
        <a-input
          v-decorator="['cronExpression',{rules: [{ required: true, message: '请输入cron表达式' }]}]"
          placeholder="cron表达式"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { saveSchedule } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'ScheduleModal',
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
      this.form.resetFields()
      this.edit({})
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'typeCode', 'id', 'sourceName', 'cronExpression'))
        this.form.setFieldsValue({ 'isUsing': this.mdl.isUsing === 'Y' })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.isUsing = values.isUsing ? 'Y' : 'N'
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveSchedule(values).then(res => {
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
