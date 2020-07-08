import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 图标
import './assets/fonts/iconfont.css'
// 全局样式表
import './assets/css/global.css'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 表格树
import TreeTable from 'vue-table-with-tree-grid'

// 导入 进度条 包对应的 JS和CSS
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截
axios.interceptors.request.use(config => {
  // 在 request 拦截器中，展示进度条 Nprogress.start()
  Nprogress.start()
  // 为请求头的 Authorization 字段添加 token 验证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})
// 在 response 拦截器中，隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)

// 过滤器, 处理日期数据
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear() + 50
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
