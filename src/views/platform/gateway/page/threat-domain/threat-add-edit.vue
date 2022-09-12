<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.foot-bar {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 99;
  width: calc(100% - 202px);
}
.foot-opened-width {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 99;
  width: calc(100% - 55px);
}
.margin-top {
  margin-top: 15px;
}
.map-box:last-child {
  margin-bottom: 100px;
}
</style>
<template>
  <DmPage
    ref="DmData"
    :show-group="false"
    :back="back"
    :page-panel="PagePanel"
  >
    <DmAlert
      v-if="mode==='GatewayThreatDomainThreatAdd'"
      class="margin-top"
    >
      类别新增后，将不支持进行删除，请谨慎操作；<br>
      类别新增后，默认为 禁用 状态；
    </DmAlert>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="120px"
      class="margin-top"
    >
      <el-form-item
        label="类别名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          :readonly="mode==='GatewayThreatDomainThreatEdit'"
          placeholder="类别名称"
          class="input-box"
        />
      </el-form-item>
      <el-form-item
        prop="description"
        class="item-box"
      >
        <span slot="label">
          说明
          <el-tooltip placement="top">
            <div slot="content">
              <span>说明内容将展示在产品控制台的威胁分类中，<br> 请谨慎填写!</span>
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-input
          v-model="form.description"
          :readonly="mode==='GatewayThreatDomainThreatEdit'"
          :rows="2"
          class="input-box"
          type="textarea"
        />
      </el-form-item>
      <template v-for="(item, _index) in source_list">
        <DmCard
          :title="'类别映射-' + (_index + 1)"
          :key="_index"
          class="margin-top map-box"
        >
          <div
            slot="title"
            style="display:inline; "
          >
            <el-tooltip
              content="对应的第三方威胁情报中的 威胁类别相关信息"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            <div style="display:inline; margin-left: 480px;">
              <el-button
                type="primary"
                @click="handleAdd"
              >新 增</el-button>
              <el-button
                :disabled="source_list.length === 1"
                @click="handleDel(_index)"
              >删 除</el-button>
            </div>
          </div>
          <CardRecord
            :ref="'CardRecord_' + (_index + 1)"
            :value="item"
            :mode="mode"
            :source="SOURCE"
            @init="fetchInfo"
          />
        </DmCard>
      </template>

    </el-form>
    <el-card
      :body-style="{'padding':'10px', 'text-align:':'right'}"
      :class="{'foot-opened-width': !sidebar.opened, 'foot-bar':sidebar.opened}"
      shadow="always"
    >
      <el-button
        type="primary"
        @click="handleSubmit"
      > 保存 </el-button>
      <router-link :to="'/gateway/threat/domain/type'">
        <el-button> 取消 </el-button>
      </router-link>
    </el-card>
  </DmPage>
</template>
<script>
import { deepClone } from '@/utils'
import CardRecord from './CardRecord'
import { mapGetters } from 'vuex'
export default {
  components: { CardRecord },
  data() {
    return {
      loading: false,
      PagePanel: 'THREAT-ADD-EDIT',
      content_flag: '唯一标识 第三方威胁情报',
      form: {
        name: '',
        description: ''
      },
      source_list: [
        {
          name: '',
          identifier: '',
          associations: [
            {
              source_identifier: '',
              name: '',
              classification_id: '',
              id: '',
              identifier: ''
            }
          ]
        }
      ],
      rules: {
        name: [{ required: true, message: ' ' }],
        description: [{ required: true, message: ' ' }]
      },
      row: {
        name: '',
        identifier: '',
        associations: [
          {
            source_identifier: '',
            name: '',
            classification_id: '',
            id: '',
            identifier: ''
          }
        ]
      },
      rowKey: ['identifier', 'name'],
      RowRules: {
        name: { required: true, message: ' ' },
        identifier: { required: true, message: ' ' }
      },
      back: {
        path: '/gateway/threat/domain/type',
        query: {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    mode() {
      return this.$route.name
    },
    SOURCE() {
      const list = this.$store.state.gateway.SOURCE
      return list.map(i => {
        return {
          label: i.name,
          value: i.identifier,
          disabled: this.source_list.findIndex(f => f.identifier === i.identifier) > -1
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch('gateway/fetchSource')
      if (this.mode === 'GatewayThreatDomainThreatEdit') {
        this.fetchInfo()
      }
    })
  },
  methods: {
    async fetchInfo() {
      try {
        const data = await this.Fetch.post('/fd/V4/gateway/threat.classification.list', {
          classification_ids: [Number(this.$route.params.id)],
          page: 1,
          page_size: 10
        })
        const { list = [] } = data
        const Item = list.length ? list[0] : null
        if (Item) {
          this.form = Object.assign({}, { ...Item.data })
          this.source_list = Item.source_list && Item.source_list.length ? Item.source_list : [{
            name: '',
            identifier: '',
            associations: [
              {
                source_identifier: '',
                name: '',
                classification_id: '',
                id: '',
                identifier: ''
              }
            ]
          }]
        }
      } catch (error) {
        return
      }
    },
    loadData() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 800)
    },
    handleAdd() {
      this.source_list.push(deepClone(this.row))
    },
    handleDel(index) {
      if (this.source_list.length === 1) return
      const list = deepClone(this.source_list)
      this.source_list = list.filter((i, _i) => _i !== index)
    },
    async checkRecord() {
      const RecordList = deepClone(this.source_list)
      for (let i = 0; i < RecordList.length; i++) {
        const ret = await this.$refs['CardRecord_' + (i + 1)][0].validateForm()
        if (!ret) {
          this.message.warning('映射类别' + (i + 1) + '未按规定填写')
          throw new Error()
        }
      }
    },

    getForm() {
      const data = {
        ...this.form
      }
      const source_list = this.source_list.map(i => {
        const { identifier, associations } = i
        return {
          'source_identifier': identifier,
          'association_ids': (associations.map(a => Number(a.identifier))).filter(n => n)
        }
      })
      data['source_list'] = source_list

      return data
    },
    async handleSubmit() {
      await Promise.all([
        await this.$refs.Form.validate(),
        await this.checkRecord()
      ])
      let api
      if (this.$route.name === 'GatewayThreatDomainThreatEdit') {
        api = '/fd/V4/gateway/threat.classification.update'
        try {
          await this.Fetch.put(api, { ...this.getForm() })
          this.Message('ACTION_SUCCESS')
          this.$router.push('/gateway/threat/domain/type')
        } catch (error) {
          return
        }
      } else {
        api = '/fd/V4/gateway/threat.classification.add'
        try {
          await this.Fetch.post(api, { ...this.getForm() })
          this.Message('ACTION_SUCCESS')
          this.$router.push('/gateway/threat/domain/type')
        } catch (error) {
          return
        }
      }
    }
  }
}
</script>
