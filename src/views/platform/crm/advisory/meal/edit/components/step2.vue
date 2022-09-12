<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <div>
    <RenewOption
      v-show="type === 'renew'"
      ref="renew"
      :price-data="priceData"
      @getPrice="getPrice()"
    />
    <EndOption
      v-show="type === 'cancel'"
      ref="cancel"
      @getPrice="getPrice()"
    />
    <PayOption
      ref="payOption"
      @getPrice="getPrice()"
    />
  </div>
</template>

<script>
import RenewOption from './renew-option'
import PayOption from './pay-option'
import EndOption from './end-option'
import defaultSetting from '@/core/defaultSetting'
export default {
  components: { RenewOption, PayOption, EndOption },
  data() {
    return {
      priceData: {}
    }
  },
  created() {
    this.type = this.$route.query.type || ''
  },
  methods: {
    init(data) {
      this.$refs[this.type] && this.$refs[this.type].init()
      this.$refs.payOption && this.$refs.payOption.init()
      setTimeout(() => {
        this.getPrice()
      }, 200)
    },
    async getPrice() {
      const params = this.params()
      if (!Object.keys(params).length) {
        this.$emit('setAsyncDetail', {})
        return
      }
      const api = defaultSetting.price_api[this.type]
      try {
        const data = await this.Fetch.post(api, params)
        this.priceData = data
        this.$emit('setAsyncDetail', { ...params, ...data })
      } catch (error) {
        this.priceData = {}
        return
      }
    },

    params() {
      return {
        ... this.$refs[this.type].params(),
        ... this.$refs.payOption.params()
      }
    }
  }
}
</script>
