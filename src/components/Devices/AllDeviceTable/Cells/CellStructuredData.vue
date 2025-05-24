<template>
	<section>
		<v-row align='center' :justify='justify' no-gutters class='pt-1 mb-n2'>
			<v-col cols='auto' class='ma-0 pa-0 mb-n3'>
				<v-switch v-model='new_value' :disabled='paused || freeUser' color='primary' density='compact'
					:error-messages='notSaved' />
				<v-tooltip v-if='show_tooltip' activator='parent' :disabled='device.paused' location='top center'
					content-class='tooltip'>
					<span>{{ tooltipText }}</span>
				</v-tooltip>

			</v-col>
			<v-expand-x-transition>
				<v-col v-if='notSaved && !paused' cols='auto' class='ma-0 pa-0 mt-n3'>
					<v-btn @click='button.click' :class='button.class' class='fab-fix' size='x-small' variant='text'
						icon>
						<v-icon :color='button.color' :icon='button.icon' />
					</v-btn>
				</v-col>
			</v-expand-x-transition>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiContentSave } from '@mdi/js';
import { useDisplay } from 'vuetify';
import type { TAuthObject, TSwitchButton, TDeviceInfo } from '@/types';
import type { VRow } from 'vuetify/components/VGrid';

const { mdAndUp, mobile } = useDisplay();

onBeforeMount(() => {
	new_value.value = current_value.value;
});

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value));

const button = computed((): TSwitchButton => ({
	color: 'primary',
	click: save,
	icon: mdiContentSave,
	class: 'heartbeat'
}));

const justify = computed(() => mdAndUp.value ? 'center' : 'end');
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});
const freeUser = computed(() => userModule().isFreeUser);
const current_value = computed(() => props.device.structured_data);
const paused = computed(() => props.device.paused);
const name_of_device = computed(() => props.device.name_of_device);
const notSaved = computed(() => new_value.value !== current_value.value ? 'not saved' : '');
const tooltipText = computed(() => freeUser.value ? 'Structured data not available for free users' : current_value.value ? `disable structured data` : `enable structured data`);

const new_value = ref(false);

const emit = defineEmits(['refresh']);

const save_confirm = async (_auth?: TAuthObject): Promise<void> => {
	loading.value = true;
	await axios_device.structuredData_patch({
		name: name_of_device.value,
		structured_data: new_value.value
	});
	loading.value = false;
	emit('refresh');
};
const save = async (): Promise<void> => {
	if (new_value.value) {
		save_confirm();
	} else {
		dialoger({
			message: `Are you sure you want to disable structured data for "${props.device.name_of_device}"?`,
			buttonText: 'confirm',
			title: 'Remove structured data',
			passwordrequired: false,
			twoFABackup: false,
			icon: '',
			timeout: 5,
			confirmMethod: save_confirm,
			twoFARequired: false
		});
	}
};

const props = defineProps<{ device: TDeviceInfo }>();

watch(paused, (i: boolean): void => {
	if (i) new_value.value = current_value.value;
});
</script>
