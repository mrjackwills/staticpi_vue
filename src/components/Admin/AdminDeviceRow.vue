<template>
	<v-row class='align-center ma-0 pa-0 text-body-small justify-space-between'>
		<v-col class='ma-0 pa-0 text-left' cols='4'>
			<v-icon
				v-if='(device.connections.length > 0)'
				:color='connections_color'
				:icon='connections_icon'
				@click='click_connections'
			/>
			{{ device.device.name_of_device }}
		</v-col>

		<v-col class='ma-0 pa-0 text-right' cols='1'>
			<CopyButton
				color='primary'
				:hover-message='`copy apikey`'
				:small='true'
				:to-copy='device.device.api_key'
				:tooltip-message='"api_key copied!"'
			/>
		</v-col>

		<v-col class='ma-0 pa-0 text-right' cols='1'>
			{{ new Date(device.device.creation_date).toLocaleDateString() }}
		</v-col>

		<v-col class='ma-0 pa-0 text-right' cols='1'>
			{{ device.device.max_clients }}

		</v-col>

		<v-col class='cl ma-0 pa-0 text-right' cols='1' @click='pauseDevice'>
			<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
				<span>click to {{ tooltip }}pause</span>
			</v-tooltip>

			<v-icon :color='bool_color(!device.device.paused)' :icon='pause_icon' />
		</v-col>

		<v-col class='ma-0 pa-0 text-right' cols='1'>
			<v-icon
				:color='bool_color(device.device.structured_data)'
				:icon='bool_icon(device.device.structured_data)'
				size='small'
			/>
		</v-col>

		<v-col class='ma-0 pa-0 text-right' cols='1'>
			<v-icon
				:color='bool_color(device.device.device_password_required)'
				:icon='bool_icon(device.device.device_password_required)'
				size='small'
			/>
		</v-col>

		<v-col class='ma-0 pa-0 text-right' cols='1'>
			<v-icon color='pi' :icon='mdiDeleteCircle' size='small' @click='deleteDevice' />
		</v-col>

	</v-row>

	<v-expand-transition>
		<v-row v-if='show_connections' class='align-center ma-0 pa-0 justify-space-between'>
			<v-col class='ma-0 pa-0' cols='12'>
				<v-divider />
			</v-col>

			<v-col class='ma-0 pa-0 text-left' cols='12'>
				<v-row
					v-for='(con_item, index) in device.connections'
					:key='index'
					class='small-text ma-0 pa-0 align-center justify-space-between'
				>
					<v-col class='ma-0 pa-0' cols='3'>
						type: {{ con_item.device_type }}
					</v-col>

					<v-col class='ma-0 pa-0' cols='3'>
						online_since: {{ new Date(con_item.timestamp).toLocaleString() }}
					</v-col>

					<v-col
						class='ma-0 pa-0 cl'
						cols='3'
						@click='close_connection(con_item.ulid, con_item.device_id, con_item.device_type)'
					>
						ulid: {{ con_item.ulid }}
						<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
							<span>click to kill connection</span>
						</v-tooltip>
					</v-col>

					<v-col class='ma-0 pa-0' cols='3'>
						ip: {{ con_item.ip }}
					</v-col>

					<v-col v-if='(index !== device.connections.length - 1)' class='ma-0 pa-0' cols='12'>
						<v-divider />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-expand-transition>
</template>

<script setup lang='ts'>
import type { AdminDeviceAndConnections, TAuthObject } from '@/types'
import { mdiCheck, mdiChevronDown, mdiChevronUp, mdiClose, mdiDeleteCircle, mdiPause, mdiPauseCircle, mdiPlay } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_admin } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'

const show_connections = ref(false)
const connections_icon = computed(() => show_connections.value ? mdiChevronUp : mdiChevronDown)
const connections_color = computed(() => show_connections.value ? 'pi' : 'primary')

function click_connections (): void {
	show_connections.value = !show_connections.value
}

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

const pause_icon = computed(() => props.device.device.paused ? mdiPause : mdiPlay)

const tooltip = computed(() => props.device.device.paused ? 'un' : '')

const bool_icon = (x: boolean): string => x ? mdiCheck : mdiClose

async function deleteDevice (): Promise<void> {
	dialoger({
		message: `Are you sure you want to delete device "${props.device.device.name_of_device}"`,
		buttonText: 'delete',
		icon: mdiDeleteCircle,
		title: 'Delete device',
		confirmMethod: deleteDevice_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	})
}

async function deleteDevice_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_admin.device_delete({
		device_name: props.device.device.name_of_device,
		email: props.email,
		...authentication,
	})
	loading.value = false
	if (response) {
		snackSuccess({
			message: `Deleted "${props.device.device.name_of_device}"`,
			icon: mdiDeleteCircle,
		})
		emits('refresh')
	}
}

const bool_color = (x: boolean): string => x ? 'primary' : 'pi'

async function pauseDevice (): Promise<void> {
	dialoger({
		message: `Are you sure you want to pause device "${props.device.device.name_of_device}"`,
		buttonText: 'pause',
		icon: mdiPauseCircle,
		title: 'Pause device',
		confirmMethod: pauseDevice_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	})
}

async function pauseDevice_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_admin.device_pause_patch({
		device_name: props.device.device.name_of_device,
		email: props.email,
		...authentication,
	})
	loading.value = false
	if (response) {
		snackSuccess({
			message: `${props.device.device.paused ? 'Unpaused' : 'Paused'} "${props.device.device.name_of_device}"`,
			icon: props.device.device.paused ? mdiPlay : mdiPause,
		})
		emits('refresh')
	}
}

async function close_connection (connection_ulid: string, device_id: number, device_type: string): Promise<void> {
	await axios_admin.connection_delete({
		connection_ulid,
		device_id,
		device_type,
	})
	emits('refresh')
}

const emits = defineEmits(['refresh'])

const props = defineProps<{
	device: AdminDeviceAndConnections
	email: string
}>()

watch(() => props.device.connections.length, i => {
	if (i == 0) {
		show_connections.value = false
	}
})

</script>
