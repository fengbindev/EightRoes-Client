<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    :maskClosable="false"
  >
    <menu-permission :type="type" :id="id" ref="permissionModel"></menu-permission>
  </a-modal>
</template>
<script>
import MenuPermission from '@/views/system/components/MenuPermission.vue'
export default {
  name: 'BranchModal',
  components: {
    MenuPermission
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    type: {
      type: [Number, String],
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
      mdl: {},
      confirmLoading: false
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    permission (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.permissionModel.getData()
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
