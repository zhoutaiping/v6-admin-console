<style lang="scss" scoped>
/deep/.el-card__header {
  padding: 10px;
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
    padding: 10px;
  }
}
.input-box {
  width:200px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <el-card class="is-horizonta">
    <div slot="header" class="clearfix">
      <span>标签</span>
    </div>
    <div>
      <el-card v-show="options.user_tag.length" shadow="never">
        <div slot="header" class="clearfix">
          <span>客户维度标签</span>
        </div>
        <el-form :model="form_user" :rules="rules" label-position="left" label-width="120px" inline>
          <el-form-item
            v-for="(item, index) in options.user_tag"
            :key="index"
            :label="item.label"
            class="item-box"
          >
            <a-cascader
              v-model="form_user[item.value]"
              :options="item.Children"
              :field-names="{children:'Children', label:'tag', value:'tag_id'}"
              :disabled="true"
              class="input-box"
              placeholder=" "
              change-on-select
            />
            <!-- @change="updata('form_user')" -->
          </el-form-item>
        </el-form>
      </el-card>
      <el-card v-show="options.biz_tag.length" shadow="never" style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span>业务维度标签</span>
        </div>
        <el-form :model="form_biz" :rules="rules" label-position="left" label-width="120px" inline>
          <el-form-item
            v-for="(item, index) in options.biz_tag"
            :key="index"
            :label="item.label"
            class="item-box"
          >
            <a-cascader
              v-model="form_biz[item.value]"
              :options="item.Children"
              :field-names="{children:'Children', label:'tag', value:'tag_id'}"
              :disabled="options.biz_disable.includes(item.value)"
              class="input-box"
              placeholder=" "
              change-on-select
            />
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="updata('form_biz')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-card>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      form_user: {

      },
      form_biz: {

      },
      rules: {},

      options: {
        user_tag: [],
        user_disable: [],
        biz_tag: [],
        biz_disable: []
      }
    }
  },
  computed: {
    ...mapState({
      ip_pool: state => state.disp.ip_pool,
      tagTree: state => state.disp.tagTree
    })
  },

  watch: {
    ip_pool: {
      deep: true,
      handler(val) {
        this.init('form')
      }
    },
    tagTree: {
      deep: true,
      handler(val) {
        this.init('tag')
      }
    }
  },

  mounted() {
    this.init('form')
  },

  methods: {
    ...mapActions({
      getTagsByTypeKey: 'getTagsByTypeKey'
    }),

    async init(type = '') {
      this.options.user_tag = this.tagTree.filter(_ => _.apply_scope === 'user')
      const biz_tag = this.tagTree.filter(_ => _.apply_scope === 'biz')
      this.options.biz_tag = biz_tag
      await Promise.all([
        this.formOption('user'),
        this.formOption('biz')
      ])
    },

    formOption(type = '') {
      const tags = this.ip_pool.tags || {}

      if (type === 'user') {
        setOption(this.options.user_tag, tags, this.form_user, this)
      } else if (type === 'biz') {
        setOption(this.options.biz_tag, tags, this.form_biz, this)
      }
      function setOption(list, data, form, that) {
        if (list.length === 0) {
          return
        }
        list.forEach(e => {
          const value = data[e.value] && Object.keys(data[e.value]).length > 0 ? Object.keys(data[e.value]).map(i => { return Number(i) }) : []
          that.$set(form, e.value, value)
        })
      }
    },

    async updata(type = '') {
      if (type !== 'form_biz') {
        return
      }
      try {
        const form = { ...this.form_biz }
        let tag_ids = []
        Object.keys(form).forEach(i => {
          if (i && form[i] && form[i].length) {
            tag_ids = tag_ids.concat(form[i])
          }
        })
        const params = {
          ippool_ids: [this.$route.params.id],
          tag_ids: tag_ids.map(i => i.toString())
        }
        await this.FetchDisp.post('/ip/pool/tag/bind', params)
        this.Message('ACTION_SUCCESS')
        await this.$store.dispatch('fetchIpPool', { ippool_id: this.$route.params.id, page: 1, pagesize: 1 })
      } catch (error) {
        return
      }
    }
  }
}
</script>
