import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import VePie from 'v-charts/lib/pie.common'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/font/iconfont.css'
import VueClipboard from 'vue-clipboard2'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

Vue.config.devtools = true;

Vue.use(VueClipboard)
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.component(VePie.name, VePie);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
