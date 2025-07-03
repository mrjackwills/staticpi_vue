<template>
	<ThePage
		:justify='"center"'
		:fillHeight='true'
	>
		<template v-slot:body>
			<AppCard
				:hasButton='true'
				:heading='pageTitle'
				v-model:loading='localLoading'
				heading_class='my-3'
			>
				<template v-slot:body>
					<v-alert
						color='secondary'
						class='mb-3'
						density='compact'
					>
						<v-row class='ma-0 pa-0' no-gutters align='center' justify='center' dense>
							<v-col cols='auto' class='pa-0 ma-0 text-center'>
								<v-icon v-if='smAndUp' color='cardColor' :size='smAndDown?"x-small":"small"' :icon='mdiAlertCircleOutline' />
								<span class='text-cardColor' > accounts are currently by invitation only</span>
							</v-col>
						</v-row>
					</v-alert>
					<v-form v-on:submit.prevent>
						<template v-for='(item, index) in textFieldRows' :key='index'>
							<v-text-field
								v-model='user[item.model]'
								@blur='hibpCheck(item.model)'
								@click:append-inner='appendClick'
								@update:model-value='v$[item.model]?.$touch()'
								@keydown.enter='register'
								:append-inner-icon='item.appendIcon'
								:autocomplete='item.autocomplete'
								:clearable='item.clearable'
								:dense='smAndDown'
								:disabled='complete|| localLoading'
								:error-messages='errorMessages[item.model]'
								:hide-details='item.label === "password" && passwordCompromised'
								:label='item.label'
								:prepend-inner-icon='item.icon'
								:type='item.type'
								color='primary'
								variant='outlined'
								required
								validate-on-blur
							/>
							<section v-if='item.label === "password"' :key='`hibp_${index}`'>
								<v-expand-transition >

									<PasswordStrength
										v-if='!passwordCompromised && user.password'
										v-model:password='user.password'
										v-model:errorMessage='errorMessages.password'
										v-model:passwordCompromised='passwordCompromised'
									/>
								</v-expand-transition>
								<v-expand-transition>
									<v-expand-transition>
										<HibpMessage
											v-if='passwordCompromised'
											mt='mt-1'
										/>
									</v-expand-transition>
								</v-expand-transition>
							</section>
						</template>
						<v-row align='center' justify='center' class='ma-0 pa-0 mt-n4'>
							<v-col cols='12' class='ma-0 pa-0 my-n4'>
								<v-checkbox v-model='user.age' color='primary' label='I am aged 18 years or older' class='ma-0 pa-0'/>
							</v-col>
							<v-spacer />
							<v-col cols='12' class='ma-0 pa-0 mt-n4'>
								<v-checkbox v-model='user.agree' color='primary' class='ma-0 pa-0'>
									<template v-slot:label >
										<v-row class='ma-0 pa-0'>
											<v-col cols='auto' class='ma-0 pa-0'>
												I agree to the
											</v-col>
											<v-col cols='auto' class='ma-0 pa-0'>
												<router-link :to='FrontEndRoutes.PRIVACY' target='_blank' class='ml-1 text-primary'>terms & conditions, and privacy policy</router-link>
											</v-col>
										</v-row>
									</template>
								</v-checkbox>
							</v-col>
						</v-row>
					</v-form>
				</template>
				<template v-slot:button>
					<v-row align='center' justify='space-around' class='ma-0 pa-0 mb-2'>
						<v-col cols='6' class='ma-0 pa-0'>
							<BackButton />

						</v-col>
						<v-col cols='6' class='ma-0 pa-0'>

							<ActionButton
								@click='register'
								v-if='!complete'
								:block='true'
								v-model:disabled='disabled'
								:icon='mdiAccountCheck'
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
import { FrontEndRoutes } from '@/types/const_routes';
import { minPassLength } from '@/vanillaTS/globalConst';
import { passwordCheck } from '@/vanillaTS/hibp';
import { required, email, minLength } from '@vuelidate/validators';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import { mdiAccountCheck, mdiAccountOutline, mdiAlertCircleOutline, mdiEmail, mdiEye, mdiEyeOff, mdiHelpCircleOutline, mdiLock } from '@mdi/js';
import type { TRegisterTextField, TRegisterModels } from '@/types';
import useVuelidate from '@vuelidate/core';

const { smAndUp, smAndDown } = useDisplay();

onMounted(() => {
	browserModule().set_description(`staticPi register page - register for a new user account of staticPi.com`);
	browserModule().set_title(pageTitle);
});

const disabled = computed(() => v$.value.$invalid || passwordCompromised.value || errorMessages.value.password || complete.value || localLoading.value || !user.value.age || !user.value.agree
	? true
	: false);

const textFieldRows = computed((): Array<TRegisterTextField> => [
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiAccountOutline,
		label: 'full name',
		model: 'full_name' as const,
		type: 'text'
	},
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiEmail,
		label: 'email address',
		model: 'email' as const,
		type: 'email'
	},
	{
		appendIcon: user.value.password ? passwordVisible.value ? mdiEyeOff : mdiEye : '',
		autocomplete: 'password',
		clearable: false,
		icon: mdiLock,
		label: 'password',
		model: 'password' as const,
		type: passwordVisible.value ? 'text' : 'password'
	},
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiHelpCircleOutline,
		label: 'invite code',
		model: 'invite' as const,
		type: 'text'
	}
]);

const complete = ref(false);
const errorMessages = ref({
	email: '',
	full_name: '',
	password: '',
	invite: ''
});

const localLoading = ref(false);
const pageTitle = 'register';
const passwordCompromised = ref(false);
const passwordVisible = ref(false);
const user = ref({
	email: '',
	invite: '',
	full_name: '',
	password: '',
	agree: false,
	age: false
});

/**
 ** Set the password visible
 *
 */
const appendClick = (): void => {
	if (localLoading.value) return;
	passwordVisible.value = !passwordVisible.value;
};

/**
 ** Run hibp check, and set passwordCompromised if breach found
 * @param {String} model - current model/textfield name
 */
const hibpCheck = async (model: TRegisterModels): Promise<void> => {
	if (model !== 'password' || !user.value.password || passwordCompromised.value || v$?.value.password?.$invalid) return;

	passwordCompromised.value = await passwordCheck(user.value.password);
	if (passwordCompromised.value) errorMessages.value.password = 'unsafe password';
};
const register = async (): Promise<void> => {
	if (disabled.value) return;
	localLoading.value = true;
	passwordVisible.value = false;
	user.value.full_name.trim();
	const registerResponse = await axios_incognito.register_post(user.value);
	localLoading.value = false;
	if (registerResponse) {
		complete.value = true;
		snackSuccess({
			message: registerResponse,
			timeout: 20000,
			closable: false,
			type: 'success'
		});
		v$.value.$reset();
	}
};

const rules = {
	email: {
		email,
		required
	},
	full_name: { required },
	invite: { required },
	password: {
		required,
		min: minLength(minPassLength)
	}
};

const v$ = useVuelidate(rules, user);

watch(() => user.value.email, () => {
	user.value.email = user.value.email ? user.value.email.toLowerCase().trim() : '';
	if (!v$.value?.email?.$invalid) {
		errorMessages.value.email = '';
		return;
	}
	if (!v$.value.email.$dirty) return;
	if (!v$.value.email.required) errorMessages.value.email = 'email required';
	errorMessages.value.email = 'email invalid';
});

watch(() => user.value.full_name, () => {
	if (!v$.value?.full_name?.$invalid) {
		errorMessages.value.full_name = '';
		return;
	}
	if (!v$.value.full_name.$dirty) return;
	if (!v$.value.full_name.required) errorMessages.value.full_name = 'name required';
});

watch(() => user.value.invite, () => {
	user.value.invite = user.value.invite ? user.value.invite.trim() : '';
	if (!v$.value?.invite?.$invalid) {
		errorMessages.value.invite = '';
		return;
	}
	if (!v$.value.invite.$dirty) return;
	if (!v$.value.invite.required) errorMessages.value.invite = 'invite required';
});

watch(() => user.value.password, () => {
	passwordCompromised.value = false;
	errorMessages.value.password = '';
	if (!user.value.password) passwordVisible.value = false;
	if (user.value.email && user.value.password?.toLowerCase().includes(user.value.email.toLowerCase().trim())) {
		errorMessages.value.password = 'password cannot contain email';
		return;
	}
	if (user.value.email && user.value.password?.toLowerCase().includes(user.value.email.toLowerCase().trim())) {
		errorMessages.value.password = 'password cannot contain email';
		return;
	}
	if (!v$.value?.password?.$invalid && !passwordCompromised.value) {
		errorMessages.value.password = '';
		return;
	}
	if (!v$.value?.password?.$dirty) return;
	if (!v$.value?.password?.required) {
		errorMessages.value.password = 'a password is required';
		return;
	}
	if (!v$.value.password.minLen) {
		errorMessages.value.password = `${minPassLength} characters minimum`;
		return;
	}
});

</script>
