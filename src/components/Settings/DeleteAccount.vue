<template>
	<SettingSection :disabled='componentDisabled'>
		<template #titleIcon>
			<v-icon class='mr-2' color='pi' :icon='mdiAccountRemove' :size='smAndDown ? "small" : "default"' />
		</template>

		<template #title>
			Delete Account
		</template>

		<template #text_description>
			You may wish to fully close your account with us and have all of your associated data permanently removed
			from our servers.
			Please be aware that this action is irreversible and cannot be undone. Please note that it may take up to 14
			days for your data to be completely removed.

		</template>

		<template #action_button>
			<v-expand-transition>
				<v-row class='align-center ma-0 pa-0 justify-center'>
					<v-col class='ma-0 pa-0' cols='12' md='auto'>
						<ActionButton
							:block='true'
							:disabled
							:icon='mdiDelete'
							small
							text='delete account'
							@click='deleteAccount'
						/>
					</v-col>
				</v-row>
			</v-expand-transition>
		</template>

	</SettingSection>
</template>

<script setup lang='ts'>
import type { TAuthObject } from '@/types'
import { mdiAccountRemove, mdiDelete } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { dialoger } from '@/services/dialog'
import { fetch_authenticatedUser } from '@/services/fetch'
const { smAndDown } = useDisplay()

const settingSectionStore = settingSectionModule()

const disabled = computed(() => userModule().isAdminUser)

onBeforeMount(() => {
	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'deleteaccount') {
		settingSectionStore.set_beforemount_open(false)
	}
})

const componentDisabled = computed(() => settingSectionStore.current_section && settingSectionStore.current_section !== 'deleteaccount' ? true : false)

const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

async function deleteAccount (): Promise<void> {
	dialoger({
		message: `Are you sure you want to delete your account? This is an irreversible action`,
		buttonText: 'delete account',
		icon: mdiAccountRemove,
		title: 'Delete Account',
		confirmMethod: deleteAccount_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	})
}

async function deleteAccount_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	const response = await fetch_authenticatedUser.account_delete({ ...authentication })
	loading.value = false
	if (response) {
		await userModule().clientSideSignout()
	}
}

</script>
