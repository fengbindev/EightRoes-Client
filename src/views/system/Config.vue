<template>
  <div>
    <a-card :bordered="false">
      <a-row class="form-row">
        <a-col :span="18" :gutter="16">
          <a-form-model ref="configValidate" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
            <div v-for="config in configs" :key="config.id" class="config-group-wrap">
              <h1 class="header-title">{{ config.name }}</h1>
              <div v-for="item in config.configs" :key="item.id" style="margin-left: 20px;">
                <a-form-model-item label="系统管理员用户名：">
                  <component :is="controlType(item)" v-model="item.value" :config="item"></component>
                </a-form-model-item>
              </div>
            </div>
          </a-form-model>
        </a-col>
        <a-col :span="6">
          <a-anchor>
            <a-anchor-link href="#components-anchor-demo-basic" title="基础插件" />
            <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
            <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
            <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
            <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
            <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
          </a-anchor>
        </a-col>
      </a-row>
    </a-card>
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <a-button type="primary" @click="saveConfig" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import ControlText from './components/control/ControlText.vue'
import ControlTextArea from './components/control/ControlTextArea.vue'
import ControlPassword from './components/control/ControlPassword.vue'
import ControlSelect from './components/control/ControlSelect.vue'
import ControlCheckbox from './components/control/ControlCheckbox.vue'
import ControlRadio from './components/control/ControlRadio.vue'
import ControlNumber from './components/control/ControlNumber.vue'
import ControlDate from './components/control/ControlDate.vue'
import ControlDateTime from './components/control/ControlDateTime.vue'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
export default {
  name: 'Config',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    'control-text': ControlText,
    'control-text-area': ControlTextArea,
    'control-select': ControlSelect,
    'control-password': ControlPassword,
    'control-checkbox': ControlCheckbox,
    'control-radio': ControlRadio,
    'control-number': ControlNumber,
    'control-date': ControlDate,
    'control-date-time': ControlDateTime
  },
  data () {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      description: '',
      loading: false,
      configs: [
        {
            'configs': [
                {
                    'dataType': 'Long',
                    'controlType': 'DateTime',
                    'name': '系统管理员的用户名',
                    'id': 'Platform.AdminUserName',
                    'value': '',
                    options: [
                              { key: 'zvingclassic', value: '经典蓝色' },
                              { key: 'zvinggreen', value: '清新绿色' },
                              { key: 'zvingdeep', value: '雅致深色' },
                              { key: 'zvingred', value: '庄重红色' },
                              { key: 'zvingpurple', value: '优雅紫色' },
                              { key: 'zvingflat', value: '明快扁平' }
                            ]
                }
            ],
            'name': '基础平台',
            'id': 'com.ssrs.platform.PlatformPlugin'
        }
    ]
    }
  },
  created () {
  },
  methods: {
    saveConfig () {
      console.log(this.configs)
    },
    controlType (item) {
      if (item.controlType === 'Text' && item.dataType === 'Long') {
        return 'control-number'
      }
      switch (item.controlType) {
        case 'Password':
          return 'control-password'
        case 'Radio':
          return 'control-radio'
        case 'Select':
          return 'control-select'
        case 'MultipleSelector':
          return 'control-multiple-select'
        case 'Text':
          return 'control-text'
        case 'TextArea':
          return 'control-text-area'
        case 'Checkbox':
          return 'control-checkbox'
        case 'Date':
          return 'control-date'
          case 'DateTime':
          return 'control-date-time'
        default:
          return ''
      }
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
</style>
