import YdInput from './src/input'

/* istanbul ignore next */
YdInput.install = function(Vue) {
  Vue.component(YdInput.name, YdInput)
}

export default YdInput
