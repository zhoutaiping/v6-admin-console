<style lang="scss" scoped>
.Container {
  max-width: 1200px;
  min-width: 870px;
  margin: 0 auto;
  .Container__title {
    font-size: 30px;
    letter-spacing: 3px;
    color: #ffffff;
    font-weight: 500;
    text-align: center;
  }
}
.item {
  margin-top: 30px;
  margin-bottom: 50px;
  &:not(:last-child) {
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
  .itemDesc_box {
    text-align: center;
    color: #fff;
    height: 152px;
    padding: 24px;
    .icon {
      display: inline-block;
      margin-right: 20px;
      font-size: 30px;
      width: 48px;
      height: 48px;
      vertical-align: -0.35em;
    }
    .title {
      display: inline-block;
      font-size: 20px;
      line-height: 48px;
      color: #fff;
      font-weight: 500;
      margin: 0;
      vertical-align: super;
    }
    .desc {
      display: inline-block;
      font-size: 14px;
      line-height: 24px;
      color: #fff;
      text-align: left;
      color: hsla(0,0%,100%,.9);
      margin-top: 14px;
      margin-bottom: 0;
    }

  }
}
</style>
<template>
  <div class="Container">
    <h3 :class="'Container__title'">{{ title }}</h3>
    <a-row style="margin-top: 30px;margin-bottom: 50px;">
      <a-col v-for="(item, index) in itemDesc" :key="index" :span="24/ itemDesc.length" class="item" >
        <div class="itemDesc_box">
          <div>
            <svg-icon :icon-class="item.icon" class="icon"/>
            <h3 class="title">{{ item.title }}</h3>
          </div>
          <div class="desc">
            {{ item.desc }}
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '全景技术架构',
      itemDesc: [
        { icon: 'qj_01', title: '软件定义', desc: '零信任技术架构，打破传统安全边界' },
        { icon: 'qj_02', title: '智能主动', desc: 'AI安全大脑全方位管控威胁，智能拆分调度定位攻击者' },
        { icon: 'qj_03', title: '贴合业务', desc: '定制精细化策略贴合业务特点，兼顾安全和业务性能' }
      ]
    }
  }
}
</script>
