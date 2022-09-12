<template>
  <div>
    <div class="result-content">
      <a-row
        v-for="(i, index) in list"
        :key="index"
      >
        <a-col
          :sm="8"
          :xs="24"
        >{{ i.title }}：</a-col>
        <a-col
          :sm="16"
          :xs="24"
        >
          {{ i.value }}
          <span
            v-if="index === 4 && i.desc"
            class="color--primary"
          >
            &ensp;
            【{{ i.desc }}】
          </span>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { CountDown } from '@/utils/utils'
import { deepClone } from '@/utils'
export default {
  props: {
    asyncDetail: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      type: '',
      form: {}
    }
  },
  computed: {
    ...mapState({
      detail: state => state.meal.detail,
      info: state => state.meal.info
    }),

    list() {
      const list = deepClone(this.info)
      if (list.length) {
        list[5] = {
          title: '到期时间',
          value: this.asyncDetail.expire_time || this.detail.expire_time || '',
          unit: '',
          desc: CountDown(this.asyncDetail.expire_time || this.detail.expire_time) || ''
        }
      }
      return list
    }
  },

  created() {
    this.type = this.$route.query.type || ''
  },

  methods: {
    init() {
    }
  }
}
</script>
<style lang="scss" scoped>
.result-content {
  margin-top: 24px;
  padding: 24px 40px;
  background-color: #fafafa;
  line-height: 22px;
  .ant-row:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
