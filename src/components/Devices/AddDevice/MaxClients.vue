<template>
	<v-row align='center' justify='center' class='ma-0 pa-0'>
		<v-col cols='12' md='6' class='ma-0 pa-0'>
			<v-text-field v-model='maxClients' @update:model-value='textField_method'
				@click:append='passwordVisible = !passwordVisible' :autocomplete='textField.autocomplete'
				:disabled='isFreeUser' :key='textField.model' :error-messages='errorMessage'
				:prepend-inner-icon='textField.icon' :type='textField.type' color='primary' density='compact'
				variant='outlined' required />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { mdiLanConnect } from '@mdi/js';

const userStore = userModule();

const isFreeUser = computed(() => userStore.isFreeUser);
const upperLimit = computed(() => userStore.maxClients);
const defaultClients = computed(() => String(Math.ceil(upperLimit.value / 2)));

const errorMessage = ref('');
const maxClients = ref(1);
const passwordVisible = ref(false);
const textField = ref({
	autocomplete: 'one-time-code',
	icon: mdiLanConnect,
	label: 'max clients',
	model: 'maxClients' as const,
	type: 'text'
});

const emit = defineEmits(['input']);

const textField_method = (): void => {
	const num = Number(maxClients.value);
	if (!num || isNaN(num) || num <= 0 || !Number.isInteger(num)) errorMessage.value = 'Invalid number';
	else if (num > upperLimit.value) errorMessage.value = 'Too many clients';
	else errorMessage.value = '';
	emit('input', Number(maxClients.value));
};

onMounted(() => {
	maxClients.value = Number(defaultClients.value);
});
</script>
