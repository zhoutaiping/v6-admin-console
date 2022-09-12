<style lang="scss" scoped>
.footer-end {
  width: 100%;
  height: 70px;
  text-align: center;
  color: #fff;
  padding: 8px;
  border-top: 1px solid rgba(229,235,255,.08);
  .logo-full {
    width: 100px;
    margin-bottom: 5px;
  }
  a {
    text-decoration: none;
    color: #fff;
  }
}
</style>

<template>
  <div class="footer-end">
    <img :src="logoFull" alt="avatar_logoFull" class="logo-full"><br>
    Copyright @{{ year }} YUNDUN,All Rights Reserved 上海云盾信息技术有限公司版权所有 沪ICP备11032572号
    <a href="http://beian.miit.gov.cn/" target="_blank">沪公网安备</a> 31011202001043号 上海工商
  </div>
</template>

<script>
import logoFull from '@/assets/images/logo-full.svg'
export default {
  data() {
    return {
      logoFull
    }
  },
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
