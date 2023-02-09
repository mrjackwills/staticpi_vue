<template>
	<v-app class='ma-0 pa-0' id='staticpi'>
		<TheAppBar :order='mdAndDown?"2":"1"'/>
		<NavDrawer :order='mdAndDown?"1":"2"' />
		<v-main>
			<router-view v-if='pageReady' />
		</v-main>
		<TheSnackbar />
		<TheDialog />
		<TheUpArrow />
		<TheFooter v-if='(!authenticated && !mdAndDown)' />
	</v-app>
</template>

<script setup lang='ts'>
import { env } from './vanillaTS/env';
import { registerSW } from 'virtual:pwa-register';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import { useHead } from '@vueuse/head';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { useRoute } from 'vue-router';
import NavDrawer from '@/components/NavDrawer.vue';
import TheAppBar from '@/components/AppBar.vue';
import TheDialog from '@/components/AppDialog.vue';
import TheFooter from '@/components/AppFooter.vue';
import TheSnackbar from '@/components/TheSnackBar.vue';
import TheUpArrow from '@/components/UpArrow.vue';

const { mdAndDown } = useDisplay();
const { updateServiceWorker } = useRegisterSW();

const route = useRoute();

if ('serviceWorker' in navigator) {
	registerSW({
		onNeedRefresh () {
			appUpdate();

		}
	});
}

const appUpdate = (): void => {
	snackSuccess({ message: 'Updating website', loading: true, timeout: 4500, closable: false, icon: '' });
	window.setTimeout(() => updateServiceWorker(), 4000);
	
};
const browserStore = browserModule();

const authenticated = computed((): boolean => {
	return userModule().authenticated;
});

const pwa = computed({
	get (): boolean {
		return browserStore.pwa;
	},
	set (b: boolean): void {
		browserStore.set_pwa(b);
	}
});

onBeforeMount(() => {
	// Set pwa true in pinia
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const nav = window.navigator as any;
	const isInStandaloneMode = (): boolean => window.matchMedia('(display-mode: standalone)').matches || nav.standalone || document.referrer.includes('android-app://');
	if (isInStandaloneMode()) pwa.value = true;

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	document.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
	});
	pageReady.value = true;

});

const pageReady = ref(false);

const title = computed((): string => {
	return browserStore.title;
});

const description = computed((): string => {
	return browserStore.description;
});

useHead({
	title: () => {
		if (title.value) {
			return `staticPi - ${title.value}`;
		} else {
			return `staticPi`;
		}
	},

	meta: [
		{
			name: `description`,
			content: (): string => {
				if (description.value) {
					return description.value;
				} else {
					return `The simple pi communication service`;
				}
			}
		}
	],
	link: [ { rel: 'canonical', href: `${env.domain_www}${route?.path}` } ],
});

</script>

<style>
.v-application__wrap {
  min-height: 100dvh !important;
}
</style>
