import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import 'nprogress/nprogress.css'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import XEUtils from 'xe-utils'
import moment from 'moment'
import numeral from 'numeral'
import NProgress from 'nprogress'
import FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import $ from 'jquery'
import print from '@/plugs/print'
import preventReClick from '@/utilities/preventRepeatClick'
import '@/utilities/dialogExt.js'
import appsettings from '@/appsettings.json'
import http from '@/api/http'
import permission from '@/api/permission'
import base from '@/utilities/common'
import filters from '@/filters/index'
import { useSystemStore } from '@/stores'

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, { duration: 6000 })
app.use(VXETable)
app.use(print)
app.use(preventReClick)

const systemStore = useSystemStore()
systemStore.setAppsettings(appsettings)

app.config.globalProperties.$ = $
app.config.globalProperties.$XEUtils = XEUtils
app.config.globalProperties.$moment = moment
app.config.globalProperties.$numeral = numeral
app.config.globalProperties.$FileSaver = FileSaver
app.config.globalProperties.$XLSX = XLSX
app.config.globalProperties.$NProgress = NProgress

Object.keys(filters).forEach(k => {
  app.config.globalProperties[`$${k}`] = filters[k]
})

app.config.globalProperties.permission = permission
app.config.globalProperties.permission.init(app)
app.config.globalProperties.base = base
app.config.globalProperties.http = http
app.config.globalProperties.http.init(app)

if (localStorage.getItem('userMes')) {
  systemStore.setPermission()
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

app.mount('#app')
