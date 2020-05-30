<template>
  <a-modal
    :title="modalTitle"
    style="top: 20px;"
    :width="800"
    :visible="isShow"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="isShow = false"
  >
    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户名"
      >
        <a-input
          :readOnly="true"
          v-decorator="['userName',{rules: [{ required: true, message: '请输入用户名' }]}]"
        />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="原密码"
      >
        <a-input
          type="password"
          v-decorator="['oldPassword',{rules: [{ required: true, message: '请输入原密码' }]}]"
        />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="密码"
      >
        <a-input
          type="password"
          v-decorator="['password',{rules: [{ required: true, message: '请输入密码', },{ validator: validateToNextPassword }]}]"
        />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="确认密码"
      >
        <a-input
          type="password"
          v-decorator="['confirmPassword',{rules: [{ required: true, message: '请输入确认密码' },{ validator: compareToFirstPassword}]}]"
        />
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { initpwdcheck, changeloginpassword } from '@/api/system'
import { encrypt } from '@/utils/rsaEncrypt'
export default {
  name: 'LoginEditPwdModal',
  // eslint-disable-next-line
  props: { editPwdModal: Boolean, modalTitle: String, userName: String },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      mdl: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      passwordVeriry: {}
    }
  },
  computed: {
    isShow: {
      get () {
        return this.editPwdModal
      },
      set (val) {
        this.$emit('update:edit-pwd-modal', val)
      }
    }
  },
  created () {
    this.$nextTick(() => {
       this.form.setFieldsValue({ 'userName': this.userName })
    })
  },
  beforeCreate () {
    initpwdcheck().then(res => {
      this.passwordVeriry = { maxLen: res.data.maxLen, minLen: res.data.minLen }
    })
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        values.oldPassword = encrypt(values.oldPassword)
        values.password = encrypt(values.password)
        values.confirmPassword = encrypt(values.confirmPassword)
        if (!err) {
          this.confirmLoading = true
          changeloginpassword(values).then(res => {
            if (res.status === 1) {
              this.$message.success('操作成功，请使用新密码登录')
              this.isShow = false
            } else {
              this.$message.error(res.message)
            }
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
