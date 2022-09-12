const express = require('express')
const history = require('connect-history-api-fallback')
const proxy = require('http-proxy-middleware')

var app = express()

app.use(
  history({
    verbose: true,
    index: 'index.html'
  })
)

app.use(
  '/api',
  proxy({
    target: process.env.API_URL || 'http://adminv5.pre.nodevops.cn',
    changeOrigin: true,
    secure: false
  })
)
app.use(
  '/asset/v1',
  proxy({
    target: process.env.API_URL || 'http://adminv5.pre.nodevops.cn',
    changeOrigin: true,
    secure: false
  })
)
app.use(
  '/tag',
  proxy({
    target: process.env.API_URL || 'http://adminv5.pre.nodevops.cn',
    changeOrigin: true,
    secure: false
  })
)
app.use(
  '/s_disp',
  proxy({
    target: process.env.API_URL || 'http://adminv5.pre.nodevops.cn',
    changeOrigin: true,
    secure: false
  })
)
app.use(
  '/gateway',
  proxy({
    target: process.env.API_GATEWAY || 'http://adminv5.pre.nodevops.cn',
    changeOrigin: true,
    secure: false
  })
)
app.use(express.static('./dist'))
app.listen(80)
