<template>
  <div>
    <template v-if="layout === 'tabs'">
      <a-tabs
        v-model="active"
        :tab-bar-style="{'border-bottom': 'none'}"
        class="tabs"
        type="card"
        @change="e =>{$emit('init', e)}"
      >
        <a-tab-pane
          v-for="i in options.tabs"
          :tab="i.label"
          :key="i.value"
        />
      </a-tabs>
    </template>
    <template v-else-if="layout === 'card'">
      <div class="link-box">
        <el-card :body-style="{padding:'10px 10px 0'}" class="card-box" shadow="never">
          <div class="router-title ">
            {{ routeTitle }}
          </div>
          <a-tabs :tab-bar-style="{margin: '0 0 2px', 'border-bottom': 'none'}" v-model="active" @change="e=>{$emit('init', e)}">
            <a-tab-pane v-for="item in options.tabs" :tab="item.label" :key="item.value"/>
          </a-tabs>
        </el-card>
      </div>
    </template>
    <template v-else-if="layout === 'back'">
      <div class="link-box">
        <el-card :body-style="{padding:'10px 10px 0'}" class="card-box" shadow="never">
          <div>
            <router-link
              :to="{
                path: back.path,
                query: back.query
            }">
              <el-button
                v-show="back.path"
                type="text"
                icon="el-icon-back"
              >

                返 回
              </el-button>
            </router-link>
            <div class="router-title " style="display:inline-block;">
              {{ routeTitle }}
            </div>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DmTabs',
  props: {
    vm: {
      type: [Object],
      default: null
    },
    desc: {
      type: String,
      default: ''
    },

    back: {
      type: [Object],
      default: null
    },

    value: {
      type: [String, Number],
      default: ''
    },

    tabs: {
      type: Array,
      default: () => []
    },

    layout: {
      type: String,
      default: 'tabs'
    }

  },
  data() {
    return {
      active: '',
      options: {
        tabs: []
      }
    }
  },
  computed: {
    routeTitle() {
      let title = `${this.$route.meta.title}`
      if (this.desc) {
        title = title + `- ${this.desc}`
      }
      return title
    }
  },
  watch: {
    value(val) {
      this.active = this.value
    },
    tabs(val) {
      this.options.tabs = this.tabs
    },

    vm: {
      handler(val) {
        // console.log(val)
      },
      deep: true
    }
  },

  mounted() {
    if (this.value) {
      this.active = this.value
    }
    if (this.tabs) {
      this.options.tabs = this.tabs
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: inline-block;
  height: 50px;
  line-height: 50px;
}
.card-box {
  margin: 0px 0px 10px;
  min-height: 50px;
  border-radius: 0;
  border-style: solid;
  box-shadow: 0 8px 16px 0px rgba(10, 14, 29, 0.04), 0px 8px 64px 0px rgba(10, 14, 29, 0.08);
  position: relative;
}
.link-box {
  width: 100%;
  height: auto;
  min-height: 50px;
}
.router-title {
  font-size: 17px;
  font-weight: 500;
  border-left: 3px solid $--color-primary;
  padding-left: 10px;
}
</style>
