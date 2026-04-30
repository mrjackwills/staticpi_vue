<template>
	<AppCard
		heading=''
		lg='8'
		my=''
		sm='11'
		xl='8'
	>
		<template #body>
			<v-row
				id='add-device'
				class='align-center justify-center'
				density='compact'
			>
				<v-col class='text-headline-large text-primary' cols='12' md='auto'>
					Add New Device
				</v-col>
			</v-row>

			<v-row class='align-center ma-0 pa-0 justify-center'>
				<v-col class='pb-0' cols='12'>
					<v-form autocomplete='one-time-code' @submit.prevent>
						<v-row class='align-center justify-center' density='compact'>
							<v-col cols='12'>
								<v-text-field
									v-model='deviceSettings.name'
									autocomplete='new-password'
									clearable
									color='primary'
									counter
									:density='smAndDown ? "compact" : "default"'
									:disabled='localLoading || isFreeUser'
									:error-messages='deviceError'
									:label
									maxlength='64'
									:prepend-inner-icon='mdiDevices'
									type='text'
									validate-on-blur
									variant='outlined'
									@keydown.enter='addNewDevice'
								/>

								<v-tooltip
									v-if='show_tooltip && isFreeUser'
									activator='parent'
									content-class='tooltip'
									location='top center'
								>
									<span> Customisable name are not available to free users</span>
								</v-tooltip>
							</v-col>

							<v-col v-if='!isFreeUser' class='my-n3' cols='12'>
								<v-row class='align-center justify-start'>
									<v-col class='text-body-large mb-3' cols='12' md='auto'>
										Device names are optional, and can up to 64 characters in length
										<br>
										If a device name is not chosen, one will be randomly assigned.
									</v-col>
								</v-row>
							</v-col>

							<v-col class='mb-n4' cols='12'>
								<SwitchRow
									component='MaxClients'
									:description='max_clientsDescription'
									:disabled='localLoading || isFreeUser'
									:error-messages='deviceClientError'
									heading='Max Clients'
									@input='max_clientsInput'
									@switched='max_clientsSwitch'
								/>
							</v-col>

							<v-col class='mb-n4' cols='12'>
								<SwitchRow
									component='DevicePassword'
									:description='passwordDescription'
									:disabled='localLoading || isFreeUser'
									heading='Device Password'
									:to='"connect-with-password"'
									@client-password-input='client_passwordInput'
									@device-password-input='device_passwordInput'
									@switched='passwordSwitch'
								/>
							</v-col>

							<v-col class='' cols='12'>
								<SwitchRow
									component='StructuredData'
									:description='structuredDescription'
									:disabled='localLoading || isFreeUser'
									heading='Structured data'
									:to='"structured-data"'
									@switched='structuredSwitch'
								/>
							</v-col>
						</v-row>

					</v-form>
				</v-col>
			</v-row>

			<v-row class='align-center ma-0 pa-0 mt-2 justify-center'>
				<v-col class='' cols='6'>
					<ActionButton
						v-model:disabled='localLoading'
						:block='true'
						color='pi'
						:icon='mdiClose'
						:icon-first='true'
						text='cancel'
						@click='cancel'
					/>
				</v-col>

				<v-col class='' cols='6'>
					<ActionButton
						:block='true'
						color='primary'
						:disabled
						:icon='mdiCheck'
						text='create'
						@click='addNewDevice'
					/>
				</v-col>

			</v-row>

			<v-row v-if='!isFreeUser' class='align-center ma-0 pa-0 justify-center'>
				<v-col class='text-center text-body-large unselectable' cols='12' md='auto'>
					All device settings can be modified after creation
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang='ts'>
import type { TAddDevice } from '@/types'
import { mdiCheck, mdiClose, mdiDevices } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { fetch_device } from '@/services/fetch'
import { snackSuccess } from '@/services/snack'

const { smAndDown, mobile } = useDisplay()
const [deviceStore, userStore] = [deviceModule(), userModule()]

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))

const disabled = computed(() => localLoading.value
  || !deviceSettings.value.max_clients
  || deviceError.value
  || deviceClientError.value
  || (switchStatus.value.max_clients && Number.isNaN(deviceSettings.value.max_clients))
  || (switchStatus.value.device_password && !deviceSettings.value.device_password)
  || deviceSettings.value.max_clients > max_clients.value
	? true
	: false)
const isFreeUser = computed(() => userStore.isFreeUser)
const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})
const label = computed(() => isFreeUser.value ? 'device name will be randomly assigned' : 'device name (optional)')
const max_clientsDescription = computed(() => isFreeUser.value
	? 'Free users are only allowed 1 connected client per device'
	: `Limit the number of simultaneous client connections to the device. The maximum allowed is ${max_clients.value}`)
const passwordDescription = computed(() => isFreeUser.value
	? 'Device password authentication is not available for free user'
	: 'Device passwords are optional, when enabled they require a request to be made to our authentication api in order for the websocket connection to be established')
const structuredDescription = computed(() => isFreeUser.value ? 'Structured data and message caching is not available to free user' : 'Enable structured data and message caching')
const max_clients = computed(() => userStore.maxClients)

const deviceError = ref('')
const deviceClientError = ref('')
const deviceSettings: Ref<TAddDevice> = ref({
	name: undefined as undefined | '',
	device_password: undefined as undefined | '',
	client_password: undefined as undefined | '',
	max_clients: 1,
	structured_data: false,
})
const switchStatus = ref({
	device_password: false,
	client_password: false,
	max_clients: false,
	structured_data: false,
})

const localLoading = ref(false)

const emit = defineEmits(['refresh', 'show-add-new-device'])

async function addNewDevice (): Promise<void> {
	if (disabled.value) return
	if (deviceStore.numberOfDevices === userStore.maxDevices) return
	localLoading.value = true
	loading.value = true
	if (deviceSettings.value.device_password === '') {
		deviceSettings.value.device_password = undefined
		deviceSettings.value.client_password = undefined
	}
	const response = await fetch_device.deviceAdd_post(deviceSettings.value)
	if (response) snackSuccess({ message: `New device added: ${response}` })
	emit('refresh')
	cancel()
	localLoading.value = false
	loading.value = false
}

function cancel (): void {
	emit('show-add-new-device')
}

function max_clientsInput (i: string): void {
	const num = Number(i)
	if (num > max_clients.value || num <= 0 || !Number.isInteger(num)) {
		deviceClientError.value = 'invalid input'
		deviceSettings.value.max_clients = 1
		return
	}
	if (!num && !switchStatus.value.max_clients) deviceSettings.value.max_clients = Math.ceil(max_clients.value / 2)
	else {
		deviceSettings.value.max_clients = num
		deviceClientError.value = ''
	}
}

function device_passwordInput (i: string): void {
	deviceSettings.value.device_password = i
}

function client_passwordInput (i: string): void {
	deviceSettings.value.client_password = i
}

function max_clientsSwitch (i: boolean): void {
	switchStatus.value.max_clients = i
	if (!i) deviceSettings.value.max_clients = Math.ceil(max_clients.value / 2)
}

function passwordSwitch (i: boolean): void {
	switchStatus.value.device_password = i
	if (!i) {
		deviceSettings.value.device_password = ''
		deviceSettings.value.client_password = ''
	}
}

function structuredSwitch (i: boolean): void {
	switchStatus.value.structured_data = i
	deviceSettings.value.structured_data = i
}

onMounted(() => {
	document.querySelector('#add-device')?.scrollIntoView({ behavior: 'smooth' })
	if (!isFreeUser.value) deviceSettings.value.max_clients = Math.ceil(max_clients.value / 2)
})

watch(() => deviceSettings.value.name, (i): void => {
	if (!i) {
		deviceError.value = ''
		return
	}
	deviceSettings.value.name = i.toLowerCase()
	if (i.length === 0 || i.length > 64) {
		deviceError.value = 'invalid characters'
		return
	}
	const nameExists = deviceStore.name_exists(i)
	if (nameExists) {
		deviceError.value = 'device name already in use'
		return
	}

	deviceError.value = ''
})

</script>
