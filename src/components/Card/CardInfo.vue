<style lang="scss" scoped>
@import "./form.scss";
</style>
<style lang="scss" >
  .el-card__header {
    padding: 10px;
    font-size: 16px;
    font-weight: 500;
  }
</style>
<template>
  <el-card
    v-loading="loading"
    v-if="data.length"
    :body-style="{ padding: '0px' }"
    shadow="hover"
    class="mt-5"
  >
    <div slot="header" class="header-text">
      <span>{{ title }}
        <el-switch
          v-show="expand"
          v-model="click"
          active-text=""
          inactive-text=""
          style="float: right; padding: 3px 0"
          @change="handleItemOp"
        />
      </span>
    </div>
    <div v-show="click">
      <el-form
        :model="form"
        label-position="left"
        label-width="140px"
        size="mini"
        class="infoForm"
      >
        <el-form-item label-width="0px" class="infoForm-item">
          <el-form-item
            v-for="(item, index) in data"
            :key="index"
            :label="item.title"
            class="infoForm-item-inline"
          >
            <span
              class="infoForm-input"
            >{{ item.value + "&nbsp;&nbsp;" }} {{ item.unit }}</span
            >
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script>
export default {
  components: {},
  props: {
    title: {
      type: String, default: ''
    },
    expand: {
      type: Boolean,
      default: true
    },
    expandModel: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array, default: () => [
        { title: '暂无数据', value: '', unit: '' }
      ]
    }
  },
  data() {
    return {
      loading: false,
      click: true,
      form: {}
    }
  },
  watch: {
    data(val) {
      this.init()
    },
    expandModel(val) {
      this.click = val
    }
  },
  methods: {
    async init() {
      this.loading = true
      this.click = this.expandModel
      setTimeout(() => { this.loading = false }, 1000)
    },
    handleItemOp(val) {
      // console.log('switch--value', val)
    }
  }
}
</script>
