<template>
	<SettingSection :disabled='componentDisabled'>
		<template  v-slot:titleIcon>
			<v-icon color='pi' class='mr-2' :size='smAndDown?"small":"default"' :icon='mdiAccountRemove' />
		</template>

		<template v-slot:title>
			Delete Account
		</template>

		<template v-slot:text_description>
			You may wish to fully close your account with us and have all of your associated data permanently removed from our servers.
			Please be aware that this action is irreversible and cannot be undone. Please note that it may take up to 14 days for your data to be completely removed.

		</template>

		<template v-slot:action_button>
			<v-expand-transition>
				<v-row
					align='center'
					justify='center'
					class='ma-0 pa-0'
				>
					<v-col cols='12' md='auto' class='ma-0 pa-0'>
						<ActionButton
							@click='deleteAccount'
							:block='true'
							:disabled='disabled'
							:icon='mdiDelete'
							small
							text='delete account'
						/>
					</v-col>
				</v-row>
			</v-expand-transition>
		</template>
		
	</SettingSection>
</template>

<script setup lang='ts'>
import { axios_authenticatedUser } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiAccountRemove, mdiDelete } from '@mdi/js';
import type { TAuthObject } from '@/types';

import { useDisplay } from 'vuetify';
const { smAndDown } = useDisplay();

const settingSectionStore = settingSectionModule();

const disabled = computed((): boolean => {
	return userModule().isAdminUser;
});

onBeforeMount(() => {

	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'deleteaccount') {
		settingSectionStore.set_beforemount_open(false);
	}
});

const componentDisabled = computed((): boolean => {
	return settingSectionStore.current_section && settingSectionStore.current_section !== 'deleteaccount' ? true : false;
});

const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const deleteAccount = async (): Promise<void> => {
	dialoger({
		message: `Are you sure you want to delete your account? This is an irreversible action`,
		buttonText: 'delete account',
		icon: mdiAccountRemove,
		title: 'Delete Account',
		confirmMethod: deleteAccount_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true
	});

};

const deleteAccount_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	const response = await axios_authenticatedUser.account_delete({ ...authentication });
	loading.value = false;
	if (response) {
		await userModule().clientSideSignout();
	}
};

</script>