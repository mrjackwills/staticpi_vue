<template>
	<v-app class='ma-0 pa-0' id='staticpi'>
		<AppBar :order='mdAndDown?"2":"1"'/>
		<AppNavDrawer :order='mdAndDown?"1":"2"' />
		<v-main>

			<router-view v-if='pageReady' />
			<AppDialog />
			<AppSnackBar />
			<AppUpArrow />

		</v-main>

		<AppFooter v-if='(!authenticated && !mdAndDown)' />
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

const { mdAndDown } = useDisplay();
const { updateServiceWorker } = useRegisterSW();
const platform = useDisplay().platform;
const route = useRoute();

if ('serviceWorker' in navigator) {
	registerSW({
		onNeedRefresh () {
			appUpdate();
		}
	});
}

const appUpdate = (): void => {
	snackSuccess({
		message: 'Updating website',
		loading: true,
		timeout: 4500,
		closable: false,
		icon: ''
	});
	window.setTimeout(() => updateServiceWorker(), 4000);
};

watch(platform, (i) => {
	browserStore.set_android_ios(i.ios || i.android);
});

onMounted(() => {
	const platform = useDisplay().platform.value;
	browserStore.set_android_ios(platform.ios || platform.android);
});

const browserStore = browserModule();

const authenticated = computed(() => userModule().authenticated);

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

const title = computed(() => browserStore.title);

const description = computed(() => browserStore.description);

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
	link: () => [
		{
			rel: 'canonical',
			href: `${env.domain_www}${route?.path}`
		}
	]
});

</script>

<style>
.v-divider{
	opacity: .35 !important;
}
</style>
