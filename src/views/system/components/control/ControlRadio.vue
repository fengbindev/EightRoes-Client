<template>
  <div>
    <a-radio-group :value="value" @change="inputHandler">
      <a-radio v-for="(item, index) in options" :key="index" :value="item.key">{{ item.value }}</a-radio>
    </a-radio-group>
  </div>
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
