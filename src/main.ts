import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ElButton, ElInput } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('ElButton', ElButton)
app.component('ElInput', ElInput)
app.mount('#app')
