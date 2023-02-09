
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
					<v-form v-on:submit.prevent>
						<v-expand-transition>
							<section v-if='!twoFATokenRequired'>
								<v-text-field
									v-for='(item,index) in textFields'
									v-model='user[item.model]'
									@click:append-inner='appendClick()'
									@focus='focusMethod(item.model)'
									v-on:keyup.enter='login'
									:append-inner-icon='item.appendIcon'
									:autocomplete='item.autocomplete'
									:dense='smAndDown'
									:disabled='localLoading'
									:error-messages='errorMessages[item.model]'
									:key='index'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									:type='item.type'
									color='primary'
									variant='outlined'
									required
								/>
							</section>
						</v-expand-transition>
						<v-expand-transition>
							<template v-if='twoFATokenRequired'>

								<!-- 2FA text input  -->
								<v-text-field
									v-for='(item,index) in tokenFields'
									v-model='user[item.model]'
									@focus='focusMethod(item.model)'
									v-on:keyup.enter='login'
									:autofocus='true'
									:dense='smAndDown'
									:disabled='localLoading'
									:error-messages='errorMessages[item.model]'
									:key='index'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									autocomplete='one-time-code'
									color='primary'
									variant='outlined'
									required
								/>
							</template>
						</v-expand-transition>

					</v-form>
					<v-row justify='center' align='center' wrap class='pa-0 ma-0'>
						<v-col :order='mdAndUp? 1 : 2' cols='12' md='auto' class='pa-0 ma-0'>
							<v-row justify='center' align='center' dense no-gutters class='pa-0 ma-0'>
								<v-col cols='auto' class='ma-0 pa-0 mb-n6' v-if='!twoFATokenRequired'>
									<v-checkbox
										v-model='user.remember'
										:disabled='localLoading'
										class='ma-0 pa-0 mt-n4'
										color='primary'
									>
										<template v-slot:label>
											<span class='ml-0'>remember me</span>
										</template>
									</v-checkbox>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</template>
				<template v-slot:button>
					<v-row align='center' :justify='twoFATokenRequired?"space-around":"center"' class='mb-3'>
						<v-col cols='6' v-if='twoFATokenRequired'>
							<ActionButton
								@click='cancel'
								:block='true'
								:icon='mdiClose'
								:disabled='localLoading'
								:iconFirst='true'
								color='pi'
								text='cancel'
							/>

						</v-col>
						<v-col cols='6'>
							<ActionButton
								@click='login'
								:block='true'
								:icon='mdiSend'
								text='login'
								:disabled='disabled'
							/>

						</v-col>
					</v-row>
				
				</template>
				<template v-slot:end>

					<v-row align='center' justify='space-between' class='my-2 ma-0 pa-0' v-if='!twoFATokenRequired'>
						<v-col cols='auto' class='ma-0 pa-0'>
							<router-link class='text-primary' :to='FrontEndRoutes.REGISTER'>create account</router-link>
						</v-col>
						<v-col cols='auto' class='ma-0 pa-0'>
							<router-link class='text-primary' :to='FrontEndRoutes.FORGOTPASSWORD'>forgotten password?</router-link>
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { axios_authenticatedUser, axios_incognito } from '@/services/axios';
import { FrontEndRoutes } from '@/types/enum_routes';
import { mdiCellphoneInformation, mdiClose, mdiEmail, mdiEye, mdiEyeOff, mdiLock, mdiSend } from '@mdi/js';
import { required, email } from '@vuelidate/validators';
import { RouterLink } from 'vue-router';
import { token_regex } from '@/vanillaTS/globalConst';
import { useDisplay } from 'vuetify';
import ActionButton from '@/components/Buttons/ActionButton.vue';
import AppCard from '@/components/Card/AppCard.vue';
import ThePage from '@/components/ThePage.vue';
import type { TLoginModel, TLoginFields } from '@/types';
import useVuelidate from '@vuelidate/core';

const { mdAndUp, smAndDown } = useDisplay();

onMounted(() => {
	browserModule().set_description(`staticPi login page - log into staticPi`);
	browserModule().set_title(pageTitle);
});

onBeforeUnmount(() => {
	cancel();
});

const disabled = computed((): boolean => {
	return localLoading.value || v$.value.$invalid || twoFATokenRequired.value && !!errorMessages.value.token || twoFATokenRequired.value && !user.value.token;
});
const redirect = computed({
	get (): string {
		return browserModule().redirect;
	},
	set (s: string): void {
		browserModule().set_redirect(s);
	}
});
const textFields = computed((): Array<TLoginFields> => {
	return [
		{
			appendIcon: '',
			autocomplete: '',
			icon: mdiEmail,
			label: 'email address',
			model: 'email' as const,
			type: 'email',
		},
		{
			appendIcon: user.value.password ? passwordVisible.value ? mdiEyeOff: mdiEye : '',
			autocomplete: 'password',
			icon: mdiLock,
			label: 'password',
			model: 'password' as const,
			type: passwordVisible.value ? 'text' : 'password',
		},
	];
});

const authed = ref(false);
const errorMessages = ref({
	email: '',
	password: '',
	token: ''
});
const focus = ref('');
const localLoading = ref(false);
const pageTitle = 'login';
const passwordVisible = ref(false);
const tokenFields = [
	{
		clearable: true,
		icon: mdiCellphoneInformation,
		label: '2FA code',
		model: 'token' as const,
	},
];
const twoFATokenRequired = ref(false);
const twoFABackupEnabled = ref(false);
const user = ref({
	password: '',
	email: '',
	remember: false,
	token: '',
});

/**
** Set the password visible
**/
const appendClick = (): void => {
	if (localLoading.value) return;
	passwordVisible.value = !passwordVisible.value;
};
/**
** set the this.focus to the currently in focus text field
** If the in focus field ISN't the password field, then set passwordVisible to false
* @param {String} model - current model/textfield name
*/
const focusMethod = (model: TLoginModel): void => {
	focus.value = model;
	if (model !== 'password') passwordVisible.value = false;
};

const cancel = (): void => {
	user.value= {
		password: '',
		email: '',
		remember: false,
		token: '',
	},
	twoFATokenRequired.value = false;
	twoFABackupEnabled.value = false;
	passwordVisible.value = false;
};

const clearErrorMessages = (): void => {
	errorMessages.value = {
		email: '',
		password: '',
		token: ''
	};
};

const router = useRouter();

const login = async (): Promise<void> => {
	if (v$.value.$invalid) return;
	clearErrorMessages();
	localLoading.value = true;
	passwordVisible.value = false;
	const authObject = {
		email: user.value.email.toLowerCase(),
		password: user.value.password,
		token: user.value.token? user.value.token.replace(/\s/g, ''): undefined,
		remember: user.value.remember
	};
	const loginRequest = await axios_incognito.signin_post(authObject);
	localLoading.value = false;

	if (loginRequest?.status === 200) {
		authed.value = true;
		clearErrorMessages();
		userModule().set_email(user.value.email);
		userModule().set_authenticated(true);
		user.value.email = '';
		user.value.password = '';
		user.value.token = '';
		await axios_authenticatedUser.user_get();
		snackbarModule().$reset();
		const destination = redirect.value ? redirect.value : FrontEndRoutes.USER_DEVICES;
		router.push(destination);
		redirect.value = '';
	}

	else if (loginRequest?.status === 202) {
		snackbarModule().$reset();
		twoFATokenRequired.value = true;
		twoFABackupEnabled.value = loginRequest.response.two_fa_backup;
	}
	else if (twoFATokenRequired.value) {
		errorMessages.value.token = 'invalid token';
	} else {
		errorMessages.value.email = 'invalid email and/or password';
		errorMessages.value.password = 'invalid email and/or password';
	}
};

const rules = {
	email: {
		email,
		required
	},
	password: {
		required,
	}
};
const v$ = useVuelidate(rules, user);
watch(() => user.value.email, (_) => {
	user.value.email = user.value.email ? user.value.email.trim().toLowerCase(): '';
	errorMessages.value.email = !v$.value.email.email ? 'email invalid': '';
});

watch(() => user.value.token, (i) => {
	if (i) {
		if (!token_regex.test(i.replace(/\s/g, ''))) {
			errorMessages.value.token = 'invalid token';
			return;
		} else {
			errorMessages.value.token = '';
		}
	} else {
		errorMessages.value.token = '';
	}
});

</script>