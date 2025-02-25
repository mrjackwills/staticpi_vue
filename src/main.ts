/* eslint-disable @stylistic/ts/object-curly-newline */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
// Components
import App from './App.vue';
import { createPinia } from 'pinia';

// Composables
import { createApp } from 'vue';
import vuetify from './plugins/vuetify';
import router from './router';
import { createHead } from '@vueuse/head';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { markRaw } from 'vue';
import type { Router } from 'vue-router';

const app = createApp(App);
const head = createHead();

declare module 'pinia' {
	export interface Pinia {
		router: () => Router;
	}
	export interface PiniaCustomProperties {
		router: Router;
	}
}

// adapt this based on where your router is

const pinia = createPinia();
pinia.use(({ store }) => {
	store.router = markRaw(router);
});
pinia.router = (): Router => router;

pinia.use(piniaPluginPersistedstate);

app
	.use(head)
	.use(router)
	.use(pinia)
	.use(vuetify)
	.mount('#staticpi_app');
