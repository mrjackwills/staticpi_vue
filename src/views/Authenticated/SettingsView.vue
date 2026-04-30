<template>
	<ThePage
		:heading='pageTitle'
		margin=''
		:page-ready
	>

		<template #body>
			<UserLevel />
			<TwoFactor />
			<ChangePassword />
			<ChangeFullname />
			<DownloadData />
			<DeleteAccount />

		</template>

	</ThePage>
</template>

<script setup lang='ts'>
import type { TSettingSection, u } from '@/types'
import { fetch_authenticatedUser, fetch_device } from '@/services/fetch'

onMounted(() => {
	browserModule().set_description(`staticPi settings page - control the settings for your staticPi user account`)
	browserModule().set_title(pageTitle.value)
})

onBeforeUnmount(() => {
	settingSectionModule().set_current_section(undefined)
	browserModule().set_stopScroll(false)
})
const route = useRoute()

onBeforeMount(async () => {
	if (route.query.section) {
		const query = String(route.query.section).toLowerCase()
		if (['2fa', 'changepassword', 'userlevel', 'changefullname'].includes(query)) {
			settingSectionModule().set_current_section(query as TSettingSection)
			settingSectionModule().set_beforemount_open(true)
		}
	}
	await getData()
})

const current_section = computed((): u<TSettingSection> => settingSectionModule().current_section)
const force_refresh = computed({
	get (): boolean {
		return browserModule().force_refresh
	},
	set (b: boolean): void {
		browserModule().set_force_refresh(b)
	},
})

const pageTitle = ref('User Settings')
const pageReady = ref(false)

/**
 ** make axios calls, and load into store, data about 2fa and userEmailAlerts
 */
async function getData (): Promise<void> {
	loadingModule().set_loading(true)
	const isAuthenticated = await fetch_authenticatedUser.user_get()
	if (isAuthenticated) {
		await fetch_device.deviceAll_get()
	}
	loadingModule().set_loading(false)
	pageReady.value = true
}

watch(current_section, (i: u<TSettingSection>): void => {
	const base = 'User Settings'
	if (i) {
		const sBase = `${base}:`
		switch (i) {
			case '2fa': {
				pageTitle.value = `${sBase} Two-Factor Authentication`
				break
			}
			case 'changepassword': {
				pageTitle.value = `${sBase} Change Password`
				break
			}
			case 'userlevel': {
				pageTitle.value = `${sBase} User Level`
				break
			}
			case 'changefullname': {
				pageTitle.value = `${sBase} Change Name`
				break
			}
			case 'deleteaccount': {
				pageTitle.value = `${sBase} Delete Account`
				break
			}
		}
	} else pageTitle.value = base
})

watch(force_refresh, (i: boolean): void => {
	if (i) {
		setTimeout(() => {
			getData()
			force_refresh.value = false
		}, 350)
	}
})

</script>
