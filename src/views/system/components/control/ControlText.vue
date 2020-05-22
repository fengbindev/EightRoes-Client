<template>
  <a-input :value="value" @change="inputHandler" :maxLength="max"></a-input>
</template>

<script>
export default {
  computed: {
    max () {
      if (this.config.dataType === 'ShortText') {
        return 200
      }
      if (this.config.dataType === 'LargeText') {
        return 400
      }
      return null
    }
  },
  methods: {
    inputHandler (e) {
      const { value } = e.target
      this.$emit('input', value)
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'config']
}
</script>

<style>

</style>
