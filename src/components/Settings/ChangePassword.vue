<template>
	<SettingSection :disabled='componentDisabled'>
		<template v-slot:titleIcon>
			<v-icon color='pi' class='mr-2' :size='smAndDown ? "small" : "default"' :icon='mdiLockCheck' />
		</template>

		<template v-slot:title>
			<span  >Password</span>
		</template>

		<template v-slot:text_description>
			<PasswordDescription />
		</template>

		<template v-slot:action_button>
			<v-expand-transition>
				<v-row v-if='!showTextFields' align='center' justify='center' class='ma-0 pa-0'>
					<v-col cols='12' md='auto' class='ma-0 pa-0'>
						<ActionButton @click='showField' :block='true' :icon='mdiLockReset' small
							text='change password' />
					</v-col>
				</v-row>
			</v-expand-transition>
		</template>

		<template v-slot:body>
			<v-expand-transition>
				<section v-if='showTextFields'>
					<v-row class='ma-0 pa-0 mt-3' align='center' justify='center'>
						<v-col cols='12' md='8' class='ma-0 pa-0'>
							<v-form v-on:submit.prevent>
								<section v-for='(item, index) in textFields' :key='index'>
									<v-text-field v-model='user[item.model]'
										@click:append-inner='appendClick(item.model)' @focus='focusMethod(item.model)'
										@keydown.enter='submit' @update:model-value='v$[item.model]?.$touch()'
										:append-inner-icon='item.appendIcon' :autocomplete='item.autocomplete'
										:class='{ "mb-n6": passwordCompromised && index === 1 }' :disabled='loading'
										:density='smAndDown ? "compact" : "default"'
										:error-messages='errorMessages[item.model]'
										:error='errorMessages[item.model] ? true : false' :label='item.label'
										:prepend-inner-icon='item.icon' :type='item.type' color='primary'
										variant='outlined' required />
									<section v-if='index === 1'>
										<v-expand-transition>
											<PasswordStrength v-if='!passwordCompromised && user.new_password'
												v-model:password='user.new_password'
												v-model:errorMessage='errorMessages.new_password'
												v-model:passwordCompromised='passwordCompromised' />
										</v-expand-transition>
										<v-expand-transition>
											<v-expand-transition>
												<HibpMessage v-if='passwordCompromised' />
											</v-expand-transition>
										</v-expand-transition>
									</section>
								</section>
								<section v-if='twoFA_always_required'>
									<v-text-field v-for='item in tokenFields' v-model='user[item.model]'
										v-on:keyup.enter='submit' @focus='focusMethod(item.model)'
										:density='smAndDown ? "compact" : "default"'
										:error-messages='errorMessages[item.model]' :key='item.model'
										:label='item.label' :prepend-inner-icon='item.icon' color='primary'
										variant='outlined' required />
								</section>
								<v-row class='ma-0 pa-0 mb-2' align='center' justify='center'>
									<v-col class='ma-0 pa-0' cols='auto'>
										<v-checkbox v-model='user.remove_sessions' color=''
											density='compact' hide-details :disabled='loading'>
											<template v-slot:label>
												<span class='text-body-2'>remove other sessions</span>
											</template>
										</v-checkbox>
									</v-col>
								</v-row>
							</v-form>
						</v-col>
					</v-row>
				</section>
			</v-expand-transition>
		</template>
		<template v-slot:cancel_button v-if='showTextFields'>

			<ActionButton @click='cancel' v-model:disabled='loading' :icon='mdiClose'
				:iconFirst='true' :block='true' :small='true' color='pi' text='cancel' />
		</template>
		<template v-slot:save_button v-if='showTextFields'>
			<ActionButton @click='submit' v-model:disabled='disabled' :icon='mdiSend' :block='true' :small='true'
				text='change' />
		</template>
	</SettingSection>
</template>

<script setup lang='ts'>

import { axios_authenticatedUser } from '@/services/axios';
import { minPassLength } from '@/vanillaTS/globalConst';
import { passwordCheck } from '@/vanillaTS/hibp';
import { required, minLength } from '@vuelidate/validators';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import type { TChangeUserPassword } from '@/types';
import useVuelidate from '@vuelidate/core';
import {
	mdiCellphoneInformation,
	mdiClose,
	mdiEye,
	mdiEyeOff,
	mdiLock,
	mdiLockOpen,
	mdiLockReset,
	mdiLockCheck,
	mdiSend
} from '@mdi/js';

const { smAndDown } = useDisplay();

const [settingSectionStore] = [settingSectionModule()];

onBeforeUnmount(() => {
	showTextFields.value = false;
});

onBeforeMount(() => {
	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'changepassword') {
		showTextFields.value = true;
		settingSectionStore.set_beforemount_open(false);
	}
});

const disabled = computed(() => v$.value.$invalid ||
  errorMessages.value.new_password ||
  errorMessages.value.current_password ||
  passwordCompromised.value ||
  loading.value ||
  twoFA_always_required.value && !user.value.token ||
  twoFA_always_required.value && user.value.token.length < 6
	? true
	: false);

const componentDisabled = computed(() => settingSectionStore.current_section && settingSectionStore.current_section !== 'changepassword' ? true : false);

const email = computed(() => userModule().email);
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const textFields = computed((): Array<TChangeUserPassword> => [
	{
		autocomplete: 'password',
		icon: mdiLockOpen,
		label: 'current password',
		model: 'current_password' as const,
		type: passwordVisible.value ? 'text' : 'password',
		appendIcon: passwordVisible.value ? mdiEyeOff : mdiEye
	},
	{
		autocomplete: 'one-time-code',
		icon: mdiLock,
		label: 'new password',
		model: 'new_password' as const,
		type: new_passwordVisible.value ? 'text' : 'password',
		appendIcon: new_passwordVisible.value ? mdiEyeOff : mdiEye
	}
]);

const twoFA_always_required = computed(() => twoFAModule().always_required);

const errorMessages = ref({
	new_password: '',
	current_password: '',
	token: ''
});
const new_passwordVisible = ref(false);
const passwordCompromised = ref(false);
const passwordVisible = ref(false);
const showTextFields = ref(false);
const tokenFields = ref([
	{
		clearable: true,
		icon: mdiCellphoneInformation,
		label: '2FA code',
		model: 'token' as const
	}
]);
const user = ref({
	new_password: '',
	current_password: '',
	token: '',
	remove_sessions: false
});

/**
 ** Set the password field visible
 *
 */
const appendClick = (model: string): void => {
	if (model === 'current_password') passwordVisible.value = !passwordVisible.value;
	else if (model === 'new_password') new_passwordVisible.value = !new_passwordVisible.value;
};

/**
 ** Reset data, clear form
 */
const cancel = (): void => {
	errorMessages.value.current_password = '';
	errorMessages.value.new_password = '';
	showTextFields.value = false;
	passwordVisible.value = false;
	new_passwordVisible.value = false;
	user.value.new_password = '';
	user.value.current_password = '';
	user.value.token = '';
	v$?.value.$reset();
	settingSectionStore.set_current_section(undefined);
};

/**
 ** set the this.focus to the currently in focus text field
 ** If the in focus field ISN't the password field, then set passwordVisible to false
 * @param {String} model - current model/textfield name
 */
const focusMethod = (model: string): void => {
	if (model === 'new_password') new_passwordVisible.value = false;
	if (model === 'current_password') passwordVisible.value = false;
	else {
		new_passwordVisible.value = false;
		passwordVisible.value = false;
	}
};

const showField = (): void => {
	showTextFields.value = true;
	settingSectionStore.set_current_section('changepassword');
};

const submit = async (): Promise<void> => {
	if (v$.value.$invalid || passwordCompromised.value || errorMessages.value.new_password || errorMessages.value.current_password || loading.value) return;
	if (disabled.value) return;
	loading.value = true;
	new_passwordVisible.value = false;
	passwordVisible.value = false;

	passwordCompromised.value = await passwordCheck(user.value.new_password);
	if (passwordCompromised.value) {
		errorMessages.value.new_password = 'unsafe password';
		loading.value = false;
		return;
	}
	const response = await axios_authenticatedUser.password_patch({
		current_password: user.value.current_password,
		token: user.value.token ? user.value.token : undefined,
		new_password: user.value.new_password,
		remove_sessions: user.value.remove_sessions
	});

	loading.value = false;
	if (response) {
		snackSuccess({ message: 'Password changed' });
		cancel();
	} else {
		errorMessages.value.current_password = twoFA_always_required.value ? 'password and/or token invalid' : 'incorrect password';
		errorMessages.value.token = twoFA_always_required.value ? 'password and/or token invalid' : '';
	}
};

/**
 ** common watcher method, for new and current password watcher
 */
const watch_password_common = (): void => {
	const i = user.value.new_password;
	if (user.value.current_password && i?.includes(user.value.current_password)) {
		errorMessages.value.new_password = 'new password cannot contain current password';
		return;
	}

	if (!user.value.new_password) {
		v$.value.new_password?.$reset();
		new_passwordVisible.value = false;
	}

	if (email.value && i?.toLowerCase().includes(email.value.toLowerCase().trim()) ||
	  email.value && i?.toLowerCase().includes(email.value.toLowerCase().trim())) {
		errorMessages.value.new_password = 'password cannot contain email';
		return;
	}

	if (!v$?.value.new_password?.$invalid && !passwordCompromised.value) {
		errorMessages.value.new_password = '';
		return;
	}

	if (!v$?.value.new_password?.$dirty) return;

	if (!v$?.value.new_password?.required) {
		errorMessages.value.new_password = 'a password is required';
		return;
	}

	if (!v$.value.new_password.minLen) {
		errorMessages.value.new_password = `${minPassLength} characters minimum`;
		return;
	}
};

const rules = {
	current_password: { required },
	new_password: {
		required,
		min: minLength(minPassLength)
	}
};
const v$ = useVuelidate(rules, user);
watch(passwordCompromised, (i): void => {
	if (i) errorMessages.value.new_password = '';
});

watch(() => user.value.current_password, (_) => {
	passwordCompromised.value = false;
	errorMessages.value.current_password = '';
	watch_password_common();
});

watch(() => user.value.new_password, (_) => {
	passwordCompromised.value = false;
	errorMessages.value.new_password = '';
	watch_password_common();
});

</script>
