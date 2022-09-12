<style lang="scss" scoped>
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
<template>
  <div>
    <el-card class="is-horizonta">
      <div slot="header" class="clearfix">
        <span>异常处置策略</span>
      </div>
      <div>
        <DmToolbar>
          <span style="display: inline-block; font-size: 15px;">处置模版</span>
          <DmSelect
            v-model="bindParams.template_id"
            :selects="options.template"
            class="input-box"
            placeholder="节点异常处置模版"
            @change="e =>{
              if(e) {
                updataTemplate()
              }
            }"
          />
          <el-button type="text" @click="routeLink()">
            查看模板
          </el-button>
          <el-button type="primary" @click="$refs.DmData.initPage()">刷 新</el-button>
        </DmToolbar>
        <DmData
          ref="DmData"
          :auto-init="false"
          @init="fetchList"
        >
          <DmTable :loading="loading">
            <el-table :data="list">
              <el-table-column
                v-for="(item, index) in column"
                :key="index"
                :label="item.label"
                :width="item.width"
                :show-overflow-tooltip="item.prop!=='level'"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'level'">
                    <el-button
                      :disabled="scope.$index === 0"
                      type="text"
                      @click="hanleRowSort(scope.row, 'top')"
                    >置顶</el-button>
                    <el-divider direction="vertical" />
                    <el-button
                      :disabled="scope.$index === 0"
                      type="text"
                      @click="hanleRowSort(scope.row, 'prev')"
                    >上移</el-button>
                    <el-divider direction="vertical" />
                    <el-button
                      :disabled="scope.$index === 0 || scope.$index === data.length-1"
                      type="text"
                      @click="hanleRowSort(scope.row, 'next')"
                    >下移</el-button>
                    <el-divider direction="vertical" />
                    <el-button
                      :disabled="scope.$index === data.length-1"
                      type="text"
                      @click="hanleRowSort(scope.row, 'bottom')"
                    >置底</el-button>
                  </template>
                  <template v-else-if="item.prop === 'rules'">
                    <ColumnRules :items="scope.row.rules" />
                  </template>
                  <template v-else-if="item.prop === 'status'">
                    <span
                      v-if="scope.row.status === 0"
                      class="color--danger"
                    >禁用</span>
                    <span
                      v-else
                      class="color--success"
                    >启用</span>
                  </template>
                  <template v-else>{{ formartValue(scope.row, item.prop) }}</template>
                </template>
              </el-table-column>

            </el-table>
          </DmTable>
        </DmData>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import consoleData from '@/mixins/consoleData'
import ColumnRules from '../../ColumnRules'
import router, { resetRouter } from '@/router'
export default {
  components: { ColumnRules },
  mixins: [consoleData],
  data() {
    return {
      data: [],
      API_INDEX: '/fd/V4/dispatch.template.rule.list.get',
      bindParams: { template_id: '' },
      options: {
        template: []
      },
      column: [
        { label: '策略ID', prop: 'bn' },
        { label: '匹配条件', prop: 'rules' },
        { label: '处置方式', prop: 'do_view' },
        { label: '恢复后处置方式', prop: 'recovery_view' },
        { label: '状态', prop: 'status' },
        { label: '优先级（由上向下)', prop: 'level', width: 200 },
        { label: '备注', prop: 'remark' }
      ]
    }
  },
  computed: {
    ...mapState({
      template: state => state.disp.template
    })
  },
  watch: {
    template: {
      deep: true,
      handler(val) {
        this.init('template')
      }
    }
  },
  mounted() {
    this.init('template')
  },
  methods: {
    init(type = '') {
      if (type === 'template') {
        if (this.template && this.template.bind && this.template.bind.abnormal) {
          this.bindParams.template_id = this.template.bind.abnormal
          this.fetchSettings(this.bindParams.template_id)
          this.$refs.DmData.initPage()
        }
        this.options.template = this.template.abnormal
      }
    },

    async updataTemplate(type) {
      const params = {
        data_type: 'group',
        template_id: this.bindParams.template_id,
        id: this.$route.params.id
      }

      try {
        await this.Fetch.post('/fd/V4/dispatch.template.bind.save', params)
        this.Message('ACTION_SUCCESS')
        this.$store.dispatch('fetchTemplateBind', {
          id: this.$route.params.id,
          data_type: 'group'
        })
        await this.fetchSettings(this.bindParams.template_id)
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    },

    routeLink() {
      this.$store.dispatch('delAllViews')
      this.$store.dispatch('changeMenuType', { menu_type: 'resources' }).then(res => {
        resetRouter()
        router.addRoutes(res)
        this.$router.push({ path: '/platform/resources/resources/dns', query: {
          active: 'abnormal'
        }})
      })
    },

    fetchSettings(template_id = '') {
      if (!template_id) {
        return
      }
      this.$store.dispatch('fetchSettings', { type: 'abnormal', template_id: template_id })
    },

    formartValue(data, prop) {
      return data[prop]
    },

    // 调整优先级
    async hanleRowSort(data, type) {
      const { page, per_page } = this.$refs.DmData.getParams()
      const params = {
        id: data.id,
        template_id: data.template_id,
        type,
        page,
        per_page
      }

      try {
        await this.InvokeAllApi.post('/fd/V4/dispatch.rule.sort.save', params)
      } catch (e) {
        return
      }

      this.Message('ACTION_SUCCESS')
      this.fetchList()
    }
  }
}
</script>
