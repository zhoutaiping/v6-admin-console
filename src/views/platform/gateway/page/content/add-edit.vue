<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.margin-top {
  margin-top: 15px;
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
      类别新增后，默认为 未启用 状态；
    </DmAlert>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="120px"
      class="margin-top "
    >
      <el-form-item
        label="类别名称"
        prop="class_name"
      >
        <el-input
          v-model="form.class_name"
          placeholder="类别名称"
          class="input-box"
        />
        </el-input>
      </el-form-item>
      <el-form-item
        label="级别"
        prop="class_level"
      >
        <el-select
          :disabled="mode === 'GatewayContentEdit'"
          v-model="form.class_level"
          class="input-box"
          @change="e =>{
            form.p_class_flag = ''
          }"
        >
          <el-option
            value="1"
            label="一级"
          />
          <el-option
            value="2"
            label="二级"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :prop="form.class_level === '2' ? 'p_class_flag' : ''"
        label="所属一级"
      >
        <el-select
          v-model="form.p_class_flag"
          filterable
          class="input-box"
        >
          <el-option
            v-for="item in p_class"
            :value="item.class_flag"
            :label="item.class_name"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="class_explain"
        label="说明"
        class="item-box"
      >
        <el-input
          v-model="form.class_explain"
          :rows="2"
          placeholder="包括仿冒、账号钓鱼、中奖诈骗的网站"
          class="input-box"
          type="textarea"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          @click="handleSubmit"
        >保 存</el-button>
        <router-link :to="`/gateway-content-index`">
          <el-button>取 消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </DmPage>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      loading: false,
      PagePanel: 'THREAT-ADD-EDIT',
      content_flag: '唯一标识 第三方威胁情报',
      form: {
        id: '',
        class_name: '',
        class_level: '',
        p_class_flag: '',
        class_explain: ''
      },

      rules: {
        class_name: [{ required: true, message: ' ' }],
        class_level: [{ required: true, message: ' ' }],
        p_class_flag: [{ required: true, message: ' ' }],
        class_explain: []
      },
      back: {
        path: '/gateway-content-index',
        query: {}
      },
      class1list: [],
      disable_class_level: false
    }
  },

  computed: {
    p_class() {
      return this.form.class_level === '2' ? this.class1list || [] : [{ class_name: '无', class_flag: '0' }]
    },
    mode() {
      return this.$route.name
    }
  },

  async created() {
    await this.fetchClass()
  },
  mounted() {
    this.$nextTick(() => {
      if (this.mode === 'GatewayContentEdit') {
        this.form = Object.assign({}, { ...this.$route.query })
        this.disable_class_level = this.$route.query.class_level === '2'
      }
    })
  },
  methods: {
    async fetchClass() {
      try {
        const data = await this.FetchGateWay.get('/content/class1list', { page: 1, pageSize: 999 })
        this.class1list = data.list
      } catch (error) {
        this.class1list = []
        return
      }
    },
    handleSubmit() {
      const Api = {
        'GatewayContentAdd': '/content/create',
        'GatewayContentEdit': '/content/edit'
      }

      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.FetchGateWay.post(Api[this.mode], { ...this.form }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$router.push('/gateway-content-index')
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
