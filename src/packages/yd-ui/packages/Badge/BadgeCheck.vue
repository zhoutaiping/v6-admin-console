<template>
  <yd-badge :status="STATUS_COLOR[status]" :text="STATUS_MAP[status]" class="yd-badge-check">
    <slot/>
    <el-popover ref="failTip" placement="top" trigger="hover">
      <div class="fail-tip">
        该网站不符合云加速产品接入标准，请咨询<a @click="openQQ">技术支持</a>接入<a href="/taichiddosWeb" target="_blank">太极抗D</a>类产品。
      </div>
    </el-popover>
    <i v-popover:failTip v-if="status === 3 || status === 5" class="yun-icon yun-unappoint cursor-pointer"/>
    <p v-if="status === 0"><a class="no-records cursor-pointer">(待设置源站)</a></p>
  </yd-badge>
</template>

<script>
/*
+-----------------------------------------------------------------------------------------------------------------------
| Yundun
+-----------------------------------------------------------------------------------------------------------------------
| yd-badge-check
| 审核状态封装
*/

const NAME = 'yd-badge-check'

const STATUS_COLOR = [
  'default',
  'warning',
  'success',
  'error',
  'success',
  'error',
  'error',
  'warning'
]

const STATUS_MAP = [
  '待认证',
  '审核中',
  '审核通过',
  '审核不通过',
  '审核通过',
  '审核不通过',
  '禁用',
  '回源'
]
export default {
  name: NAME,

  props: {
    status: [Number, String]
  },

  data() {
    return {
      STATUS_COLOR,
      STATUS_MAP
    }
  },

  methods: {
    openQQ() {
      window.open('http://q.url.cn/ABTEj1?_type=wpa&qidian=true', '_blank')
    }
  }
}
</script>

<style lang="postcss" scoped>
.yd-badge-check {
  .yun-icon {
    margin-left: 6px;
  }
}
</style>
