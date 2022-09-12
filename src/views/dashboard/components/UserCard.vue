<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人主页 </span>
      <span style="float:right" class="color--primary">Welcome Back</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <el-avatar :src="account_th" size="large" class="th"/>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.account }} </div>
        <div class="user-role text-center text-muted">{{ user.email }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>个人介绍</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.remark || '暂无' }}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="platform2" />
          <span>详情</span>

        </div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            用户状态
            <span :class="Number(user.status)===1?'color--success':'color--warning'" style="margin-left:20px;">{{ Number(user.status)===1?'开启':'禁用' }}</span>
          </div>
          <div class="progress-item">
            赋权状态
            <span :class="user.role_ids.length > 0 ?'color--success':'color--warning'" style="margin-left:20px;">{{ user.role_ids.length > 0 ?'已分配角色':'暂未分配角色' }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import th from '@/assets/images/th.png'
import th_default from '@/assets/images/th.jpg'
import th_zhangpan from '@/assets/images/th_zhangpan.jpg'
import th_zhaojinlei from '@/assets/images/zhaojinlei.png'

export default {
  components: { },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          account: '',
          nickname: '',
          email: '',
          avatar: '',
          status: '1',
          is_admin: '0',
          role_ids: [],
          remark: ''
        }
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    account_th() {
      const th_url = {
        'zhoutaiping': th,
        'zhangpan': th_zhangpan,
        'lixuan': th_default,
        'zhaojinlei': th_zhaojinlei
      }
      return th_url[this.user.account] || th_default
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix {
  height: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 32px;
}
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
    .th {
      width: 80px;
      height: 80px;
    }
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
