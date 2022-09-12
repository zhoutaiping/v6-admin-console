<template>
  <el-card
    :body-style="{ padding: '0px'}"
    shadow="hover"
    class="mt-5"
  >
    <div
      slot="header"
      class="header-text"
    >套餐配置</div>
    <el-form
      label-position="left"
      label-width="140px"
      size="mini"
      class="infoForm"
    >
      <el-form-item
        label-width="0px"
        class="infoForm-item"
      >
        <el-form-item
          label="计费规则"
          class="infoForm-item-inline"
        >
          <span class="infoForm-input">{{ cdn_template.tp_name || ' ' }}</span>
        </el-form-item>
        <el-form-item
          label="计费周期"
          class="infoForm-item-inline"
        >
          <span class="infoForm-input">{{ cdn_template.calc_way_timeunit ==='day'? '按日计费':'其他' || ' ' }}</span>
        </el-form-item>
        <template v-if="Number(cdn_template.calc_way) === 1">
          <el-form-item
            label="国内流量"
            class="infoForm-item-inline"
          >
            <span class="infoForm-input">{{ cdn_template.free_china || ' ' }}</span>
          </el-form-item>
          <el-form-item
            label="海外流量"
            class="infoForm-item-inline"
          >
            <span class="infoForm-input">{{ cdn_template.free_foreign || ' ' }}</span>
          </el-form-item>
          <el-form-item
            label="国内流量价格"
            class="infoForm-item-inline"
          >
            <span class="infoForm-input">{{ cdn_template.fee_china || ' ' }}</span>
          </el-form-item>
          <el-form-item
            label="海外流量价格"
            class="infoForm-item-inline"
          >
            <span class="infoForm-input">{{ cdn_template.fee_foreign || ' ' }}</span>
          </el-form-item>
        </template>
        <template v-if="Number(cdn_template.calc_way) === 2">
          <el-form-item
            label="国内带宽峰值"
            class="infoForm-item-inline"
          >
            <span class="infoForm-input">{{ cdn_template.free_china_max || ' ' }}</span>
          </el-form-item>
          <el-form-item
            label="海外带宽峰值"
            class="infoForm-item-inline"
          >
            <span class="infoForm-input">{{ cdn_template.free_foreign_max || ' ' }}</span>
          </el-form-item>
          <el-form-item
            label="国内带宽峰值价格"
            class="infoForm-item-inline"
          >
            <span class="infoForm-input">{{ cdn_template.fee_china_max || ' ' }}</span>
          </el-form-item>
          <el-form-item
            label="海外带宽峰值价格"
            class="infoForm-item-inline"
          >
            <span class="infoForm-input">{{ cdn_template.fee_foreign_max || ' ' }}</span>
          </el-form-item>
        </template>
        <el-form-item
          label="http请求加速次数"
          class="infoForm-item-inline"
        >
          <span class="infoForm-input">{{ cdn_template.free_cdn_https || ' ' }}</span>
        </el-form-item>
        <el-form-item
          label="http请求加速价格"
          class="infoForm-item-inline"
        >
          <span class="infoForm-input">{{ cdn_template.fee_cdn_https || ' ' }}</span>
        </el-form-item>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  props: {
    cdn_template: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.infoForm {
  margin: 5px;
}
.infoForm-item {
  margin-bottom: 5px;
}
.infoForm-item-inline {
  margin-bottom: 5px;
  display: inline-block;
}
.infoForm-input {
  width: 200px;
  display: inline-block;
}
.mt-5 {
  margin-top: 5px;
}
</style>
