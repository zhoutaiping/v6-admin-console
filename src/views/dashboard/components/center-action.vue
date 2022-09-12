<style lang="scss" scoped>
.section-item {
  max-width: 1200px;
  min-width: 870px;
  height: 578px;
  margin: 0 auto 50px;
  background-color:rgb(255, 255, 255);
  box-shadow: 0 4px 32px 0 rgba(10,14,29,.02), 0 8px 64px 0 rgba(10,14,29,.08);
}
.section-icon {
  width: 100%;
  height: 50%;
  overflow: hidden;
  .baner {
    width: 100%;
    height: 100%;
  }
  .title {
    position: absolute;
    color: #333;
    font-size: 42px;
    margin: 100px 0 0 40px;
  }
  .title_desc {
    position: absolute;
    color: #666;
    font-size: 18px;
    margin: 175px 0 0 40px;
  }
  .baner_action {
    position: relative;
    height: 100%;
  }
  .action1 {
    margin: -26% 0 0 42%;
  }
  .action2 {
    margin: -26% 0 0 55%;
  }
}
.section-itemDesc {
  width: 100%;
  height: 50%;
  padding: 32px 40px 40px;
  .title {
    font-size: 25px;
    font-weight: 500;
    line-height: 44px;
    margin: 0 0 32px;
  }
  .desc {
    color: #525666;
    margin-bottom: 24px;
    font-size: 17px;
    font-weight: 300;
    line-height: 28px;
  }
  .foot {
    font-size: 17px;
    font-weight: 300;
    line-height: 28px;
  }
}
</style>

<template>
  <div>
    <div v-for="(item, index) in items" :key="index" class="section-item" >
      <div class="section-icon">
        <span class="title">{{ item.banner_title }}</span>
        <span class="title_desc">{{ item.banner_desc }}</span>
        <img :src="item.banner+'?/'+index" :alt="'banner'+index" class="baner">
        <img :src="item.banner_action+'?/'+index" :alt="'banner_action'+index" :class="['baner_action',item.action_class]">
      </div>
      <div class="section-itemDesc">
        <h1 class="title"> {{ item.title }}</h1>
        <p class="desc">
          <font style="vertical-align: inherit;">
            {{ item.desc }}
          </font>
        </p>
        <div class="foot">
          {{ item.time }}
          <i class="el-icon-date color--primary"/>
          <router-link to="/dashboard">
            <span v-show="user.id" class="color--primary" style="float:right; cursor: pointer;">立即体验 >>></span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import action1 from '@/assets/images/action-1.png'
import action2 from '@/assets/images/action-1-2.png'
import action3 from '@/assets/images/action-1-3.png'
export default {
  data() {
    return {
      items: [
        {
          'banner_title': '一站式应用安全产品链',
          'banner_desc': '提供一站式性能优化、WAF和天生的基础DDoS保护服务',
          'banner': action1,
          'banner_action': action2,
          'action_class': 'action1',
          'title': '应用安全产品链',
          'desc': 'DNS解析、扫描观测 (Scan+)、性能优化（Reliability）、Web应用防火墙（AppWall）、WAF SDK（Client & Mobile）',
          'time': '2020-01-05'
        },
        {
          'banner_title': '全场景抗DDoS产品链',
          'banner_desc': '适用于持续性、大规模DDoS治理的高级服务',
          'banner': action1,
          'banner_action': action3,
          'action_class': 'action2',
          'title': '抗DDoS产品链',
          'desc': '全高防 DNS（AntiDDoS DNS）、攻击监测（DDoS Monitoring）、高防 IP（AntiDDoS IP）、AntiDDoS SDK（Client&Mobile SDK）、清洗系统（AntiDDoS System & Hardware）',
          'time': '2020-01-05'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }
}
</script>
