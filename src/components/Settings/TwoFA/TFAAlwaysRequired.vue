<template>
	<AppCard heading='' xl='12' lg='12' sm='12' my='my-2'>
		<template v-slot:body>
			<section class='my-1'>
				<v-row class='ma-0 pa-0' align='center' justify='center'>
					<v-col cols='auto' class='ma-0 pa-0' @click='toggle'>
						<v-switch v-model='always_required' :disabled='backupProcess' :hide-details='true'
							class='ma-0 pa-0' color='primary' density='compact' readonly>
							<template v-slot:label>
								<span class='font-weight-bold'>Extra prompts</span>
							</template>
						</v-switch>
					</v-col>
				</v-row>
				<v-row class='ma-0 pa-0' align='center' justify='center'>
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
import { axios_authenticatedUser } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import type { TAuthObject } from '@/types';
const twoFAStore = twoFAModule();

const always_required = computed({
	get (): boolean {
		return twoFAStore.always_required;
	},
	set (b: boolean): void {
		twoFAStore.set_alwaysRequired(b);
	}
});
const backupProcess = computed(() => twoFAStore.backupProcess);
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const confirm_function_add = async (): Promise<void> => {
	loading.value = true;
	await axios_authenticatedUser.twoFA_patch({ always_required: true });
	loading.value = false;
};
const confirm_function_remove = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	await axios_authenticatedUser.twoFA_patch({
		always_required: false,
		...authentication
	});
	loading.value = false;
};
const show_dialog_add = async (): Promise<void> => {
	dialoger({
		message: 'Are you sure you want to add the extra Two-Factor Authentication prompts?',
		title: 'Confirm',
		buttonText: 'confirm',
		confirmMethod: confirm_function_add,
		icon: '',
		passwordrequired: false,
		timeout: 5,
		twoFABackup: false,
		twoFARequired: false

	});
};
const show_dialog_remove = async (): Promise<void> => {
	dialoger({
		message: 'Are you sure you want to remove the extra Two-Factor Authentication prompts?',
		title: 'Confirm',
		buttonText: 'confirm',
		confirmMethod: confirm_function_remove,
		icon: '',
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true

	});
};
const toggle = async (): Promise<void> => {
	if (backupProcess.value) return;
	if (!always_required.value) await show_dialog_add();
	else await show_dialog_remove();
};
</script>