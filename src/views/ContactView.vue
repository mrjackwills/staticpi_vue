<template>
	<ThePage :justify='"center"' :fillHeight='true'>
		<template v-slot:body>
			<AppCard :hasButton='true' :heading='pageTitle' v-model:loading='localLoading' heading_class='my-3'>
				<template v-slot:start>
					<v-row justify='center' align='center' class='pa-0 ma-0 mb-3'>
						<v-col cols='12' class='ma-0 pa-0'>
							<div class='text-center text-body-1'>
								We'll endeavour to respond to your message as soon as possible
							</div>
						</v-col>
					</v-row>
				</template>
				<template v-slot:body>

					<v-form v-on:submit.prevent>
						<template v-for='(item, index) in textFieldRows' :key='index'>
							<v-text-field v-model='message_data[item.model]'
								@update:model-value='v$[item.model]?.$touch()' @keydown.enter='submit'
								:append-inner-icon='item.appendIcon' :autocomplete='item.autocomplete'
								:clearable='item.clearable' :dense='smAndDown'
								:disabled='complete || localLoading || authenticated'
								:error-messages='errorMessages[item.model]' :label='item.label'
								:prepend-inner-icon='item.icon' :type='item.type' color='primary' variant='outlined'
								required validate-on-blur />

						</template>
						<template v-for='(item, index) in textAreaRows' :key='index'>
							<v-textarea v-model='message_data[item.model]'
								@update:model-value='v$[item.model]?.$touch()' @keydown.enter='submit'
								:append-inner-icon='item.appendIcon' :autocomplete='item.autocomplete'
								:dense='smAndDown' :disabled='complete || localLoading'
								:error-messages='errorMessages[item.model]' :label='item.label'
								:prepend-inner-icon='item.icon' :rows='item.rows' :type='item.type' counter='1024'
								color='primary' variant='outlined' persistent-counter required validate-on-blur />

						</template>
					</v-form>
				</template>
				<template v-slot:button>
					<v-row align='center' justify='space-around' class='ma-0 pa-0 mb-2'>
						<v-col cols='6' class='ma-0 pa-0'>
							<BackButton />

						</v-col>
						<v-col cols='6' class='ma-0 pa-0'>

							<ActionButton v-model:disabled='disabled' @click='submit' :block='true'
								:icon='mdiEmailFastOutline' :text='complete ? "sent" : "send"' />
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>

import { axios_incognito } from '@/services/axios';
import { required, email, maxLength, minLength } from '@vuelidate/validators';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import { mdiEmail, mdiEmailFastOutline, mdiMessageTextOutline } from '@mdi/js';
import useVuelidate from '@vuelidate/core';

const { smAndDown } = useDisplay();

onMounted(() => {
	browserModule().set_description(`staticPi contact page`);
	browserModule().set_title(pageTitle);
	if (authenticated.value) {
		message_data.value.email = userModule().email;
	}
});

const authenticated = computed(() => userModule().authenticated);

const disabled = computed(() => v$.value.$invalid || complete.value || localLoading.value ? true : false);

const textFieldRows = computed(() => [
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiEmail,
		label: 'email address',
		model: 'email' as const,
		type: 'email'
	}
]);

const textAreaRows = computed(() => [
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiMessageTextOutline,
		label: 'message',
		model: 'message' as const,
		type: 'text',
		rows: 10
	}
]);

const complete = ref(false);
const errorMessages = ref({
	email: '',
	message: ''
});

const localLoading = ref(false);
const pageTitle = 'contact us';

const message_data = ref({
	email: '',
	message: ''
});

const submit = async (): Promise<void> => {
	if (disabled.value) return;
	message_data.value.message = message_data.value.message.trimEnd();
	await v$.value.$validate();
	if (v$.value.$error) return;
	localLoading.value = true;
	const response = await axios_incognito.contact_post(message_data.value);
	localLoading.value = false;
	complete.value = true;
	if (response) {
		snackSuccess({
			message: 'Your message has been sent',
			closable: false,
			type: 'success'
		});
	}
};

const rules = {
	email: {
		email,
		required
	},
	message: {
		required,
		max: maxLength(1024),
		min: minLength(64)
	}
};

const v$ = useVuelidate(rules, message_data);

watch(() => message_data.value.email, (_) => {
	message_data.value.email = message_data.value.email ? message_data.value.email.toLowerCase().trim() : '';
	if (!v$.value?.email?.$invalid) {
		errorMessages.value.email = '';
		return;
	}
	if (!v$.value.email.$dirty) return;
	if (!v$.value.email.required) errorMessages.value.email = 'email required';
	errorMessages.value.email = 'email invalid';
});

watch(() => message_data.value.message, (i) => {
	// TODO trim message
	if (!v$.value?.message?.$invalid) {
		errorMessages.value.message = '';
		return;
	}

	if (!i) {
		errorMessages.value.message = '';
		return;
	}
	if (!v$.value.message.$dirty) return;
	if (v$.value.message.min) errorMessages.value.message = `message too short`;
	else if (v$.value.message.max) errorMessages.value.message = `message too long`;
	else if (!v$.value.message.required) errorMessages.value.message = 'message required';

});

</script>
