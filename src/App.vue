<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'App',
  mounted() {
    if (['/login', '/'].includes(this.$route.path)) {
      this.getGwt()
    }
  },

  methods: {
    getGwt() {
      const state = getQueryVariable('state')
      const code = getQueryVariable('code')
      const iam_jwt_token = Cookies.get('iam_jwt_token')
      if (code && state && !iam_jwt_token) {
        this.Fetch.post('/V4/Iam/getJwt', {
          state: state, code: code
        }).then(res => {
          if (res.token) Cookies.set('iam_jwt_token', res.token)
        }).catch(e => {
          Cookies.remove('iam_jwt_token')
        })
      }
    }
  }
}

function getQueryVariable(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
</script>
