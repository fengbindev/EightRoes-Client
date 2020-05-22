<template>
  <a-select :value="value" placeholder="请选择" @change="inputHandler" style="width:260px;">
    <a-option
      v-for="(item, index) in options"
      :key="index"
      :label="item.value"
      :value="item.key">
    </a-option>
  </a-select>
</template>

<script>
export default {
  data () {
    return {
      options: []
    }
  },
  methods: {
    inputHandler (e) {
      const { value } = e.target
      this.$emit('input', value)
    },
    async updateOptions (config) {
      if (config.options && config.options.length) {
        this.options = JSON.parse(JSON.stringify(config.options))
      }
    }
  },
  watch: {
    config (val) {
      this.updateOptions(val)
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'config'],
  created () {
    this.updateOptions(this.config)
  }
}
</script>

<style>

</style>
