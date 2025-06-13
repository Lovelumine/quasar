import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { STableProvider, STable } from '@shene/table'
import '@shene/table/dist/index.css'

import 'element-plus/theme-chalk/dark/css-vars.css' // 引入暗黑主题样式
import './search.css'

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: 'en-US',
    globalInjection: true,
    messages,
  })

  app.use(ElementPlus)
  // Set i18n instance on app
  app.use(i18n)
  app.component('STableProvider', STableProvider)
  app.component('STable', STable)
})
