<style lang="scss" scoped>
/deep/.el-input__inner {
  text-align: left;
}
.item-box-inline {
  display: inline-block;
  width: 400px;
  margin-bottom: 5px;
}
.item-box {
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
<template>
  <div>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>回源配置</span>
      </div>
      <div>
        <el-form
          ref="back_source_form"
          :model="back_source_form"
          :rules="rules"
          label-position="left"
          label-width="160px"
        >
          <el-form-item
            class="item-box"
            label-width="0"
          >
            <el-form-item
              prop="proxy_timeout"
              label="节点取源时的超时时间"
              class="item-box-inline"
            >
              <el-input-number
                v-model="back_source_form.proxy_timeout"
                :precision="0"
                :min="0"
                :controls="false"
                class="input-box"
              />
            </el-form-item>
            <el-form-item
              prop="keep_new_src_time"
              label="切换新IP保持时间"
              class="item-box-inline"
            >
              <el-input-number
                v-model="back_source_form.keep_new_src_time"
                :precision="0"
                :min="0"
                :controls="false"
                class="input-box"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item
            prop="center_node_cache_only"
            label=""
            class="item-box"
          >
            <el-checkbox
              v-model="back_source_form.center_node_cache_only"
              :true-label="1"
              :false-label="0"
            />
            是否只对可缓存的资源请求
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSubmit('back_source_form')"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>动态加速</span>
      </div>
      <div>
        <el-form
          ref="dynamic_accelerate_form"
          :model="dynamic_accelerate_form"
          :rules="rules"
        >
          <el-form-item
            prop="speed_up"
            class="item-box"
          >
            <el-checkbox
              v-model="dynamic_accelerate_form.status"
              :true-label="1"
              :false-label="0"
            /> 启用动态加速
          </el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit('dynamic_accelerate_form')"
          >保 存</el-button>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>文件上传配置</span>
      </div>
      <div>
        <el-form
          ref="upload_file_form"
          :model="upload_file_form"
          :rules="rules"
        >
          <el-form-item
            label="单个用户请求上传的最大数据长度"
            class="item-box"
          />
          <el-form-item
            prop="number"
            class="item-box"
          >
            <el-input-number
              v-model="upload_file_form.upload_size"
              :precision="0"
              :min="0"
              :controls="false"
              class="input-box"
            />
            <DmSelect
              v-model="upload_file_form.upload_size_unit"
              :selects="options.speed_unit"
              :clearable="false"
              placeholder=" "
            />
          </el-form-item>
          <el-form-item class="item-box">
            <el-button
              type="primary"
              @click="handleSubmit('upload_file_form')"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>缓存配置</span>
      </div>
      <div>
        <el-form
          ref="cdn_advance_cache_back_form"
          :model="cdn_advance_cache_back_form"
          :rules="rules"
          label-position="top"
          label-width="120px"
        >
          <el-form-item
            prop="from_other_domain"
            label="缓存共用域名"
            class="item-box"
          >
            <el-input
              v-model="cdn_advance_cache_back_form.from_other_domain"
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            prop="cache_post"
            class="item-box"
          >
            <el-checkbox
              v-model="cdn_advance_cache_back_form.cache_post"
              :true-label="1"
              :false-label="0"
            /> POST请求启用缓存
          </el-form-item>
          <el-form-item class="item-box">
            <el-button
              type="primary"
              @click="handleSubmit('cdn_advance_cache_back_form')"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>获取真实remote_addr(前接了其他家cdn场景)</span>
      </div>
      <div>
        <el-form
          ref="real_remote_addr_form"
          :model="real_remote_addr_form"
          :rules="rules"
          label-position="top"
          label-width="140px"
        >
          <el-form-item
            prop="forwarded"
            label="输入指定头部字段名"
            class="item-box"
          >
            <el-input
              v-model="real_remote_addr_form.custom_ip_header"
              class="input-box"
            /> 默认值: x-forwarded-for
          </el-form-item>
          <el-form-item
            prop="remote_addr"
            class="item-box"
          >
            <el-checkbox
              v-model="real_remote_addr_form.status"
              :true-label="1"
              :false-label="0"
            /> 开启获取真实remote_addr(前接了其他家cdn场景)
          </el-form-item>
          <el-form-item class="item-box">
            <el-button
              type="primary"
              @click="handleSubmit('real_remote_addr_form')"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>自定义回源请求头</span>
      </div>
      <div>
        <el-form
          ref="head_form"
          :model="head_form"
          :rules="rules"
          label-position="top"
          label-width="120px"
        >
          <el-form-item prop="head">
            <el-input
              v-model="head_form.customized_req_headers"
              :rows="4"
              type="textarea"
              placeholder="一行一个，英文输入法“:”分割的kv对"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSubmit('head_form')"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="is-horizonta">
      <div
        slot="header"
        class="clearfix"
      >
        <span>日志配置</span>
      </div>
      <div>
        <el-form
          ref="log_ratio_form"
          :model="log_ratio_form"
          :rules="rules"
          label-position="top"
          label-width="120px"
        >
          <el-form-item
            prop="log_ratio"
            label="日志采样"
            class="item-box"
          >
            <el-input-number
              v-model="log_ratio_form.log_ratio"
              :precision="2"
              :min="0"
              :max="100"
              :controls="false"
              class="input-box"
            /> %
          </el-form-item>
          <el-form-item
            prop="log_reserved"
            class="item-box"
          >
            <el-checkbox
              v-model="log_ratio_form.log_reserved"
              :true-label="1"
              :false-label="0"
            /> 日志保留
          </el-form-item>
          <el-form-item class="item-box">
            <el-button
              type="primary"
              @click="handleSubmit('log_ratio_form')"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      back_source_form: {},
      dynamic_accelerate_form: {},
      upload_file_form: {},
      cdn_advance_cache_back_form: {},
      real_remote_addr_form: {},
      head_form: {},
      log_ratio_form: {},
      rules: {},
      options: {
        speed_unit: [
          { label: 'K', value: 'K' },
          { label: 'M', value: 'M' },
          { label: 'G', value: 'G' }
        ]
      },

      group: 'domain_proxy_conf,dynamic_accelerate,upload_file,cdn_advance_cache_back,real_remote_addr,log_ratio,log_reserved'
    }
  },
  methods: {
    initOption(data = {}) {
      const web_domain = data || this.web_domain
      if (web_domain && web_domain.domain_proxy_conf) {
        this.back_source_form = this.initForm({ ...this.default_form.domain_proxy_conf }, { ...web_domain.domain_proxy_conf })
        this.head_form = {
          customized_req_headers: web_domain.domain_proxy_conf.customized_req_headers || ''
        }
      }
      if (web_domain && web_domain.dynamic_accelerate) {
        this.dynamic_accelerate_form = this.initForm({ ...this.default_form.dynamic_accelerate }, { ...web_domain.dynamic_accelerate })
      }
      if (web_domain && web_domain.upload_file) {
        this.upload_file_form = this.initForm({ ...this.default_form.upload_file }, { ...web_domain.upload_file })
      }
      if (web_domain && web_domain.cdn_advance_cache_back) {
        this.cdn_advance_cache_back_form = this.initForm({ ...this.default_form.cdn_advance_cache_back }, { ...web_domain.cdn_advance_cache_back })
      }
      if (web_domain && web_domain.real_remote_addr) {
        this.real_remote_addr_form = this.initForm({ ...this.default_form.real_remote_addr }, { ...web_domain.real_remote_addr })
      }
      if (web_domain && web_domain.log_ratio) {
        this.log_ratio_form = {
          log_ratio: web_domain.log_ratio.log_ratio || 0,
          log_reserved: web_domain.log_reserved.log_reserved || 0
        }
      }
    },

    handleSubmit(form = '') {
      if (form === 'back_source_form') {
        this.Submit({ domain_proxy_conf: { ...this[form] }})
        return
      } else if (form === 'dynamic_accelerate_form') {
        this.Submit({ dynamic_accelerate: { ...this[form] }})
        return
      } else if (form === 'upload_file_form') {
        this.Submit({ upload_file: { ...this[form] }})
        return
      } else if (form === 'cdn_advance_cache_back_form') {
        this.Submit({ cdn_advance_cache_back: { ...this[form] }})
        return
      } else if (form === 'real_remote_addr_form') {
        this.Submit({ real_remote_addr: { ...this[form] }})
        return
      } else if (form === 'head_form') {
        const customized_req_headers = this.head_form.customized_req_headers
        this.Submit({ domain_proxy_conf: { 'customized_req_headers': customized_req_headers }})
        return
      } else if (form === 'log_ratio_form') {
        this.Submit({
          log_ratio: { log_ratio: this.log_ratio_form.log_ratio },
          log_reserved: { log_reserved: this.log_ratio_form.log_reserved }
        })
        return
      }
    }
  }
}
</script>
