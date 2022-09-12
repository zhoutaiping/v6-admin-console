<template>
  <div class="page">
    <div class="steps">
      <div
        v-for="(item,index) in process"
        :key="index"
        :class="{active:(active || 1) == (index+1)}"
        class="step step_r"
      >
        <div style="position:absolute;right:-42px;height:50px;width:50px;overflow:hidden;">
          <div class="rotateBox" />
        </div>
        <div class="step_b">
          <div class="num">{{ index + 1 }}</div>
          <div class="info">
            <p class="up">{{ item.title }}</p>
            <p class="down">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Step',
  components: {},
  data() {
    return {
      active: 1,
      process: [
        {
          title: 132123,
          desc: '23232'
        },
        {
          title: 312312,
          desc: '23232'
        },
        {
          title: 11,
          desc: '23232'
        },
        {
          title: 31312,
          desc: '23232'
        }
      ]
    }
  }
}
</script>

<style lang='scss' scoped>
.page {
  width: 100%;
  .title {
    width: 105px;
    height: 37px;
    font-size: 26px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #333333;
    line-height: 37px;
    padding: 34px 0;
  }
  .steps {
    width: 100%;
    display: flex;
    margin-top: 17px;
    zoom: 1;
  }
  .steps::after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    font-size: 0;
    height: 0;
    line-height: 0;
  }
  .step {
    flex: 1;
    width: 320px;
    height: 50px;
    background: #e4f0fd;
    position: relative;
    .step_b {
      width: 230px;
      margin: 0px auto 0px 40px;
      display: flex;
      .num {
        width: 20px;
        height: 50px;
        font-size: 32px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #666666;
        line-height: 50px;
        margin-right: 20px;
      }
      .info {
        height: 37px;
        margin-top: 5px;
        p {
          margin-bottom: 5px;
        }
        .up {
          width: 84px;
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
        }
        .down {
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #888888;
          line-height: 17px;
        }
      }
    }
  }
  //旋转的小方形盒子
  .rotateBox {
    content: "";
    border: 10px solid #fff;
    border-bottom: none;
    border-left: none;
    background-color: #e4f0fd;
    height: 44px;
    width: 44px;
    position: absolute;
    display: block;
    top: 3px;
    right: 15px;
    z-index: 10;
    transform: rotate(45deg);
  }
  .step_l {
    margin-right: 0;
  }
  .active {
    background: #75b0df !important;
    .num {
      color: #ffffff !important;
    }
    .up {
      color: #ffffff !important;
    }
    .down {
      color: #0e58af !important;
    }
  }
  //被**的步骤条的样式
  .active .rotateBox {
    background-color: #75b0df;
    content: "";
    border: 10px solid #fff;
    border-bottom: none;
    border-left: none;
    height: 44px;
    width: 44px;
    position: absolute;
    display: block;
    top: 3px;
    right: 15px;
    z-index: 10;
    transform: rotate(45deg);
  }
  //最后一步取消向右箭头
  .step:last-child .rotateBox {
    content: "";
    border: none;
    height: 0;
    width: 0;
    z-index: 11;
  }
}
</style>
