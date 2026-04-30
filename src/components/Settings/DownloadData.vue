<template>
	<SettingSection :disabled='componentDisabled'>
		<template #titleIcon>
			<v-icon class='mr-2' color='pi' :icon='mdiAccountArrowDown' :size='smAndDown ? "small" : "default"' />
		</template>

		<template #title>
			Download Data
		</template>

		<template #text_description>
			If you wish to access and download all the information associated with their account, simply click the
			'download data' button and follow the prompts to receive your information.
			<br>
			Please note, that this is limited to once per 24-hours.
		</template>

		<template #action_button>
			<v-expand-transition>
				<v-row class='ma-0 pa-0 align-center justify-center'>
					<v-col class='ma-0 pa-0' cols='12' md='auto'>
						<ActionButton
							:block='true'
							:icon='mdiDownload'
							small
							text='download data'
							@click='downloadData'
						/>
					</v-col>
				</v-row>
			</v-expand-transition>
		</template>

	</SettingSection>
</template>

<script setup lang='ts'>
import type { TAuthObject } from '@/types'
import { mdiAccountArrowDown, mdiDownload } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { dialoger } from '@/services/dialog'
import { fetch_authenticatedUser } from '@/services/fetch'

const { smAndDown } = useDisplay()

const settingSectionStore = settingSectionModule()

onBeforeMount(() => {
	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'downloaddata') {
		settingSectionStore.set_beforemount_open(false)
	}
})

const componentDisabled = computed(() => settingSectionStore.current_section && settingSectionStore.current_section !== 'downloaddata' ? true : false)

const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

async function downloadData (): Promise<void> {
	dialoger({
		message: `Authentication required in order to download user data`,
		buttonText: 'download data',
		icon: mdiDownload,
		title: 'User Data',
		confirmMethod: downloadData_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	})
}

async function downloadData_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	const data = await fetch_authenticatedUser.data_get(authentication)
	if (data) {
		const file = document.createElement('a')
		file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(JSON.parse(data), null, '  ')))
		file.setAttribute('download', 'staticPi_user_data.txt')
		file.style.display = 'none'
		document.body.append(file)
		file.click()
		file.remove()
	}
	loading.value = false
}

</script>
