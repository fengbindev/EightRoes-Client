<template>
  <div>
    <a-form :form="form" class="form" v-bind="formItemLayout" labelAlign="left">
      <a-card class="card" title="账户安全配置" :bordered="false">
        <a-skeleton :loading="skeletonLoading" active>
          <a-form-item label="否启用账户安全配置">
            <a-switch v-decorator="['isOpenThreeSecurity', { valuePropName: 'checked' }]" @change="openThreeSecurityChange"/>
          </a-form-item>
        </a-skeleton>
      </a-card>
      <div v-show="security.isOpenThreeSecurity">
        <a-card class="card" title="密码规则配置" :bordered="false">
          <a-form-item label="密码最小长度">
            <a-input-number v-decorator="['passwordMinLength', { initialValue: 6 }]" :min="6" :max="50" />
          </a-form-item>
          <a-form-item label="密码最大长度">
            <a-input-number v-decorator="['passwordMaxLength', { initialValue: 30 }]" :min="6" :max="50" />
          </a-form-item>
          <a-form-item label="密码字符要求">
            <a-select v-decorator="['passwordCharacterSpecification', { initialValue: 'A' }]">
              <a-select-option value="A">无要求</a-select-option>
              <a-select-option value="B">必须同时包含字母和数字</a-select-option>
              <a-select-option value="C">必须同时包含大写字母、小写字母、数字</a-select-option>
              <a-select-option value="D">必须同时包含大、小写字母、特殊字符、数字</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="密码中不能包含的用户信息">
            <a-checkbox-group v-decorator="['notIncludeUserInfo']">
              <a-checkbox value="UserName">用户名</a-checkbox>
              <a-checkbox value="RealName">用户真实姓名</a-checkbox>
              <a-checkbox value="Email">电子邮箱</a-checkbox>
              <a-checkbox value="Mobile">手机号</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-card>
        <a-card class="card" title="密码校检配置" :bordered="false">
          <a-form-item label="一天内密码错误次数超过最大重试次数锁定账号">
            <a-switch v-decorator="['specifyOverTimeLock', { valuePropName: 'checked' }]" @change="specifyOverTimeLockChange"/>
          </a-form-item>
          <a-form-item label="密码错误最大重试次数" extra="注：登录密码最大校检次数不设置或设置为0则不进行校验">
            <a-input-number v-decorator="['maxLoginCount', { initialValue: 6 }]" :min="1" :disabled="!security.specifyOverTimeLock"/>
          </a-form-item>
          <a-form-item label="超过密码错误最大重试次数处理方式">
            <a-select v-decorator="['overLoginCountType', { initialValue: '' }]" @change="overLoginCountTypeChange">
              <a-select-option value="">不处理</a-select-option>
              <a-select-option value="A">锁定账号</a-select-option>
              <a-select-option value="B">指定时间内禁止登录</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="禁止登录时长" extra="注：账户锁定时间设置为0或为空时则不锁定，最长锁定时间为100天">
            <a-input-number v-decorator="['lockTime', { initialValue: 0 }]" :min="0" :max="100" :disabled="security.overLoginCountType!='B'"/>
          </a-form-item>
        </a-card>
        <a-card class="card" title="密码变更通知" :bordered="false">
          <a-form-item label="指定密码过期时间" extra="注：指定密码时间设置为0或空时将不过期">
            <a-input-number v-decorator="['expiration', { initialValue: 0 }]" :min="0" :disabled="!security.specifyOverTimeLock"/>
          </a-form-item>
          <a-form-item label="后台重置密码后下次登录是否强制修改密码">
            <a-switch v-decorator="['nextLoginUpdatePwd', { valuePropName: 'checked' }]" />
          </a-form-item>
        </a-card>
      </div>
    </a-form>
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <a-button type="primary" @click="save" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { getSecurity, saveSecurity } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'Security',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 }
      },
      description: '',
      skeletonLoading: false,
      loading: false,
      form: this.$form.createForm(this),
      security: {
        isOpenThreeSecurity: false,
        passwordMinLength: 6,
        passwordMaxLength: 30,
        passwordCharacterSpecification: 'A',
        notIncludeUserInfo: [],
//        isOpenRecentlyCheck: false,
//        repeatCount: 0,
        specifyOverTimeLock: false,
        maxLoginCount: 0,
        overLoginCountType: '',
        lockTime: 0,
        expiration: 0,
        nextLoginUpdatePwd: false
      }
    }
  },
  created () {
    this.skeletonLoading = true
    getSecurity().then(res => {
      this.skeletonLoading = false
      const data = res.data
      if (typeof data === 'string') {
        this.security = JSON.parse(data)
      } else {
        for (const key in this.security) {
          if (!data.hasOwnProperty(key)) {
            data[key] = this.security[key]
          }
        }
        this.security = data
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.security, 'isOpenThreeSecurity', 'passwordMinLength', 'passwordMaxLength', 'passwordCharacterSpecification', 'notIncludeUserInfo', 'specifyOverTimeLock', 'maxLoginCount', 'overLoginCountType', 'lockTime', 'expiration', 'nextLoginUpdatePwd'))
      })
    })
  },
  methods: {
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.notIncludeUserInfo) {
            values.notIncludeUserInfo = JSON.stringify(values.notIncludeUserInfo)
          }
          console.log('Received values of form: ', values)
          this.loading = true
          saveSecurity(values).then(res => {
            this.loading = false
            if (res.status === 1) {
              this.$message.success('操作成功')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    openThreeSecurityChange (ischeck) {
      this.security.isOpenThreeSecurity = ischeck
    },
    specifyOverTimeLockChange (ischeck) {
      this.security.specifyOverTimeLock = ischeck
    },
    overLoginCountTypeChange (val) {
      this.security.overLoginCountType = val
    }
  },
  watch: {
  }
}
</script>
<style>
  .header-title {
    font-size: 20px;
  }
  .card{
    margin-bottom: 24px;
  }
</style>
