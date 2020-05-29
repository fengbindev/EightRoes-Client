<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="loginErrorMessage" />
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入帐户  "
          v-decorator="[
            'userName',
            {rules: [{ required: true, message: '请输入帐户名' }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>
      <a-row :gutter="16" v-if="showVerifyCode">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input size="large" type="text" placeholder="验证码" v-decorator="['verifyCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]" ref="authCodeRef">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <img class="getCaptcha" :src="authCodeURL" @click="refreshAuthCode" height="28">
        </a-col>
      </a-row>
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
    </a-form>
    <div v-if="editPwdModal" >
      <edit-pwd-modal :edit-pwd-modal.sync="editPwdModal" :modal-title="modalTitle" :user-name="userName"></edit-pwd-modal>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { axios } from '@/utils/request'
import UserLoginEditPwdModal from '@/views/user/components/UserLoginEditPwdModal'

export default {
  components: {
    'edit-pwd-modal': UserLoginEditPwdModal
  },
  data () {
    return {
      userName: '',
      loginBtn: false,
      isLoginError: false,
      loginErrorMessage: '',
      form: this.$form.createForm(this),
      showVerifyCode: false,
      authCodeURL: axios.defaults.baseURL + 'authCode.png',
      editPwdModal: false, // 修改密码dialog显示状态
      modalTitle: '', // 修改密码弹窗的标题
      state: {
        time: 60,
        loginBtn: false
      }
    }
  },
  created () {
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    refreshAuthCode () {
      const url = this.authCodeURL.includes('?')
        ? this.authCodeURL.split('?')[0]
        : this.authCodeURL
      this.authCodeURL = `${url}?${new Date().getTime()}`
      this.form.setFieldsValue({ 'verifyCode': '' })
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['userName', 'password', 'verifyCode']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.userName
          loginParams['userName'] = values.userName
          loginParams.password = md5(values.password)
          if (this.showVerifyCode) {
            if (!loginParams.verifyCode) {
              this.$notification['info']({
                message: '提示',
                description: '请输入验证码',
                duration: 4
              })
              state.loginBtn = false
              this.$refs.authCodeRef.focus()
              return
            }
            loginParams.showVerifyCode = true
          }
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      this.userName = this.form.getFieldValue('userName')
      this.isLoginError = false
      if (res.status === 1) {
        this.$router.push({ path: '/' })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
      } else if (res.status === 20000) {
        this.modalTitle = '重置密码信息'
        this.editPwdModal = true // 重置密码信息
      } else if (res.status === 30000) {
        this.modalTitle = '初始密码信息'
        this.editPwdModal = true // 初始密码信息
      } else {
        this.showVerifyCode = true
        this.isLoginError = true
        this.loginErrorMessage = res.message
        this.$notification['error']({
          message: '错误',
          description: res.message,
          duration: 4
        })
      }
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 80px;
    height: 28px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
