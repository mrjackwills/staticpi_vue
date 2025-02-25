<template>
	<AppCard
		heading =''
		my=''
		xl='8'
		lg='8'
		sm='11'
		
	>
		<template v-slot:body>
			<v-row class='' align='center' justify='center' no-gutters id='add-device'>
				<v-col cols='12' md='auto' class='text-h4 text-primary'>
					Add New Device
				</v-col>
			</v-row>
			<v-row align='center' justify='center' class='ma-0 pa-0'>
				<v-col cols='12' class='pb-0'>
					<v-form
						v-on:submit.prevent
						autocomplete='one-time-code'
					>
						<v-row align='center' justify='center' no-gutters>
							<v-col cols='12'>
								<v-text-field
									v-model='deviceSettings.name'
									@keydown.enter='addNewDevice'
									:prepend-inner-icon='mdiDevices'
									:density='smAndDown?"compact":"default"'
									:disabled='localLoading || isFreeUser'
									:error-messages='deviceError'
									:label='label'
									autocomplete='new-password'
									maxlength='64'
									type='text'
									color='primary'
									clearable
									counter
									variant='outlined'
									validate-on-blur
								/>
								<v-tooltip v-if='show_tooltip && isFreeUser' activator='parent' location='top center' content-class='tooltip'>
									<span> Customisable name are not available to free users</span>
								</v-tooltip>
							</v-col>
							<v-col cols='12'  class='my-n3' v-if='!isFreeUser'>
								<v-row class='' align='center' justify='start'>
									<v-col cols='12' md='auto' class='text-body-1 mb-3'>
										Device names are optional, and can up to 64 characters in length
										<br>
										If a device name is not chosen, one will be randomly assigned.
									</v-col>
								</v-row>
							</v-col>
							<v-col cols='12' class='mb-n4'>
								<SwitchRow
									@update:model-value='max_clientsInput'
									@switched='max_clientsSwitch'
									:description='max_clientsDescription'
									:disabled='localLoading || isFreeUser'
									:error-messages='deviceClientError'
									heading='Max Clients'
									component='MaxClients'
								/>
							</v-col>
							<v-col cols='12' class='mb-n4'>
								<SwitchRow
									@client_passwordInput='client_passwordInput'
									@device_passwordInput='device_passwordInput'
									@switched='passwordSwitch'
									:description='passwordDescription'
									:disabled='localLoading || isFreeUser'
									heading='Device Password'
									:to='"connect-with-password"'
									component='DevicePassword'
								/>
							</v-col>
							<v-col cols='12' class=''>
								<SwitchRow
									@switched='structuredSwitch'
									:description='structuredDescription'
									:disabled='localLoading || isFreeUser'
									:to='"structured-data"'
									component='StructuredData'
									heading='Structured data'
								/>
							</v-col>
						</v-row>
						
					</v-form>
				</v-col>
			</v-row>
			<v-row align='center' justify='center' class='ma-0 pa-0 mt-2'>
				<v-col cols='6' class=''>
					<ActionButton
						v-model:disabled='localLoading'
						color='pi'
						text='cancel'
						:icon='mdiClose'
						:iconFirst='true'
						:block='true'
						@click='cancel'
					/>
				</v-col>
				<v-col cols='6' class=''>
					<ActionButton
						v-model:disabled='disabled'
						color='primary'
						text='create'
						:block='true'
						:icon='mdiCheck '
						@click='addNewDevice'
					/>
				</v-col>

			</v-row>
			<v-row class='ma-0 pa-0' align='center' justify='center' v-if='!isFreeUser'>
				<v-col cols='12' md='auto' class='text-center text-body-1 unselectable'>
					All device settings can be modified after creation
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { mdiClose, mdiDevices, mdiCheck } from '@mdi/js';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import type { TAddDevice } from '@/types';

const { smAndDown, mobile } = useDisplay();
const [ deviceStore, userStore ] = [ deviceModule(), userModule() ];

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && mobile.value);
});

const disabled = computed((): boolean => {
	return localLoading.value
		|| !deviceSettings.value.max_clients
		|| deviceError.value
		|| deviceClientError.value
		|| switchStatus.value.max_clients && isNaN(deviceSettings.value.max_clients)
		|| switchStatus.value.device_password && !deviceSettings.value.device_password
		|| deviceSettings.value.max_clients > max_clients.value
		? true : false;
});
const isFreeUser = computed((): boolean => {
	return userStore.isFreeUser;
});
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});
const label = computed((): string =>{
	return isFreeUser.value ? 'device name will be randomly assigned' : 'device name (optional)';
});
const max_clientsDescription = computed((): string => {
	return isFreeUser.value ? 'Free users are only allowed 1 connected client per device' :
		`Limit the number of simultaneous client connections to the device. The maximum allowed is ${max_clients.value}`;
});
const passwordDescription = computed((): string => {
	return isFreeUser.value ?
		'Device password authentication is not available for free user' :
		'Device passwords are optional, when enabled they require a request to be made to our authentication api in order for the websocket connection to be established';
});
const structuredDescription = computed((): string => {
	return isFreeUser.value ? 'Structured data and message caching is not available to free user' : 'Enable structured data and message caching';
});
const max_clients = computed((): number => {
	return userStore.maxClients;
});

const deviceError = ref('');
const deviceClientError = ref('');
const deviceSettings: Ref<TAddDevice> = ref({
	name: undefined as undefined | '',
	device_password: undefined as undefined | '',
	client_password: undefined as undefined | '',
	max_clients: 1,
	structured_data: false
});
const switchStatus = ref({
	device_password: false,
	client_password: false,
	max_clients: false,
	structured_data: false
});
const localLoading = ref(false);

const emit = defineEmits([ 'refresh', 'show-add-new-device' ]);

const addNewDevice = async (): Promise<void> => {
	if (disabled.value) return;
	if (deviceStore.numberOfDevices === userStore.maxDevices) return;
	localLoading.value = true;
	loading.value = true;
	if (deviceSettings.value.device_password === '') {
		deviceSettings.value.device_password = undefined;
		deviceSettings.value.client_password = undefined;
	}
	const response = await axios_device.deviceAdd_post(deviceSettings.value);
	if (response) snackSuccess({ message: `New device added: ${response}` });
	emit('refresh');
	cancel();
	localLoading.value = false;
	loading.value = false;
};

const cancel = (): void => {
	emit('show-add-new-device');
};

const max_clientsInput = (i: string): void => {
	const num = Number(i);
	if (num > max_clients.value || num <= 0 || !Number.isInteger(num)) {
		deviceClientError.value = 'invalid input';
		deviceSettings.value.max_clients = 1;
		return;
	}
	if (!num && !switchStatus.value.max_clients) deviceSettings.value.max_clients = Math.ceil(max_clients.value / 2);
	else {
		deviceSettings.value.max_clients = num;
		deviceClientError.value = '';
	}
};

const device_passwordInput = (i: string): void => {
	deviceSettings.value.device_password = i;
};
		
const client_passwordInput = (i: string): void => {
	deviceSettings.value.client_password = i;
};

const max_clientsSwitch = (i: boolean): void => {
	switchStatus.value.max_clients = i;
	if (!i) deviceSettings.value.max_clients = Math.ceil(max_clients.value / 2);
};
		
const passwordSwitch = (i: boolean): void => {
	switchStatus.value.device_password = i;
	if (!i) {
		deviceSettings.value.device_password = '';
		deviceSettings.value.client_password = '';
	}
};

const structuredSwitch = (i: boolean): void => {
	switchStatus.value.structured_data = i;
	deviceSettings.value.structured_data = i;
};

onMounted(() => {
	document.getElementById('add-device')?.scrollIntoView({ behavior: 'smooth' });
	if (!isFreeUser.value) deviceSettings.value.max_clients = Math.ceil(max_clients.value / 2);
});

watch(() => deviceSettings.value.name, (i): void => {
	if (!i) {
		deviceError.value = '';
		return;
	}
	deviceSettings.value.name = i.toLowerCase();
	if (i.length === 0 || i.length > 64) {
		deviceError.value = 'invalid characters';
		return;
	}
	const nameExists = deviceStore.name_exists(i);
	if (nameExists) {
		deviceError.value = 'device name already in use';
		return;
	}
	deviceError.value = '';
});

</script>