<template>
	<v-row align='center' :justify='justify' class='no-gutters pa-0 ma-0' >

		<v-col cols='12' md='8' class='ma-0 pa-0'>
			<v-expand-transition>
				<section v-if='showTextField'>
					<v-form v-on:submit.prevent autocomplete='off'>
						<v-row align='center' justify='center' no-gutters class='pt-1 mb-n3 ma-0 pa-0'>
							<v-col cols='12' class='ma-0 pa-0 pa-1'>
								<v-text-field
									v-for='(item, index) in textFields'
									v-model='deviceSetting[item.model]'
									@click:append-inner='visible(item.model)'
									@keydown.enter='addPassword'
									:append-inner-icon='item.appendIcon'
									:autocomplete='item.autocomplete'
									:disabled='loading'
									:key='index'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									:type='item.type'
									class='mb-n3 ma-0 pa-0'
									color='primary'
									density='compact'
									required
								/>
							</v-col>
						</v-row>
					
						<v-row align='center' justify='center'  class='ma-0 pa-0'>
							<v-col
								v-for='(item, index) in buttons'
								:key='index'
								cols='auto'
								class='ma-0 pa-0 mx-2'
							>
								<v-btn
									@click='item.click'
									:class='item.class'
									:disabled='item.disabled'
									class='fab-fix'
									icon
									variant='text'
									size='x-small'
								>
									<v-icon :color='item.color' :icon='item.icon' />
								</v-btn>
							</v-col>
						</v-row>

						<v-row align='center' justify='center'  class='ma-0 pa-0'>
							<v-col cols='auto' class='ma-0 pa-0'>
								<v-switch
									v-model='password_synced'
									color='primary'
									:hide-details='true'
									class='ma-0 pa-0'
									density='compact'
									label='single password'
								/>
							</v-col>
							
						</v-row>
					</v-form>
				</section>
			</v-expand-transition>
			<v-expand-transition>

				<section v-if='!showTextField'>
					<v-row :justify='justify' >
						<v-tooltip v-if='show_tooltip && freeUser' activator='parent' location='top center' content-class='tooltip'>
							<span >Password authentication is not available for free user</span>
						</v-tooltip>
						<v-col cols='auto'>
							<FabTooltip
								v-if='device_password'
								@click='removePassword'
								:disabled='disabled'
								:icon='mdiLockRemove'
								color='pi'
								tooltip_text='Remove password'
							/>
						
							<FabTooltip
								@click='showTextField = true'
								v-if='!device_password'
								:disabled='disabled'
								:icon='mdiLockPlus'
								:tooltip_text='`Add password to ${name_of_device}`'
								color='primary'
							/>
						</v-col>
					</v-row>
				</section>
			</v-expand-transition>
			
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiClose, mdiContentSave, mdiLock, mdiLockPlus, mdiLockRemove, mdiDelete, mdiEye, mdiEyeOff } from '@mdi/js';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import type { TAuthObject, TChangeDevicePassword, TDeviceTableFields, TDeviceInfo } from '@/types';
import type { VRow } from 'vuetify/components/VGrid';

const { mdAndUp, mobile } = useDisplay();

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && mobile.value);
});

const buttons = computed((): Array<TDeviceTableFields> => {
	return [
		{
			click: clear,
			color: 'pi',
			icon: mdiClose,
			disabled: disabled.value,
		},
		{
			class: disabled.value ? '' : 'heartbeat',
			click: addPassword,
			color: 'primary',
			disabled: disabled.value || !deviceSetting.value.device_password,
			icon: mdiContentSave,
		}
	];
});
const disabled = computed((): boolean => {
	return freeUser.value || paused.value || localLoading.value;
});

const justify = computed((): VRow['$props']['justify'] =>{
	return mdAndUp.value ? 'center' : 'end';
});

const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});
const textFields = computed((): Array<TChangeDevicePassword> => {
			
	const output: Array<TChangeDevicePassword> = [
		{
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'device password',
			model: 'device_password' as const,
			type: device_passwordVisible.value? 'text' : 'password',
			appendIcon: device_passwordVisible.value ? mdiEyeOff : mdiEye,
		},
	];

	if (!password_synced.value) {
		output.push({
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'client password',
			model: 'client_password' as const,
			type: client_passwordVisible.value? 'text' : 'password',
			appendIcon: client_passwordVisible.value ? mdiEyeOff : mdiEye,
		});

	}

	return output;
			
});
const freeUser = computed((): boolean => {
	return userModule().isFreeUser;
});
const device_password = computed((): boolean => {
	return props.device.device_password_required;
});
const paused = computed((): boolean => {
	return props.device.paused;
});
const name_of_device = computed((): string => {
	return props.device.name_of_device;
});

const password_synced = ref(true);
const inFocus = ref(false);
const localLoading = ref(false);
const client_passwordVisible = ref(false);
const device_passwordVisible = ref(false);
const deviceSetting = ref({
	device_password: '',
	client_password: '',
});
const showTextField = ref(false);

const clear = (): void => {
	deviceSetting.value.client_password = '';
	deviceSetting.value.device_password = '';
	password_synced.value = true;
	inFocus.value = false;
	showTextField.value = false;
};

const emit = defineEmits([ 'refresh' ]);
const removePassword_confirm = async (authentication: TAuthObject): Promise<void> =>{
	loading.value = true;
	localLoading.value = true;
	const response = await axios_device.password_delete({ name: name_of_device.value, authentication });
	loading.value = false;
	localLoading.value = false;
	if (response) {
		snackSuccess({ message: `Password removed from: ${name_of_device.value}`, icon: mdiDelete });
		emit('refresh');
		inFocus.value = false;
	}
};
const addPassword = (): void => {
	client_passwordVisible.value = false;
	device_passwordVisible.value = false;
	dialoger({
		message: `Add password to device "${name_of_device.value}"`,
		passwordrequired: false,
		timeout: 5,
		buttonText: 'confirm',
		title: 'Add Password',
		confirmMethod: addPassword_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: false,
	});
};
const addPassword_confirm = async (): Promise<void> => {
	if (!deviceSetting.value.device_password) return;
	if (password_synced.value && !deviceSetting.value.device_password || !password_synced.value && !deviceSetting.value.client_password) return;
	client_passwordVisible.value = false;
	device_passwordVisible.value = false;
	loading.value = true;
	localLoading.value = true;
	if (password_synced.value) {
		deviceSetting.value.client_password = deviceSetting.value.device_password;
	}
	const response = await axios_device.password_patch({ device_password: deviceSetting.value.device_password, client_password: deviceSetting.value.client_password, name: name_of_device.value });
	loading.value = false;
	localLoading.value = false;
	if (response) {
		snackSuccess({ message: `Password added to device: ${name_of_device.value}`, icon: mdiContentSave });
		emit('refresh');
		clear();
	}
};

const visible = (model: 'client_password'|'device_password'):void => {
	if (model === 'client_password') {
		client_passwordVisible.value = !client_passwordVisible.value;
	} else {
		device_passwordVisible.value = !device_passwordVisible.value;
	}
};

const removePassword = (): void =>{
	if (disabled.value) return;
	dialoger({
		message: `Remove password from device "${name_of_device.value}"`,
		passwordrequired: true,
		buttonText: 'confirm',
		title: 'Remove Password',
		confirmMethod: removePassword_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: false,
	});
};

const props = defineProps<{device: TDeviceInfo}>();

watch(paused, (i: boolean): void => {
	if (i) {
		inFocus.value = false;
	}
});
</script>