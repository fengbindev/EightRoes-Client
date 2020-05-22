<template>
  <a-input-number :value="value" @change="inputHandler" @input="inputHandler"></a-input-number>
</template>

<script>
export default {
  methods: {
    inputHandler (val) {
      this.$emit('input', val)
    }
  },
  // eslint-disable-next-line vue/require-prop-types
 props: ['value', 'config'],
  created () {
  }
}
</script>

<style>

</style>
