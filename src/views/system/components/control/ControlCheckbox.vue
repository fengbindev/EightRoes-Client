<template>
  <a-checkbox-group :value="value" @change="inputHandler">
    <a-checkbox v-for="(item, index) in options" :key="index" :value="item.key">{{ item.value }}</a-checkbox>
  </a-checkbox-group>
</template>

<style scoped>

</style>

<script>
export default {
  data () {
    return {
      options: []
    }
  },
  methods: {
    inputHandler (val) {
      this.$emit('input', val)
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
