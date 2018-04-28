import SuperTreeSelect from './lib/SuperTreeSelect'

const install = function(Vue) {
  Vue.component('SuperTreeSelect', SuperTreeSelect)
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default Object.assign(SuperTreeSelect, {install})

