const SPEED_LIMIT_TYPE_VAR = {
  CUSTOMER: 1,
  HOST: 2
}

export default {
  SPEED_LIMIT_TYPE_VAR,
  SPEED_LIMIT_TYPE: [
    {
      label: '客户维度',
      value: SPEED_LIMIT_TYPE_VAR.CUSTOMER
    },
    {
      label: '主机维度',
      value: SPEED_LIMIT_TYPE_VAR.HOST
    }
  ],
  RECORD_TYPE: [
    {
      label: '自定义',
      value: 1
    },
    {
      label: '系统默认',
      value: 2
    }
  ],
  STATUS: [
    {
      label: '启用',
      value: 1
    },
    {
      label: '关闭',
      value: 2
    }
  ]
}
