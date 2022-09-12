<template>
  <console-page-layout>
    <div>
      <DmTabs
        ref="active"
        :desc="desc"
        :tabs="options.tabs"
        :value="active"
        layout="card"
        @init="e => {
          active = e
        }"
      />
    </div>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>基本信息</span>
      </div>
      <div>
        <el-form
          ref="FormInfo"
          :model="tcp_info"
          :rules="rules"
          label-width="140px"
          label-position="left"
        >

          <el-form-item
            class="item-box"
            label-width="0"
          >
            <el-form-item
              label="付费服务开始时间"
              class="item-box-inline"
            >
              {{ tcp_info && tcp_info.start_time || '' }}
            </el-form-item>
            <el-form-item
              label="付费服务结束时间"
              class="item-box-inline"
            >
              {{ tcp_info && tcp_info.expire_time || '' }}
            </el-form-item>
          </el-form-item>
          <el-form-item
            label="转发规则条数"
            class="item-box"
          >
            {{ tcp_info && tcp_info.total_rule_num || 0 }} &ensp; 已用：{{ tcp_info && tcp_info.use_rule_num || 0 }}
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>配置信息</span>
      </div>
      <div>
        <el-form
          ref="form_setting"
          :model="form_setting"
          label-width="140px"
          label-position="left"
        >
          <el-form-item
            label="调度包"
            class="item-box"
          >
            <el-input
              v-model="tcp_info.group_name"
              readonly
              class="input-box"
              placeholder="调度包"
            />
            <el-button
              type="primary"
              @click="() => {
                $refs.groupbind.handleOpen({
                                             id: form_setting.id,

                                             member_id:form_setting.member_id},
                                           'Edit') }"
            >绑定</el-button>
          </el-form-item>
          <el-form-item
            label="备注"
            class="item-box"
          >
            <el-input
              v-model="form_setting.remark"
              :rows="4"
              type="textarea"
              placeholder=""
              style="width:600px;"
            />
          </el-form-item>
          <!-- <el-form-item>

            <el-button
              type="primary"
              @click=""
            >保 存</el-button>
          </el-form-item>
         -->
        </el-form>
      </div>
      <GroupBind
        ref="groupbind"
        @init="()=>{
          tcpInfo()
        }"
      />
    </el-card>
  </console-page-layout>
</template>
<script>
import GroupBind from './group-bind'
export default {
  components: { GroupBind },
  data() {
    return {
      active: '1',
      desc: '',
      form_info: { },
      form_setting: {
        id: '',
        member_id: '',
        remark: ''
      },
      rules: { },
      options: {
        tabs: [
          { label: '概览信息', value: '1' }
        ],
        record: [{ label: '无备案', value: '0' }, { label: '有备案', value: '1' }, { label: '未检测', value: '2' }],
        check_status: [],
        back_source_reasons: []
      },
      tcp_info: {}
    }
  },
  computed: {

  },
  created() {
    this.form_setting.id = this.$route.params.id
    this.form_setting.member_id = this.$route.query.member_id
    this.tcpInfo()
  },
  methods: {
    async tcpInfo() {
      this.tcp_info = {}
      try {
        this.tcp_info = await this.Fetch.get('/fd/V4/tcp.forward.info', { id: this.$route.params.id })
      } catch (error) {
        return error
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.item-box {
  margin-bottom: 5px;
}
.item-box-inline {
  display: inline-block;
  width: 500px;
  margin-bottom: 5px;
}
.box-card {
  margin: 0 0 10px;
}
.input-box {
  width: 200px;
}
.is-horizonta {
  display: flex;
  margin-bottom: 16px;
  /deep/.el-card__header {
    flex: 0 0 180px;
    padding-right: 24px;
  }
  /deep/.el-card__body {
    flex: 1;
    overflow: hidden;
    clear: both;
    height: 100%;
  }
}
</style>
