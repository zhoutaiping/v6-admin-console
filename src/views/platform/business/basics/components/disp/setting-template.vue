<template>
  <div>
    <DmAlert>
      1、标签与资源匹配规则：账户信誉、域名备案、自定义标签需要完全匹配，用户认证和行业标签不需要完全匹配。
      <br>
      2、异常处置策略仅针对YUNDUN资源包，客户自有资源默认仅支持宕机暂停；
      <br>
      3、解绑最后一个资源包时需确保没有业务使用改调度包，否则无法解绑；
      <br>
      4、非SCDN调度异常处置只支持遵循访问策略处置；
    </DmAlert>
    <Disp ref="disp" @cname_init="$refs.cname.init()"/>
    <CNAME ref="cname"/>
    <Abnormal ref="abnormal"/>
  </div>
</template>
<script>
import Disp from './components/disp-template'
import CNAME from './components/cname-template'
import Abnormal from './components/abnormal-template'
export default {
  components: { Disp, CNAME, Abnormal }
}
</script>
