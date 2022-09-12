<style lang="scss" scoped>
.clearfix {
  height: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 32px;
}
.select-item {
  color: #2991fa;
  background: #eaf4ff;
  border-color: #a9d3fd;
}
.dropdown-item-box {
  width: 180px;
  height: 35px;
  line-height: 35px;
  font-size: 15px;
}
.mune-item {
  height: 200px;
  margin-top: 20px;
}
.item-link {
  position: relative;
  padding: 5px 20px;
  border-top: 1px solid #e8e8e8;
}
.item-desc {
  padding: 10px 20px;
  height: 90px;
  overflow: hidden;
  text-align: justify;
  text-justify: newspaper;
  word-break: break-all;
}
</style>
<template>
  <div>
    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        当前位置：
        <el-dropdown
          trigger="click"
          placement="bottom-start"
        >
          <el-button icon="el-icon-menu">{{ menuText() }} <i class="el-icon-caret-bottom el-icon--right" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div class="dropdown-item-box">
                <router-link to="/dashboard">
                  首页<span style="float:right;"><i class="el-icon-arrow-right el-icon--right" /></span>
                </router-link>
              </div>
            </el-dropdown-item>
            <el-dropdown-item
              v-for="(item,index) in munuItems"
              :key="item.index"
              :class="[item.key ===menu_type && 'select-item']"
              divided
            >
              <div
                class="dropdown-item-box"
                @click="handleLind(item.key)"
              >{{ item.title }} <span style="float:right;"><i class="el-icon-arrow-right el-icon--right" /></span></div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-row :gutter="12">
          <el-col
            v-for="(item,index) in munuItems"
            :key="item.index"
            :span="12"
            :xs="24"
          >
            <el-card
              :body-style="{ padding: '0px' }"
              shadow="never"
              class="mune-item"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span>{{ item.title }}</span>
              </div>
              <div class="item-desc">
                {{ item.desc }}
              </div>
              <div class="item-link color--primary">
                <el-button
                  :disabled="item.key === menu"
                  type="text"
                  @click="handleLind(item.key)"
                >进入平台 >>></el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import router, { resetRouter } from '@/router'
export default {
  computed: {
    ...mapState({
      menu: state => state.user.menu_type
    }),
    ...mapGetters([
      'menu_type',
      'login_menu_role',
      'munuItems'
    ])
  },
  methods: {
    ...mapActions({
      changeMenuType: 'changeMenuType'
    }),
    menuText(key) {
      const item = this.munuItems.find(i => i.key === this.menu_type)
      return item && item.title || ''
    },
    handleLind(key) {
      if (key === this.menu_type) {
        return
      }
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
      this.changeMenuType({ menu_type: key }).then(res => {
        resetRouter()
        router.addRoutes(res)
      })
    }
  }
}
</script>
