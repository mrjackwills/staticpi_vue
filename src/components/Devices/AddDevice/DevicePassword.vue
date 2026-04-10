<template>
	<section>
		<v-row class='align-center ma-0 pa-0 justify-center' density='compact'>
			<v-col class='ma-0 pa-0' cols='12' md='6'>
				<v-text-field
					v-for='(item, index) in textFields'
					:key='index'
					v-model='deviceSetting[item.model]'
					:append-inner-icon='item.appendIcon'
					:autocomplete='item.autocomplete'
					class='ma-0 pa-0'
					color='primary'
					density='compact'
					:label='item.label'
					:prepend-inner-icon='item.icon'
					required
					:type='item.type'
					variant='outlined'
					@click:append-inner='visible(item.model)'
					@update:model-value='textField_method(item.model)'
				/>
			</v-col>
		</v-row>
		<v-row class='align-center ma-0 pa-0 justify-center'>
			<v-col class='ma-0 pa-0' cols='auto'>
				<v-switch
					v-model='password_synced'
					class='ma-0 pa-0 mt-n5'
					color='primary'
					density='compact'
					flat
					:hide-details='true'
					label='single password'
				/>
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import type { TChangeDevicePassword } from '@/types'
import { mdiEye, mdiEyeOff, mdiLock } from '@mdi/js'

const textFields = computed((): Array<TChangeDevicePassword> => {
	const output: Array<TChangeDevicePassword> = [
		{
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'add device password',
			model: 'device_password' as const,
			type: device_passwordVisible.value ? 'text' : 'password',
			appendIcon: device_passwordVisible.value ? mdiEyeOff : mdiEye,
		},
	]

	if (!password_synced.value) {
		output.push({
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'add client password',
			model: 'client_password' as const,
			type: client_passwordVisible.value ? 'text' : 'password',
			appendIcon: client_passwordVisible.value ? mdiEyeOff : mdiEye,
		})
	}

	return output
})

const password_synced = ref(true)

const deviceSetting = ref({
	device_password: '',
	client_password: '',
})

const device_passwordVisible = ref(false)
const client_passwordVisible = ref(false)

const emit = defineEmits(['device-password-input', 'client-password-input'])

function textField_method (model: 'client_password' | 'device_password'): void {
	if (model === 'client_password') {
		emit('client-password-input', deviceSetting.value.client_password)
	} else {
		emit('device-password-input', deviceSetting.value.device_password)
	}
}

function visible (model: 'client_password' | 'device_password'): void {
	if (model === 'client_password') {
		client_passwordVisible.value = !client_passwordVisible.value
	} else {
		device_passwordVisible.value = !device_passwordVisible.value
	}
}
</script>
