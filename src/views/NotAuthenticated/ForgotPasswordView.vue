
<template>

	<ThePage
		:justify='"center"'
		:fillHeight='true'
	>
		<template v-slot:body>
			<AppCard
				:heading='pageTitle'
				v-model:loading='localLoading'
				heading_class='my-3'
				:hasButton='true'
			>
				<template v-slot:start>
					<v-row justify='center' align='center' class='pa-0 ma-0 mb-3'>
						<v-col cols='12' class='ma-0 pa-0'>
							<div
								class='text-center text-body-1'
							>
								enter your email address and we'll send you instructions on how to reset your password
							</div>
						</v-col>
					</v-row>
				</template>
				<template v-slot:body>
					<v-form v-on:submit.prevent>
						<v-text-field
							v-model='user.email'
							v-on:keyup.enter='forgot'
							:density='smAndDown?"compact":"default"'
							:disabled='localLoading || complete'
							:error-messages='emailError'
							:prepend-inner-icon='mdiEmail'
							color='primary'
							label='email address'
							type='email'
							variant='outlined'
							clearable
							required
						/>

					</v-form>
				</template>
				<template v-slot:button>
					<v-row align='center' justify='space-around' class='ma-0 pa-0 mb-2'>
						<v-col cols='6' class='ma-0 pa-0'>
							<BackButton />
						</v-col>
						<v-col cols='6' class='ma-0 pa-0'>
							<ActionButton
								@click='forgot'
								:block='true'
								:disabled='disabled'
								:icon='mdiSend'
								text='send'
							/>
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { axios_incognito } from '@/services/axios';
import { mdiEmail, mdiSend } from '@mdi/js';
import { required, email } from '@vuelidate/validators';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import { useVuelidate } from '@vuelidate/core';

const { smAndDown } = useDisplay();

const disabled = computed(() => localLoading.value || v$.value.$invalid || complete.value ? true : false);

const pageTitle = 'forgotten password?';

const emailError = ref('');
const complete = ref(false);
const localLoading = ref(false);
const user = ref({ email: '' });

const rules = {
	email: {
		email,
		required
	}
};
const v$ = useVuelidate(rules, user);

onMounted(() => {
	browserModule().set_title(pageTitle);
	browserModule().set_description(`staticPi forgotten password page - request a password reset links via email`);
});

/**
 ** ALWAYS sends a forgotten password axios request, and snack success
 */
const forgot = async (): Promise<void> => {
	if (disabled.value) return;
	localLoading.value = true;
	await axios_incognito.forgot_post(user.value.email);
	snackSuccess({ message: 'Instructions have been sent to the email address provided' });
	localLoading.value = false;
	complete.value = true;
};

watch(() => user.value.email, (_) => {
	user.value.email = user.value.email ? user.value.email.toLowerCase().trim() : '';
	if (!v$.value.email.$invalid) {
		emailError.value = '';
		return;
	}
	if (!v$.value.email.$dirty) return;
	if (!v$.value.email.required) emailError.value = 'email required';
	if (!v$.value.email.email) emailError.value = 'email invalid';
});
</script>
