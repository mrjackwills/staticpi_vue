<template>

	<v-row class='ma-0 pa-0 no gutters' align='center'>
		<v-col cols='12' class='ma-0 pa-0 my-2'>
			<ActionButton @click='check_cache' :block='true' :disabled='isFreeUser || local_loading' :icon='mdiRefresh'
				:small='true' text='check cache' color='secondary' />
		</v-col>
	</v-row>

	<v-row class='ma-0 pa-0 no gutters' align='center' v-if='cache && !hide'>

		<v-col cols='12' class='ma-0 pa-0 mb-3'>
			<span class='text-pi'>cache:</span> {{ cache }}
		</v-col>

		<v-col cols='12' class='ma-0 pa-0'>
			<ActionButton @click='delete_cache' :block='true' :disabled='isFreeUser || local_loading || !cache'
				:icon='mdiDelete' :small='true' text='delete cache' color='pi' />
		</v-col>

	</v-row>

	<v-row class='ma-0 pa-0 no gutters' align='center' v-if='!cache && !hide'>
		<v-col cols='12' class='ma-0 pa-0 text-center'>
			no cache found
		</v-col>

	</v-row>

</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { snackSuccess } from '@/services/snack';
import type { TAuthObject, TDeviceInfo } from '@/types';
import { mdiDelete, mdiRefresh } from '@mdi/js';

const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});
const cache = ref('');
const props = defineProps<{ device: TDeviceInfo }>();
const local_loading = ref(false);

const hide = ref(true);

const check_cache = async (): Promise<void> => {
	if (hide.value) {
		hide.value = false;
	}
	local_loading.value = true;
	loading.value = true;
	cache.value = await axios_device.cache_get(props.device.name_of_device);
	local_loading.value = false;
	loading.value = false;
};

const delete_cache = (): void => {
	dialoger({
		message: `Delete the message cache for "${props.device.name_of_device}"`,
		icon: mdiDelete,
		buttonText: 'delete',
		title: 'Delete message cache',
		confirmMethod: delete_cache_confirm,
		passwordrequired: true,
		twoFABackup: false,
		twoFARequired: false
	});
};

const delete_cache_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	local_loading.value = true;
	const response = await axios_device.cache_delete({
		authentication,
		name: props.device.name_of_device
	});
	loading.value = false;
	local_loading.value = false;
	if (response) {
		snackSuccess({
			message: `"${props.device.name_of_device}" message cache deleted`,
			icon: mdiDelete
		});
		await check_cache();
	}
};

const isFreeUser = computed(() => userModule().isFreeUser);
</script>