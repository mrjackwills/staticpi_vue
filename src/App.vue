<template>
	<v-app id='staticpi' class='ma-0 pa-0'>
		<AppBar :order='mdAndDown?"2":"1"' />
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
import { useHead } from '@vueuse/head'
import { registerSW } from 'virtual:pwa-register'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { snackSuccess } from '@/services/snack'
import { env } from './vanillaTS/env'

const { mdAndDown, lgAndUp } = useDisplay()
const { updateServiceWorker } = useRegisterSW()
const platform = useDisplay().platform
const route = useRoute()

function check_pwa (): void {
	if ('serviceWorker' in navigator) {
		registerSW({
			onNeedRefresh () {
				appUpdate()
			},
		})
	}
}

const service_interval = ref(0)

function set_appbar_height (): void {
	if (lgAndUp.value) {
		appBarModule().set_size(76)
	} else {
		appBarModule().set_size(56)
	}
}

function appUpdate (): void {
	snackSuccess({
		message: 'Updating website',
		loading: true,
		timeout: 4500,
		closable: false,
		icon: '',
	})
	window.setTimeout(() => updateServiceWorker(), 4000)
}

watch(lgAndUp, () => {
	set_appbar_height()
})

watch(platform, i => {
	browserStore.set_android_ios(i.ios || i.android)
})

onMounted(() => {
	const platform = useDisplay().platform.value
	browserStore.set_android_ios(platform.ios || platform.android)
	set_appbar_height()
})

const browserStore = browserModule()

const authenticated = computed(() => userModule().authenticated)

const pwa = computed({
	get (): boolean {
		return browserStore.pwa
	},
	set (b: boolean): void {
		browserStore.set_pwa(b)
	},
})

onBeforeMount(async () => {
	check_pwa()
	const nav = window.navigator as any
	const isInStandaloneMode = (): boolean => window.matchMedia('(display-mode: standalone)').matches || nav.standalone || document.referrer.includes('android-app://')
	if (isInStandaloneMode()) pwa.value = true

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	document.addEventListener('beforeinstallprompt', e => {
		e.preventDefault()
	})
	pageReady.value = true
	service_interval.value = setInterval(check_pwa, 1000 * 60 * 20)
})

const pageReady = ref(false)

const title = computed(() => browserStore.title)

const description = computed(() => browserStore.description)

useHead({
	title: () => {
		return title.value ? `staticPi - ${title.value}` : `staticPi`
	},

	meta: [
		{
			name: `description`,
			content: (): string => {
				if (description.value) {
					return description.value
				}
				return `The simple pi communication service`
			},
		},
	],
	link: () => [
		{
			rel: 'canonical',
			href: `${env.domain_www}${route?.path}`,
		},
	],
})

</script>

<style>
.v-divider{
	opacity: .35 !important;
}
</style>
