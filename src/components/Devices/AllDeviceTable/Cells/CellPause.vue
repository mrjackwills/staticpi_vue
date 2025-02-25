<template>
	<v-row align='center' :justify='justify' no-gutters class=''>

		<FabTooltip
			@click='pauseDevice'
			v-model:icon='icon'
			v-model:tooltip_text='tooltip_text'
			:color='color'
			:disabled='!online'
		/>
	</v-row>
</template>
<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import type { TAuthObject, TDeviceInfo } from '@/types';
import type { VRow } from 'vuetify/components/VGrid';

const { mdAndUp } = useDisplay();

const color = computed((): string => {
	return paused.value ? 'primary' : 'secondary';
});
const icon = computed((): string => {
	return paused.value ? mdiPlayCircle : mdiPauseCircle;
});
const justify = computed((): VRow['$props']['justify']=> {
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
	return `${paused.value ? 'resume' : 'pause'}: ${name_of_device.value}`;
});

const paused = computed((): boolean => {
	return props.device.paused;
});
const name_of_device = computed((): string => {
	return props.device.name_of_device;
});
const online = computed((): boolean => {
	return browserModule().online;
});

const pauseDevice = (): void => {
	dialoger({
		message: `Are you sure you want to ${paused.value ? 'resume' : 'pause'} device "${name_of_device.value}"?`,
		buttonText: paused.value ? 'resume' : 'pause',
		icon: paused.value ? mdiPlayCircle : mdiPauseCircle,
		title: `${paused.value ? 'Resume' : 'Pause'} device`,
		passwordrequired: false,
		timeout: 5,
		confirmMethod: pauseDevice_confirm,
		twoFABackup: false,
		twoFARequired: false
	});
};

const emit = defineEmits([ 'refresh' ]);

const pauseDevice_confirm = async (authentication?: TAuthObject): Promise<void> => {
	loading.value = true;
	const response = await axios_device.paused_patch({
		pause: !paused.value,
		name: name_of_device.value,
		authentication 
	});
	loading.value = false;
	if (response) {
		snackSuccess({
			message: `${paused.value ? 'resumed' : 'paused'} device : ${name_of_device.value}`,
			icon: paused.value ? mdiPlayCircle : mdiPauseCircle 
		});
		emit('refresh');
	}
};

const props = defineProps<{ device: TDeviceInfo }>();

</script>
