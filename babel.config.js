module.exports = {
  presets: [
    process.env.APP_ENV === 'jest' ? undefined : '@vue/app',
    [
      '@babel/preset-env',
      {
        'corejs': '2',
        'useBuiltIns': 'entry'
      }
    ]
  ].filter(Boolean)
  // if your use import on Demand, Use this code
  // ,
  // plugins: [
  //   [ 'import', {
  //     'libraryName': 'ant-design-vue',
  //     'libraryDirectory': 'es',
  //     'style': true // `style: true` 会加载 less 文件
  //   } ]
  // ]
}
