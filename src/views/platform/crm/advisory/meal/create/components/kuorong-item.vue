<style lang="scss" scoped>
.form-box {
  max-width: 560px;
  margin: 0 auto;
}
.input-box {
  width: 270px;
}
.item-box {
  margin-bottom: 5px;
  /deep/ .el-form-item__label {
    width: 250px !important;
  }
}
/deep/.ant-card-head {
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 12px;
}
/deep/.ant-card-head-title {
  padding: 8px 0;
}
/deep/ .ant-card-body {
  padding: 12px 0;
}
</style>
<template>
  <el-form
    :model="from"
    class="form-box"
    label-position="left"
  >
    <a-card
      title="已扩容配置"
      style="margin-top:12px;"
    >
      <el-form-item
        v-for="_ in kuorong_setting"
        v-show="kuorong_status"
        :key="_.key"
        :label="_.title"
        class="item-box "
      >

        <template v-if="Number(_.limit_max) > 0">
          <el-input-number
            v-model="from[_.key]"
            :min="_.min"
            :max=" Number(_.limit_max) "
            :step="_.limit_beishu"
            class="input-box  input-number"
            @change="change"
          />
        </template>
        <template v-else>
          <el-input-number
            v-model="from[_.key]"
            :min="_.min"
            :step="_.limit_beishu"
            class="input-box  input-number"
            @change="change"
          />
        </template>
        {{ _.unit }}
      </el-form-item>
    </a-card>
  </el-form>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      from: {},
      rules: {},

      kuorong_status: true
    }
  },
  computed: {
    ...mapState({
      kuorong_setting: state => state.meal.kuorong_setting,
      kuorong_key: state => state.meal.kuorong_key
    })
  },
  watch: {
    kuorong_setting: {
      deep: true,
      handler(val) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.from = {}
      this.kuorong_setting.forEach(item => {
        this.$set(this.from, item['key'], item['kuorong'] || 0)
      })
      this.kuorong_status = true
    },
    change() {
      this.$emit('change')
    },
    getForm() {
      return { ...this.from }
    },
    getParams() {
      const params = {}
      if (this.from) {
        Object.keys(this.from).forEach(i => {
          params[i] = {
            buy_num: this.from[i] || 0
          }
        })
      }
      return params
    }
  }
}
</script>
