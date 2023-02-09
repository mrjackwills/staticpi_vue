
<template>
	<ThePage
		:fillHeight='true'
		justify='center'
	>
		<template v-slot:body>
			<AppCard
				:heading='pageTitle'
				v-model:loading='localLoading'
				heading_class='mb-3'
				:hasButton='true'
			>
				<template v-slot:start>
					<v-row align='center' justify='center' class='ma-0 pa-0 mb-4'>
						<v-col cols='12' class='pa-0 ma-0 text-body-1'>
							<PasswordDescription />
						</v-col>
					</v-row>
				</template>
				<template v-slot:body>
					<v-form v-on:submit.prevent>
						<v-text-field
							v-for='(item,index) in textFields'
							v-model='user[item.model]'
							@click:append-inner='appendClick'
							@update:model-value='v$[item.model]?.$touch()'
							@keydown.enter='submit'
							:append-inner-icon='item.appendIcon'
							:autocomplete='item.autocomplete'
							:class='{"mb-n6": passwordCompromised}'
							:disabled='localLoading'
							:density='smAndDown?"compact":"default"'
							:error-messages='errorMessages[item.model]'
							:key='index'
							:label='item.label'
							:prepend-inner-icon='item.icon'
							:type='item.type'
							color='primary'
							variant='outlined'
							required
						/>
						<v-expand-transition>
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
									mt=' '
								/>
							</v-expand-transition>
						</v-expand-transition>
						<section v-if='two_fa_enabled'>
							<v-text-field
								v-for='item in tokenFields'
								v-model='user[item.model]'
								v-on:keyup.enter='submit'
								:dense='smAndDown'
								v-model:disabled='localLoading'
								:error-messages='errorMessages[item.model]'
								:key='item.model'
								:label='item.label'
								:prepend-inner-icon='item.icon'
								color='primary'
								variant='outlined'
								required
							/>
						</section>
					</v-form>
				</template>
				<template v-slot:button>
					<ActionButton
						@click='submit'
						:block='true'
						v-model:disabled='disabled'
						:icon='mdiSend'
						text='reset'
						class='mb-2'
					/>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { axios_incognito } from '@/services/axios';
import { FrontEndRoutes } from '@/types/enum_routes';
import { mdiCellphoneInformation, mdiEye, mdiEyeOff, mdiLock, mdiSend } from '@mdi/js';
import { minPassLength } from '@/vanillaTS/globalConst';
import { passwordCheck } from '@/vanillaTS/hibp';
import { required, minLength } from '@vuelidate/validators';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import { useVuelidate } from '@vuelidate/core';
import ActionButton from '@/components/Buttons/ActionButton.vue';
import AppCard from '@/components/Card/AppCard.vue';
import HibpMessage from '@/components/Hibp/HibpMessage.vue';
import PasswordDescription from '@/components/Hibp/PasswordDescription.vue';
import PasswordStrength from '@/components/Hibp/PasswordStrength.vue';
import ThePage from '@/components/ThePage.vue';
import type { TResetFields } from '@/types';

const { smAndDown } = useDisplay();

onBeforeUnmount(() => {
	resetId.value = '';
});

onMounted(() => {
	browserModule().set_description(`staticPi reset password page - reset the password for your staticPi user account`);
	browserModule().set_title(pageTitle);
});

const disabled = computed((): boolean => {
	return v$.value.$invalid || errorMessages.value.password || passwordCompromised.value || tokenDisabled.value || localLoading.value? true : false;
});
const tokenDisabled = computed((): boolean => {
	return two_fa_enabled.value ? two_fa_enabled.value && !user.value.token : false;
});
const resetId = computed({
	get (): string {
		return resetPasswordModule().id;
	},
	set (i: string): void {
		resetPasswordModule().set_id(i);
	}
});
const textFields = computed((): Array<TResetFields> => {
	return [
		{
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'password',
			model: 'password' as const,
			type: passwordVisible.value? 'text' : 'password',
			appendIcon: user.value.password ? passwordVisible.value ? mdiEyeOff : mdiEye : '',
		},
	];
});
const two_fa_enabled = computed((): boolean => {
	return resetPasswordModule().two_fa_enabled;
});
		
const pageTitle ='reset password';

const errorMessages = ref({
	password: '',
	token: '',
});
const localLoading = ref(false);
const passwordCompromised = ref(false);
const passwordVisible = ref(false);
const tokenFields = [
	{
		clearable: true,
		icon: mdiCellphoneInformation,
		label: '2FA code',
		model: 'token' as const,
	},
];
const user = ref({
	password: '',
	token: undefined
});

/**
** Set the password visible
* */
const appendClick = (): void => {
	passwordVisible.value = !passwordVisible.value;
};
/**
** Run hibp check, and set passwordCompromised if breach found
* @param {String} model - current model/textfield name
*/
const hibpCheck = async (): Promise<boolean|void> => {
	if (!user.value.password || passwordCompromised.value || v$.value.password.$invalid) return;
	// eslint-disable-next-line require-atomic-updates
	passwordCompromised.value = await passwordCheck(user.value.password);
	if (passwordCompromised.value) errorMessages.value.password = 'unsafe password';
	return passwordCompromised.value ? true : false;

};
// /*
// ** Instead of v-model, use this to change the value, and also touch the $v object
// * @param {String} model - current model/textfield name
// * @param {any} value - current values of the model
// * */
// const valueTouch = (model: 'password', value: string): void => {
// 	user.value[model] = value?.trim();
// 	v$?.value[model]?.$touch();
// };

const router = useRouter();

const submit = async (): Promise<void> => {
	if (v$.value.$invalid || !resetId.value || tokenDisabled.value) return;
	localLoading.value = true;
	passwordVisible.value = false;
	const compromisedPassword = await hibpCheck();
	if (compromisedPassword) {
		localLoading.value = false;
		return;
	}
	const response = await axios_incognito.reset_patch({ resetId: resetId.value, password: user.value.password, token: user.value.token? user.value.token:undefined });
	localLoading.value = false;
	if (response) {
		router.push(FrontEndRoutes.BASE);
		snackSuccess({ message: 'Password changed - please log in to continue', timeout: 20000 });
	}
	else {
		if (two_fa_enabled.value) {
			const m = 'Invalid password or token';
			errorMessages.value.token = m;
			errorMessages.value.password = m;
		}
		else {
			errorMessages.value.password = 'Invalid password';
		}
	}
};

const rules = {
	password: {
		required,
		min: minLength(minPassLength)
	},
};
const v$ = useVuelidate(rules, user);

watch(passwordCompromised, (i: boolean): void => {
	if (i) errorMessages.value.password = '';
});
watch(() => user.value.token, (): void => {
	errorMessages.value.token = '';
});
watch(() => user.value.password, (_) => {
	passwordCompromised.value = false;
	errorMessages.value.password = '';
	if (user.value.password) passwordVisible.value = false;
	if (!v$.value.$invalid && !passwordCompromised.value) {
		errorMessages.value.password = '';
		return;
	}
	if (!v$.value.$dirty) return;
	if (!v$.value.$invalid) {
		errorMessages.value.password = 'invalid password';
		return;
	}

	if (!v$.value.minLen) {
		errorMessages.value.password = `${minPassLength} characters minimum`;
		return;
	}
	if (!v$.value.required) {
		errorMessages.value.password = 'a password is required';
		return;
	}
});
</script>