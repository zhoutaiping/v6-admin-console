<template>
  <div>
    <el-card class="is-horizonta">
      <div slot="header" class="clearfix">
        <span>基础配置</span>
      </div>
      <div>
        <el-form ref="Form" :model="form" :rules="rules">
          <el-form-item prop="center_node_status">
            <el-checkbox v-model="form.center_node_status" :true-label="1" :false-label="0" /> 使用中心节点回源
          </el-form-item>
          <el-button type="primary" @click="handleSubmit()">保 存 </el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      form: {
        center_node_status: 0
      },
      rules: {
        center_node_status: []
      },
      group: 'domain_proxy_conf'
    }
  },

  methods: {

    initOption() {
      if (this.web_domain && this.web_domain.domain_proxy_conf) {
        this.form.center_node_status = this.web_domain.domain_proxy_conf.center_node_status || 0
      }
    },

    async handleSubmit() {
      await this.Submit({ domain_proxy_conf: { ...this.form }})
    }
  }
}
</script>
<style lang="scss" scoped>
.item-box {
  display: inline-block;
  width: 400px;
  margin-bottom: 5px;
}
.box-card {
  margin: 0 0 10px;
}
.input-box {
  width: 100%;
  // width: 70vh;
}
.is-horizonta {
  display: flex;
  margin-bottom: 16px;
  /deep/.el-card__header {
    flex: 0 0 180px;
    padding-right: 24px;
  }
  /deep/.el-card__body {
    flex: 1;
    overflow: hidden;
    clear: both;
    height: 100%;
  }
}
</style>
