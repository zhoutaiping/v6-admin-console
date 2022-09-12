<template>
  <div>
    <DmAlert>
      <p>
        1、只要边缘节点有变化（重新调度/新增/暂停等）就重新触发一次线路生成，生成时手动线路不保留； 线路生成后自动同步至业务（域名）
      </p>
      <div style="display:grid; grid-template-columns: 50% 50%;">
        <div>
          <h3>CNAME模式：</h3>
          <div class="alert-desc">
            CNAME同步： 业务 (域名) CNAME
            <div class="icon">CNAME <div id="test" /> </div>
            <span style=" margin-left: 110px;">调度域名</span>
            <div class="icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div id="test" /> </div>
            <span style=" margin-left: 110px;">源</span>
          </div>
          <div class="alert-desc">
            A记录同步：&nbsp;&nbsp;&nbsp;&nbsp;业务 (域名) CNAME
            <div class="icon">A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div id="test" /> </div>
            <span style=" margin-left: 110px;">调度域名解析线路</span>
            <div class="icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div id="test" /> </div>
            <span style=" margin-left: 110px;">源</span>
          </div>
        </div>
        <div >
          <h3>NS模式：</h3>
          <div class="alert-desc">
            CNAME同步： 业务 (域名) CNAME
            <div class="icon">CNAME <div id="test" /> </div>
            <span style=" margin-left: 110px;">调度域名</span>
            <div class="icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div id="test" /> </div>
            <span style=" margin-left: 110px;">源</span>
          </div>
          <div class="alert-desc">
            A记录同步：&nbsp;&nbsp;&nbsp;&nbsp;业务 (域名) CNAME
            <div class="icon">A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div id="test" /> </div>
            <span style=" margin-left: 110px;">调度域名解析线路</span>
            <div class="icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div id="test" /> </div>
            <span style=" margin-left: 110px;">源</span>
          </div>
          <div class="alert-desc">
            实际生效：&nbsp;&nbsp;&nbsp;&nbsp;业务 (域名)
            <div class="icon">A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div id="test" /> </div>
            <span style=" margin-left: 110px;">调度域名解析线路</span>
            <div class="icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div id="test" /> </div>
            <span style=" margin-left: 110px;">源</span>
          </div>
        </div>
      </div>
    </DmAlert>
    <LineAsync ref="line"/>
    <LineList ref="line-list"/>
  </div>
</template>
<script>
import LineAsync from './components/line-template'
import LineList from './components/line-list-template'
export default {
  components: { LineAsync, LineList },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.alert-desc {
  margin-bottom: 1em;
}
.icon {
  display: inline-block;
  position:absolute;
  width: 90px;
  height: 30px;
  line-height: 32px;
  text-align: center;
  border-bottom: 2px solid;
  margin: -19px 10px 0;
}
#test {
  display: inline-block;
}
#test:after {
  border: 5px solid transparent;
  border-left: 5px solid ;
  width: 0;
  height: 0;
  position: absolute;
  content: " ";
  margin: 3px 0 0 20px;
}
</style>
