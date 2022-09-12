<template>
  <span>
    <el-autocomplete
      v-model="username"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入"
      @select="handleSelect"
    >
      <yd-form-select slot="prepend" :selects="TYPE" v-model="type" style="width: 80px"/>
    </el-autocomplete>
  </span>
</template>

<script>
export default {
  props: {
    value: String
  },

  data() {
    return {
      type: 1,
      username: '',
      list: [],
      val: '',
      TYPE: [
        {
          label: '邮箱',
          value: 1
        },
        {
          label: '手机',
          value: 2
        }
      ]
    }
  },

  methods: {
    async querySearchAsync(queryString, cb) {
      const username = this.username
      if (!username) {
        cb([])
        return
      }
      const { list = {}} = await this.InvokeAllApi.get('/V4/Account.Member.like', {
        type: this.type,
        username
      })

      const nList = []
      Object.keys(list).forEach(label => {
        nList.push({
          value: label
        })
      })

      this.list = list
      cb(nList)
    },

    handleSelect({ value }) {
      this.$emit('input', this.list[value])
      this.$emit('change', this.list[value])
    }
  }
}
</script>
