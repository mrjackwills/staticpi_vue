<template>
	<ActionButton
		@click='deleteAll'
		:block='true'
		:icon='mdiDelete'
		:iconFirst='true'
		color='pi'
		text='delete all'
	/>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiDelete, } from '@mdi/js';
import type { TAuthObject } from '@/types';

const emit = defineEmits([ 'refresh' ]);
const deleteAll_confirm = async (authentication: TAuthObject): Promise<void> => {
	const loading_store = loadingModule();
	loading_store.set_loading(true);
	await axios_device.all_delete(authentication);
	emit('refresh');
	loading_store.set_loading(false);
};
const deleteAll = async (): Promise<void> => {
	dialoger({
		message: 'Are you sure you want to delete all your devices?',
		buttonText: 'confirm',
		title: 'Delete Device',
		passwordrequired: true,
		twoFABackup: true,
		icon: '',
		confirmMethod: deleteAll_confirm,
		twoFARequired: false,
	});
};

</script>