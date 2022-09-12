<template>
  <div>
    <DmAlert>
      1、标签与资源匹配规则：账户信誉、域名备案、自定义标签需要完全匹配，用户认证和行业标签不需要完全匹配。
      <br>
      2、账户信誉等级：默认分配对应等级标签资源池，若需要等级更高资源可在调度策略中设定。设定时限定只可获取同等级或更高等级资源，即低危可使用低中高危资源、中危可使用中高危资源、高危可使用高危资源。
      <span style="color:red;">政府&事业单位默认为低危，其他默认为中危</span>
      <br>
      3、域名备案标签：域名级调度备案变动后会自动变动备案标签触发调度；套餐级调度域名备案发生变动，自动更换标签并触发调度，如有特殊需求，请另用域名级调度；
      <br>
      4、手动IP锁定：如果选择“是”每次调度时手动添加的IP会保留；默认值为 否；“否”表示只要触发新调度，就会清除分配方式为手动的节点IP；
      <br>
      5、调度锁定：默认为 “否” ，选择“是”时，禁止进行调度，包括程序自动和手动；
    </DmAlert>
    <Tag ref="tag"/>
    <Disp ref="disp"/>
    <CNAME ref="cname"/>
    <Abnormal ref="abnormal"/>
  </div>
</template>
<script>
import Tag from './components/tag-template'
import Disp from './components/disp-template'
import CNAME from './components/cname-template'
import Abnormal from './components/abnormal-template'
export default {
  components: { Tag, Disp, CNAME, Abnormal }
}
</script>
