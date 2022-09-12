<template>
  <div>
    <DmAlert>
      1、默认用户组映射分配：按照系统对每个节点设置的默认智能解析线路进行DNS解析线路增加，若IP/CNAME没有设置解析线路将为其生成默认线路；并且优选BGP》电信》联通》移动》其他为默认线路；
      <br>
      2、地理就近分配：按照节点位置进行就近分配，位置以省会到省会距离为依据。例如IP为福州电信，将生成福建电信等；美国将生成海外/美国；香港将生成海外/东南亚/香港/中国大陆。并且优选BGP》电信》联通》移动》其他为默认线路；
      <br>
      3、网络质量优先分配：按照节点在各地区探测出的网络质量自动生成最快线路；选择网络质量优先时允许自定义检测时间，如2个小时评估一次；
      <br>
      4、只要边缘节点有变化（重新调度/新增/暂停等）就重新触发一次线路生成，生成时手动线路不保留；线路生成后自动同步至业务（域名）
    </DmAlert>
    <Visit ref="visit"/>
    <VistList ref="vistlist"/>
  </div>
</template>
<script>
import Visit from './components/visit-template'
import VistList from './components/visit-list-template'
export default {
  components: { Visit, VistList },
  data() {
    return {

    }
  }
}
</script>
