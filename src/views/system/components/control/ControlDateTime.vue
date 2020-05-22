<template>
  <a-date-picker :value="value ? moment(value) : null" @change="startDateChange" show-time></a-date-picker>
</template>

<style scoped>

</style>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      moment
    }
  },
  methods: {
    startDateChange (date, dateString) {
      this.$emit('input', dateString)
    }
  },
  watch: {
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'config'],
  created () {
  }
}
</script>
