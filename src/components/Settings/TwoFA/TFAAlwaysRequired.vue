<template>
	<AppCard
		heading=''
		lg='12'
		my='my-2'
		sm='12'
		xl='12'
	>
		<template #body>
			<section class='my-1'>
				<v-row align='center' class='ma-0 pa-0' justify='center'>
					<v-col class='ma-0 pa-0' cols='auto' @click='toggle'>
						<v-switch
							v-model='always_required'
							class='ma-0 pa-0'
							color='primary'
							density='compact'
							:disabled='backupProcess'
							:hide-details='true'
							readonly
						>
							<template #label>
								<span class='font-weight-bold'>Extra prompts</span>
							</template>
						</v-switch>
					</v-col>
				</v-row>
				<v-row align='center' class='ma-0 pa-0' justify='center'>
					<v-col class='ma-0 pa-0 mb-2 text-center'>
						When enabled, a Two-Factor Authentication token will be required at all password prompts.
						Otherwise, a Two-Factor Authentication token will only be required at login, or when changing
						Two-Factor
						settings.
					</v-col>
				</v-row>
			</section>
		</template>
	</AppCard>
</template>

<script setup lang='ts'>
import type { TAuthObject } from '@/types'
import { axios_authenticatedUser } from '@/services/axios'
import { dialoger } from '@/services/dialog'
const twoFAStore = twoFAModule()

const always_required = computed({
	get (): boolean {
		return twoFAStore.always_required
	},
	set (b: boolean): void {
		twoFAStore.set_alwaysRequired(b)
	},
})
const backupProcess = computed(() => twoFAStore.backupProcess)
const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

async function confirm_function_add (): Promise<void> {
	loading.value = true
	await axios_authenticatedUser.twoFA_patch({ always_required: true })
	loading.value = false
}
async function confirm_function_remove (authentication: TAuthObject): Promise<void> {
	loading.value = true
	await axios_authenticatedUser.twoFA_patch({
		always_required: false,
		...authentication,
	})
	loading.value = false
}
async function show_dialog_add (): Promise<void> {
	dialoger({
		message: 'Are you sure you want to add the extra Two-Factor Authentication prompts?',
		title: 'Confirm',
		buttonText: 'confirm',
		confirmMethod: confirm_function_add,
		icon: '',
		passwordrequired: false,
		timeout: 5,
		twoFABackup: false,
		twoFARequired: false,

	})
}
async function show_dialog_remove (): Promise<void> {
	dialoger({
		message: 'Are you sure you want to remove the extra Two-Factor Authentication prompts?',
		title: 'Confirm',
		buttonText: 'confirm',
		confirmMethod: confirm_function_remove,
		icon: '',
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,

	})
}
async function toggle (): Promise<void> {
	if (backupProcess.value) return
	await (always_required.value ? show_dialog_remove() : show_dialog_add())
}
</script>
