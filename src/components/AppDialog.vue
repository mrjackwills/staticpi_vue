<template>
	<v-dialog
		v-model='visible'
		:max-width='maxWidth'
		scroll-strategy='none'
		width='100%'
		eager
		persistent
	>
		<v-card v-intersect='onIntersect'>
			<v-progress-linear
				:active='loading'
				:indeterminate='loading'
				color='primary'
				width='100%'
				absolute
			/>
			<v-card-title class='pa-0 ma-0 px-4 py-2 text-pi' :class='titleSize'>{{ title }}</v-card-title>
			<v-card-text class='px-4 py-2' :class='messageSize'>{{ message }}</v-card-text>
			<section v-if='passwordRequired || twoFA_always_required'>
				<v-row align='center' justify='center' class='ma-0 pa-0 mt-2'>
					<v-col cols='11' md='9'  class='ma-0 pa-0'>
						<v-form
							v-on:submit.prevent
							autocomplete='off'
						>
							<template v-if='passwordRequired'>
								<v-text-field
									v-for='item in textFields'
									v-model='user[item.model]'
									@click:append-inner='passwordVisible = !passwordVisible'
									@keydown.enter='click'
									@focus='focusMethod(item.model)'
									:append-inner-icon='item.appendIcon'
									:autocomplete='item.autocomplete'
									:density='density'
									:disabled='loading'
									:key='item.model'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									:type='item.type'
									class='mb-n3'
									color='primary'
									variant='outlined'
									required
								/>
							</template>
							<template v-if='passwordRequired && twoFA_always_required'>
								<v-text-field
									v-for='item in tokenFields'
									v-model='user[item.model]'
									@focus='focusMethod(item.model)'
									:error-messages='tokenError'
									v-on:keyup.enter='click'
									:density='density'
									:key='item.model'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									color='primary'
									variant='outlined'
									required
								/>
							</template>
						</v-form>
					</v-col>
				</v-row>
			</section>
			<v-card-actions class='ma-0 pa-0 py-3' v-if='message'>
				<v-row align='center' justify='center' class='ma-0 pa-0 mt-2'>
					<v-col cols='11' md='9' lg='6' class='ma-0 pa-0'>
						<v-row justify='space-between' class='px-0 mx-0' >
							<v-col cols='12' md='auto' class='px-0 mx-0' :order='smAndDown? "2" : "1"'>
								<div class='text-center'>
									<ActionButton
										@click='cancel'
										:block='true'
										:disabled='loading'
										:icon='mdiClose'
										:iconFirst='true'
										:overrideDisabled='true'
										color='pi'
										text='cancel'
									/>
								</div>
							</v-col>
							<v-col cols='12' md='auto' class='px-0 mx-0' :order='smAndDown? "1" : "2"'>
								<div class='text-center'>
									<ActionButton
										@click='click'
										:block='true'
										v-model:disabled='disabled'
										v-model:icon='timeout_icon'
										:overrideDisabled='logout'
										v-model:text='timeout_text'
										:monospace='monospace'
										color='primary'
									/>
								</div>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang='ts'>
import { mdiCellphoneInformation, mdiCheck, mdiClose, mdiEyeOff, mdiEye, mdiLock, mdiTimerOutline } from '@mdi/js';
import { token_regex } from '@/vanillaTS/globalConst';
import { useDisplay } from 'vuetify';
import type { TConfirmMethod, TDialogFields, u } from '@/types';

const { lgAndUp, mdAndUp, smAndDown } = useDisplay();

const [ dialogStore, twoFAStore ] = [ dialogModule(), twoFAModule() ];
onBeforeUnmount(() => {
	clearTimeouts();
});

onMounted(() => {
	mountedTimeout();
});

const density = computed(() => {
	return smAndDown.value ? 'compact':'default';
});

const confirmMethod = computed((): u<TConfirmMethod> => {
	return dialogStore.confirmMethod;
});
const confirmButton = computed((): string => {
	return dialogStore.confirmButton ?? 'confirm';
});
const disabled = computed((): boolean => {
	return loading.value
		|| timeout.value
		|| tokenError.value
		|| passwordRequired.value && !user.value.password
		|| passwordRequired.value && twoFA_always_required.value && !user.value.token
		|| twoFA_always_required.value && passwordRequired.value && tokenLength.value < 6
		? true: false;
});
const icon = computed((): string|undefined => {
	return dialogStore.icon;
});
const logout = computed((): boolean => {
	return title.value.toLowerCase() === 'logout';
});
const maxWidth = computed((): string => {
	return lgAndUp.value? '40vw' : '80vw';
});
const message = computed((): string| undefined => {
	return dialogStore.message;
});
const messageSize = computed((): string => {
	return mdAndUp.value? 'text-h5' : 'text-subtitle-1';
});
const monospace = computed((): boolean => {
	return timeout.value > 0 ? true : false;
});
const passwordRequired = computed((): boolean => {
	return dialogStore.passwordRequired;
});
const textFields = computed((): Array<TDialogFields> =>{
	return [
		{
			appendIcon: passwordVisible.value ? mdiEyeOff : mdiEye,
			autocomplete: 'password',
			icon: mdiLock,
			label: 'user password',
			model: 'password' as const,
			type: passwordVisible.value ? 'text' : 'password',
		},
	];
});
const timeout = computed({
	get (): number {
		return dialogStore.timeout;
	},
	set (n: number): void {
		dialogStore.set_timeout(n);
	},
});
const timeout_text = computed((): string => {
	return timeout.value? `${String(timeout.value).padStart(2, '0')}` : passwordRequired.value && !user.value.password
		? 'password required ' : passwordRequired.value && twoFA_always_required.value && !user.value.token
			|| passwordRequired.value && twoFA_always_required.value && tokenError.value
			? 'token required' : confirmButton.value;
});
const timeout_icon = computed((): string => {
	return timeout.value ? mdiTimerOutline : passwordRequired.value && !user.value.password
		? mdiLock: passwordRequired.value && twoFA_always_required.value && !user.value.token
			|| passwordRequired.value && twoFA_always_required.value && tokenError.value ? mdiCellphoneInformation: icon.value
				? icon.value : mdiCheck;
});
const title = computed((): string => {
	return dialogStore.title ?? 'warning';
});
const titleSize = computed((): string => {
	return mdAndUp.value? 'text-h4' : 'text-h6';
});
const tokenLength = computed((): number => {
	return user.value.token ? user.value.token.length: 0;
});
const twoFA_always_required = computed((): boolean => {
	return twoFAStore.always_required || dialogStore.twoFARequired && twoFAStore.active;
});

const visible = computed({
	get (): boolean {
		return dialogStore.visible;
	},
	set (b: boolean): void {
		dialogStore.set_visible(b);
	}
});

const isIntersecting = ref(false);
const loading = ref(false);
const localDisabled = ref(false);
const passwordVisible = ref(false);
const timeoutInterval = ref(0);
const tokenError = ref('');
const tokenFields = [
	{
		clearable: true,
		icon: mdiCellphoneInformation,
		label: '2FA code',
		model: 'token' as const,
	}
];
const user = ref({
	password: '',
	token: undefined as string | undefined,
});

const cancel = (): void => {
	visible.value = false;
};

const clearTimeouts = (): void => {
	clearInterval(timeoutInterval.value);
	localDisabled.value = false;
	timeout.value = 0;
};

const click = async (): Promise<void> => {
	if (passwordRequired.value && !user.value.password || timeout.value > 0 || disabled.value || !confirmMethod.value) return;
	passwordVisible.value = false;
	visible.value = false;
	const data = {
		password: user.value.password,
		token: user.value.token,
	};
	await confirmMethod.value(data);
	dialogStore.$reset();
};

/**
** set the this.focus to the currently in focus text field
** If the in focus field ISN't the password field, then set passwordVisible to false
* @param {String} model - current model/textfield name
*/
const focusMethod = (model: string): void => {
	if (model !== 'password') passwordVisible.value = false;
};
/**
 ** When visible, set a timeout for the button, if params are met
 */
const mountedTimeout = (): void => {
	if (!isIntersecting.value) return ;
	if (!timeout.value) return;
	timeoutInterval.value = setInterval(() => {
		timeout.value = timeout.value > 0 ? timeout.value -= 1: timeout.value;
		if (timeout.value < 1) clearInterval(timeoutInterval.value);
	}, 1000);
};
/**
 ** update this.isIntersectin when visible & not
 */
const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};

watch(isIntersecting, (i: boolean): void => {
	if (i) return mountedTimeout();
	user.value.password = '';
	user.value.token = undefined;
	tokenError.value = '';
	clearTimeouts();
	dialogStore.$reset();
});

watch(() => user.value.token, (i) => {
	if (i) {
		if (!token_regex.test(i.replace(/\s/g, ''))) {
			tokenError.value = 'invalid token';
			return;
		} else {
			tokenError.value = '';
		}
	}
});
</script>
