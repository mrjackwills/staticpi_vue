<template>
	<v-row class='pa-0 ma-0 align-center' :class='justify' density='compact'>

		<v-col class='ma-0 pa-0' cols='12' md='8'>
			<v-expand-transition>
				<section v-if='showTextField'>
					<v-form autocomplete='off' @submit.prevent>
						<v-row class='align-center pt-1 mb-n3 ma-0 pa-0 justify-center' density='compact'>
							<v-col class='ma-0 pa-0 pa-1' cols='12'>
								<v-text-field
									v-for='(item, index) in textFields'
									:key='index'
									v-model='deviceSetting[item.model]'
									:append-inner-icon='item.appendIcon'
									:autocomplete='item.autocomplete'
									class='mb-n3 ma-0 pa-0'
									color='primary'
									density='compact'
									:disabled='loading'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									required
									:type='item.type'
									@click:append-inner='visible(item.model)'
									@keydown.enter='addPassword'
								/>
							</v-col>
						</v-row>

						<v-row class='align-center ma-0 pa-0 justify-center'>
							<v-col v-for='(item, index) in buttons' :key='index' class='ma-0 pa-0 mx-2' cols='auto'>
								<v-btn
									class='fab-fix'
									:class='item.class'
									:disabled='item.disabled??false'
									icon
									size='x-small'
									variant='text'
									@click='item.click'
								>
									<v-icon :color='item.color' :icon='item.icon' />
								</v-btn>
							</v-col>
						</v-row>

						<v-row class='align-center ma-0 pa-0 justify-center'>
							<v-col class='ma-0 pa-0' cols='auto'>
								<v-switch
									v-model='password_synced'
									class='ma-0 pa-0'
									color='primary'
									density='compact'
									:hide-details='true'
									label='single password'
								/>
							</v-col>

						</v-row>
					</v-form>
				</section>
			</v-expand-transition>
			<v-expand-transition>

				<section v-if='!showTextField'>
					<v-row :class='justify'>
						<v-tooltip
							v-if='show_tooltip && freeUser'
							activator='parent'
							content-class='tooltip'
							location='top center'
						>
							<span>Password authentication is not available for free user</span>
						</v-tooltip>
						<v-col cols='auto'>
							<FabTooltip
								v-if='device_password'
								color='pi'
								:disabled
								:icon='mdiLockRemove'
								tooltip-text='Remove password'
								@click='removePassword'
							/>

							<FabTooltip
								v-if='!device_password'
								color='primary'
								:disabled
								:icon='mdiLockPlus'
								:tooltip-text='`Add password to ${name_of_device}`'
								@click='showTextField = true'
							/>
						</v-col>
					</v-row>
				</section>
			</v-expand-transition>

		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import type { TAuthObject, TChangeDevicePassword, TDeviceInfo, TDeviceTableFields } from '@/types'
import { mdiClose, mdiContentSave, mdiDelete, mdiEye, mdiEyeOff, mdiLock, mdiLockPlus, mdiLockRemove } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_device } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'

const { mdAndUp, mobile } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))

const buttons = computed((): Array<TDeviceTableFields> => [
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
	},
])
const disabled = computed(() => freeUser.value || paused.value || localLoading.value)

const justify = computed(() => mdAndUp.value ? 'justify-center' : 'justify-end')

const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})
const textFields = computed((): Array<TChangeDevicePassword> => {
	const output: Array<TChangeDevicePassword> = [
		{
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'device password',
			model: 'device_password' as const,
			type: device_passwordVisible.value ? 'text' : 'password',
			appendIcon: device_passwordVisible.value ? mdiEyeOff : mdiEye,
		},
	]

	if (!password_synced.value) {
		output.push({
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'client password',
			model: 'client_password' as const,
			type: client_passwordVisible.value ? 'text' : 'password',
			appendIcon: client_passwordVisible.value ? mdiEyeOff : mdiEye,
		})
	}
	return output
})
const freeUser = computed(() => userModule().isFreeUser)
const device_password = computed(() => props.device.device_password_required)
const paused = computed(() => props.device.paused)
const name_of_device = computed(() => props.device.name_of_device)

const password_synced = ref(true)
const inFocus = ref(false)
const localLoading = ref(false)
const client_passwordVisible = ref(false)
const device_passwordVisible = ref(false)
const deviceSetting = ref({
	device_password: '',
	client_password: '',
})
const showTextField = ref(false)

function clear (): void {
	deviceSetting.value.client_password = ''
	deviceSetting.value.device_password = ''
	password_synced.value = true
	inFocus.value = false
	showTextField.value = false
}

const emit = defineEmits(['refresh'])
async function removePassword_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	localLoading.value = true
	const response = await axios_device.password_delete({
		name: name_of_device.value,
		authentication,
	})
	loading.value = false
	localLoading.value = false
	if (response) {
		snackSuccess({
			message: `Password removed from: ${name_of_device.value}`,
			icon: mdiDelete,
		})
		emit('refresh')
		inFocus.value = false
	}
}
function addPassword (): void {
	client_passwordVisible.value = false
	device_passwordVisible.value = false
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
	})
}
async function addPassword_confirm (): Promise<void> {
	if (!deviceSetting.value.device_password) return
	if ((password_synced.value && !deviceSetting.value.device_password) || (!password_synced.value && !deviceSetting.value.client_password)) return
	client_passwordVisible.value = false
	device_passwordVisible.value = false
	loading.value = true
	localLoading.value = true
	if (password_synced.value) {
		deviceSetting.value.client_password = deviceSetting.value.device_password
	}
	const response = await axios_device.password_patch({
		device_password: deviceSetting.value.device_password,
		client_password: deviceSetting.value.client_password,
		name: name_of_device.value,
	})
	loading.value = false
	localLoading.value = false
	if (response) {
		snackSuccess({
			message: `Password added to device: ${name_of_device.value}`,
			icon: mdiContentSave,
		})
		emit('refresh')
		clear()
	}
}

function visible (model: 'client_password' | 'device_password'): void {
	if (model === 'client_password') {
		client_passwordVisible.value = !client_passwordVisible.value
	} else {
		device_passwordVisible.value = !device_passwordVisible.value
	}
}

function removePassword (): void {
	if (disabled.value) return
	dialoger({
		message: `Remove password from device "${name_of_device.value}"`,
		passwordrequired: true,
		buttonText: 'confirm',
		title: 'Remove Password',
		confirmMethod: removePassword_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: false,
	})
}

const props = defineProps<{ device: TDeviceInfo }>()

watch(paused, (i: boolean): void => {
	if (i) {
		inFocus.value = false
	}
})
</script>
