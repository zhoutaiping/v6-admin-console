<style lang="scss" scoped>
.mt-5 {
  margin-top: 5px;
}
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
    :body-style="{ padding: '5px', display: click ? 'block' : 'none' }"
    shadow="hover"
    class="mt-5"
  >
    <div
      slot="header"
      class="header-text"
    >
      {{ title }}
      <div style="float: right; padding: 3px 0">
        <el-button
          v-if="edit_btn"
          type="text"
          style="margin:0 15px;"
          icon="el-icon-edit"
          @click="edit"
        >{{ edit_text }}</el-button>
        <el-switch
          v-show="expand"
          v-model="click"
          active-text=""
          inactive-text=""
        />
      </div>
    </div>
    <slot
      v-show="click"
      name="layout"
    />
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
      default: false
    },
    expandModel: {
      type: Boolean,
      default: true
    },
    edit_btn: {
      type: Boolean,
      default: false
    },
    edit_text: {
      type: String,
      default: '编 辑'
    }
  },
  data() {
    return {
      loading: false,
      click: true
    }
  },
  watch: {
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
    edit() {
      this.$emit('edit_fun')
    }
  }
}
</script>
