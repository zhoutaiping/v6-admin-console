<template>
  <div>
    <confItem
      ref="sso_login_url"
      title="Single sign on URL"
      item_key="sso_login_url"
    />
    <useRecipientDestinationUrl
      ref="use_recipient_destination_url"
      item_key="use_recipient_destination_url"
    />
    <confItem
      ref="entity_id"
      title="Audience URI(SP Entity ID)"
      item_key="entity_id"
    />
    <confItem
      ref="name_id_format"
      title="Name ID format"
      item_key="name_id_format"
    />
    <attribute
      ref="attribute"
      title="Attribute"
      item_key="attribute"
    />
    <h3>OAuth2相关字段</h3>
    <confItem
      ref="redirect_uri"
      title="Redirect URI"
      item_key="redirect_uri"
    />
    <confItem
      ref="grant_type"
      title="GrantType"
      item_key="grant_type"
    />
    <confItem
      ref="access_token_expire_time"
      :default_form="{
        display: false,
        required: true,
        content: 7200
      }"
      title="Access_Token"
      item_key="access_token_expire_time"
    />
    <confItem
      ref="refresh_token_expire_time"
      :default_form="{
        display: false,
        required: true,
        content: 604800
      }"
      title="Refresh_Token"
      item_key="refresh_token_expire_time"
    />
    <h3>加密方式</h3>
    <confItem
      ref="algorithmMethod"
      title="AlgorithmMethod"
      item_key="algorithmMethod"
    />
    <confItem
      ref="digestMethod"
      title="DigestMethod"
      item_key="digestMethod"
    />
  </div>
</template>
<script>
import confItem from './conf-item'
import attribute from './attribute'
import useRecipientDestinationUrl from './use_recipient_destination_url'
export default {
  components: { attribute, useRecipientDestinationUrl, confItem },
  data() {
    return {

    }
  },
  methods: {
    init(p_data = null) {
      if (this.$refs.sso_login_url) {
        this.$refs.sso_login_url.init(p_data)
      }
      if (this.$refs.use_recipient_destination_url) {
        this.$refs.use_recipient_destination_url.init(p_data)
      }
      if (this.$refs.entity_id) {
        this.$refs.entity_id.init(p_data)
      }
      if (this.$refs.name_id_format) {
        this.$refs.name_id_format.init(p_data)
      }
      if (this.$refs.attribute) {
        this.$refs.attribute.init(p_data)
      }
      if (this.$refs.redirect_uri) {
        this.$refs.redirect_uri.init(p_data)
      }
      if (this.$refs.grant_type) {
        this.$refs.grant_type.init(p_data)
      }
      if (this.$refs.access_token_expire_time) {
        this.$refs.access_token_expire_time.init(p_data)
      }
      if (this.$refs.refresh_token_expire_time) {
        this.$refs.refresh_token_expire_time.init(p_data)
      }
      if (this.$refs.algorithmMethod) {
        this.$refs.algorithmMethod.init(p_data)
      }
      if (this.$refs.digestMethod) {
        this.$refs.digestMethod.init(p_data)
      }
    },

    getForm() {
      const conf = [
        'sso_login_url', 'use_recipient_destination_url', 'entity_id', 'name_id_format', 'attribute',
        'redirect_uri', 'grant_type', 'refresh_token_expire_time', 'access_token_expire_time', 'algorithmMethod', 'digestMethod'
      ]
      const data = {}
      const that = this
      conf.forEach(e => {
        if (that.$refs[e].getForm()) {
          data[e] = that.$refs[e].getForm()
        }
      })
      return data
    }
  }
}
</script>
