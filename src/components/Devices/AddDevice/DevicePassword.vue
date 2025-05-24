<template>
	<section>
		<v-row align='center' justify='center' no-gutters class='ma-0 pa-0'>
			<v-col cols='12' md='6' class='ma-0 pa-0'>
				<v-text-field v-for='(item, index) in textFields' v-model='deviceSetting[item.model]'
					@click:append-inner='visible(item.model)' @update:model-value='textField_method(item.model)'
					:append-inner-icon='item.appendIcon' :autocomplete='item.autocomplete' :key='index'
					:label='item.label' :prepend-inner-icon='item.icon' :type='item.type' class='ma-0 pa-0'
					color='primary' density='compact' variant='outlined' required />
			</v-col>
		</v-row>
		<v-row align='center' justify='center' class='ma-0 pa-0'>
			<v-col cols='auto' class='ma-0 pa-0'>
				<v-switch v-model='password_synced' class='ma-0 pa-0 mt-n5' :hide-details='true' color='primary'
					density='compact' label='single password' flat />
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import { mdiEye, mdiEyeOff, mdiLock } from '@mdi/js';
import type { TChangeDevicePassword } from '@/types';

const textFields = computed((): Array<TChangeDevicePassword> => {
	const output: Array<TChangeDevicePassword> = [
		{
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'add device password',
			model: 'device_password' as const,
			type: device_passwordVisible.value ? 'text' : 'password',
			appendIcon: device_passwordVisible.value ? mdiEyeOff : mdiEye
		}
	];

	if (!password_synced.value) {
		output.push({
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'add client password',
			model: 'client_password' as const,
			type: client_passwordVisible.value ? 'text' : 'password',
			appendIcon: client_passwordVisible.value ? mdiEyeOff : mdiEye
		});

	}

	return output;
});

const password_synced = ref(true);

const deviceSetting = ref({
	device_password: '',
	client_password: ''
});

const device_passwordVisible = ref(false);
const client_passwordVisible = ref(false);

const emit = defineEmits(['device_passwordInput', 'client_passwordInput']);

const textField_method = (model: 'client_password' | 'device_password'): void => {
	if (model === 'client_password') {
		emit('client_passwordInput', deviceSetting.value.client_password);
	} else {
		emit('device_passwordInput', deviceSetting.value.device_password);
	}
};

const visible = (model: 'client_password' | 'device_password'): void => {
	if (model === 'client_password') {
		client_passwordVisible.value = !client_passwordVisible.value;
	} else {
		device_passwordVisible.value = !device_passwordVisible.value;
	}
};
</script>
