<template>
  <div>
    <el-autocomplete
      v-model="value"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入"
      @select="handleSelect"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },

  data() {
    return {
      list: [],
      val: ''
    }
  },

  methods: {
    async querySearchAsync(queryString, cb) {
      const list = await this.InvokeAllApi.get('/fd/V4/bandwidth.const.list', {
        ip: this.value,
        get_type: 'server_ip'
      })

      const nList = list.map(_ => {
        return {
          value: _
        }
      })
      cb(nList)
    },

    handleSelect({ value }) {
      this.$emit('input', value)
    }
  }
}
</script>
