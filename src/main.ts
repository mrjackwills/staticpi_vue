import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

const app = createApp(App)
const head = createHead()

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app
	.use(head)
	.use(router)
	.use(pinia)
	.use(vuetify)
	.mount('#staticpi_app')
