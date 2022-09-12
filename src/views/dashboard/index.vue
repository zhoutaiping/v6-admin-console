<style lang="scss" scoped>
.ItemNumber {
  position: relative;
  height: 100%;
  padding: 12px;
  text-align: left;
  display: flex;
  overflow: hidden;
  justify-content: center;
  flex-direction: column;
  background: #fff;
  -webkit-box-shadow: 4px 4px 40px rgba(0,0,0,.05);
  box-shadow: 4px 4px 40px rgba(0,0,0,.05);
  border-color: rgba(0,0,0,.05);
}
.ItemNumber__num{
    font-weight: 500;
    font-size: 36px;
    line-height: 36px;
}
.ItemNumber__title {
    margin: 0;
    margin-top: 8px;
    color: #606266;
    font-size: 14px;
    font-weight: 600;
    line-height: 15px;
}
.clearfix {
  height: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 32px;
}
</style>
<template>
  <div style="padding:12px;">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user_info" />
        </el-col>
        <el-col :span="12" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              统计
            </div>
            <el-row :gutter="12">
              <el-col :span="12" :xs="24">
                <ItemNumber v-loading="ringloading" :value="product_list.length || 0" title="产品数量"/>
              </el-col>
              <el-col :span="12" :xs="24" >
                <ItemNumber v-loading="ringloading" :value="meal_list.length || 0" title="套餐数量"/>
              </el-col>
            </el-row>
            <el-row style="background:#fff;padding: 0;margin:32px 0;">
              <RingChart id="ring-meal" ref="ringChart" :data="RingChartData" :loading="ringloading" height="400px"/>
              <BarChart id="role-sale" ref="barChart" :data="barChartData" :loading="barloading" height="400px"/>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6" :xs="24">
          <MenuCard/>
        </el-col>
      </el-row>
    </div>
    <div v-else class="wscn-http404-container">
      <div class="wscn-http404">
        <div class="pic-404">
          <img :src="detail" class="pic-404__parent" alt="404">
          <img :src="img_404_cloud" class="pic-404__child left" alt="404">
          <img :src="img_404_cloud" class="pic-404__child mid" alt="404">
          <img :src="img_404_cloud" class="pic-404__child right" alt="404">
        </div>
        <div class="bullshit">
          <div class="bullshit__info">版权所有
            <a :href="yundun_url" class="link-type" target="_blank">上海云盾</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import detail from '@/assets/images/detail.png'
import img_404_cloud from '@/assets/404_images/404_cloud.png'
import UserCard from './components/UserCard'
import ItemNumber from './components/ItemNumber'
import MenuCard from './components/MenuCard'
import RingChart from './components/RingChart'
import BarChart from './components/BarChart'
export default {
  name: 'DashboardIndex',
  components: { UserCard, ItemNumber, MenuCard, RingChart, BarChart },
  data() {
    return {
      user_info: {},
      detail,
      img_404_cloud,
      yundun_url: 'http://yundun.com',

      ringloading: false,
      RingChartData: [],
      barloading: false,
      barChartData: []
    }
  },
  computed: {
    ...mapState({
      product_list: state => state.finance.product_list,
      meal_list: state => state.finance.meal_list,
      conf: state => state.finance.conf
    }),
    ...mapGetters([
      'user'
    ])
  },
  async created() {
    this.user_info = Object.assign({}, this.user)
    this.init()
  },
  methods: {
    ...mapActions({
      getProduct: 'getProduct',
      getMeal: 'getMeal',
      getbasicconf: 'getbasicconf'
    }),
    async init() {
      await Promise.all([await this.getProduct(), await this.getMeal(), await this.getbasicconf()])
      await Promise.all([await this.initChart()])
    },
    async initChart() {
      if (this.product_list.length || this.meal_list.lenght) await this.ringChart()
      if (this.conf.role_list.length) await this.barChart()
    },
    barChart() {
      this.barloading = true
      this.conf.role_list.forEach(i => {
        this.barChartData.push({
          label: i.role_name,
          value: this.conf.user_list.filter(_ => _.role_id === i.id).length
        })
      })
      setTimeout(() => {
        this.barloading = false
        if (this.$refs.barChart) this.$refs.barChart.init()
      }, 500)
    },
    ringChart() {
      this.ringloading = true
      this.product_list.forEach(i => {
        this.RingChartData.push({
          type: i.product_name,
          value: this.meal_list.filter(k => k.product_flag === i.product_flag).length || 0
        })
      })
      setTimeout(() => {
        if (this.$refs.ringChart) this.$refs.ringChart.init()
        this.ringloading = false
      }, 500)
    }

  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.wscn-http404 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;
    &__parent {
      width: 100%;
    }
    &__child {
      position: absolute;
      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }
      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      margin-top: 235px;
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
