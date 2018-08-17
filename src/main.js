import Vue from 'vue'

import Framework7 from 'framework7'
import Framework7Vue from 'framework7-vue'
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'

import 'mint-ui/lib/style.css'
import './css/app.css'
import './css/notice.css'
import Routes from './routes.js'
import App from './app'

import axios from './libs/axios'
import store from './store/data'

Vue.use(Framework7Vue)
Vue.prototype.$http = axios

new Vue({
  el: '#app',
  framework7: {
    root: '#app',
    routes: Routes,
    pushState: true,
    pushStateSeparator: '',
    pushStateRoot: '/electric',
    modalTitle: '电费查询',
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    smartSelectBackOnSelect: true,
    smartSelectSearchbar: true
  },
  store,
  render: h => h(App)
});

store.commit('init', window.electric);