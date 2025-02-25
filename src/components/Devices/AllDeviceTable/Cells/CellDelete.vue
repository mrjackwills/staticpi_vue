<template>
	<v-row align='center' :justify='justify' class='no-gutters pa-0 ma-0' >

		<FabTooltip
			@click='deleteDevice'
			:disabled='!online'
			:icon='mdiDeleteCircle'
			:tooltip_text='tooltip_text'
			color='pi'
		/>
	</v-row>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiDeleteCircle } from '@mdi/js';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import type { TAuthObject, TDeviceInfo } from '@/types';
import type { VRow } from 'vuetify/components/VGrid';

const { mdAndUp } = useDisplay();

const justify = computed((): VRow['$props']['justify'] => {
	return mdAndUp.value ? 'center' : 'end';
});
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});
const tooltip_text = computed((): string => {
	return `delete: ${name_of_device.value }`;
});
const name_of_device = computed((): string => {
	return props.device.name_of_device;
});
const online = computed((): boolean => {
	return browserModule().online;
});

const deleteDevice = async (): Promise<void> => {
	dialoger({
		message: `Are you sure you want to delete device "${name_of_device.value}"`,
		buttonText: 'delete',
		icon: mdiDeleteCircle,
		title: 'Delete device',
		confirmMethod: deleteDevice_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: false
	});

};
const deleteDevice_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	const response = await axios_device.named_delete({
		name: name_of_device.value,
		authentication 
	});
	loading.value = false;
	if (response) {
		snackSuccess({
			message: `Deleted "${name_of_device.value}"`,
			icon: mdiDeleteCircle 
		});
		emit('refresh');
	}
};

const emit = defineEmits([ 'refresh' ]);

const props = defineProps<{ device: TDeviceInfo }>();
</script>