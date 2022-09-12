<style lang="scss" scoped>
.dashboard-center {
  position: relative;
  background-color:rgb(255, 255, 255);
}
.banner-box {
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
  background-image: linear-gradient(-45deg,#2179dd,#00289c);
  .Container {
    width: 100%;
    height: 65vh;
    position: absolute;
    bottom: 0;
    overflow: hidden;
  }
  .Container-left{
    position: relative;
    width: 0;
    height: 0;
    border-bottom: 10000px solid rgb(255, 255, 255);
    border-right: 19000px solid transparent;
  }
  .Container-rigth {
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    right: 0;
    border-bottom: 10000px solid rgb(255, 255, 255);
    border-left: 19000px solid transparent;
  }
}

.section {
  position: absolute;
  width: 100%;
  top: 150px;
  // left: 50%;
  // transform: translate(-50%,0%);
}

</style>

<template>
  <div class="dashboard-center">
    <div class="banner-box">
      <div class="Container">
        <div class="Container-left" />
        <div class="Container-rigth" />
      </div>
    </div>

    <div class="section">
      <CenterSection/>
      <CenterAction/>
      <Foot/>
    </div>
  </div>
</template>

<script>
import CenterAction from './center-action'
import CenterSection from './center-section'
import Foot from './foot'
export default {
  components: { CenterAction, CenterSection, Foot },
  data() {
    return {

      itemDesc: [
        { icon: 'qj_01', title: '软件定义', desc: '零信任技术架构，打破传统安全边界' },
        { icon: 'qj_02', title: '智能主动', desc: 'AI安全大脑全方位管控威胁，智能拆分调度定位攻击者' },
        { icon: 'qj_03', title: '贴合业务', desc: '定制精细化策略贴合业务特点，兼顾安全和业务性能' }
      ]
    }
  },
  methods: {}
}
</script>
