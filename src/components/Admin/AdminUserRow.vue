<template>
	<v-row class='align-center ma-0 pa-0 text-body-small justify-space-between' density='compact'>

		<v-col class='text-left ma-0 pa-0' cols='1'>

			<v-row class='align-center ma-0 pa-0 justify-start' density='compact'>

				<v-col class='ma-0 pa-0' cols='auto'>
					<v-switch
						v-model='active'
						class='ma-0 pa-0'
						color='primary'
						density='compact'
						:disabled
						:hide-details='true'
						label=''
						@click='click_active'
					/>

					<v-tooltip
						v-if='show_tooltip && disabled'
						activator='parent'
						content-class='tooltip'
						location='top center'
					>
						<span>can't disable self</span>
					</v-tooltip>

				</v-col>

				<v-col v-if='!active' class='ml-2 ma-0 pa-0 cl' cols='auto'>
					<v-icon color='pi' :icon='mdiDelete' @click='deleteUser' />
				</v-col>
			</v-row>
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			<span class='font-weight-bold'>{{ user.registered_user_id }}</span>
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			{{ user.full_name }}
		</v-col>

		<v-col class='text-right ma-0 pa-0 small-text' cols='2'>
			{{ user.email }}
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			<span :class='user_level_class'>
				{{ user.user_level }}
			</span>
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			{{ monthly_bandwidth(user) }}
			<v-icon :color='bandwidth_color' :icon='bandwidth_icon' @click='click_bandwidth' />
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			{{ user.device_count }}
			<v-icon v-if='user.device_count > 0' :color='device_color' :icon='device_icon' @click='click_device' />
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			<span v-if='user.two_fa_enabled' class='mr-1'>{{ user.two_fa_backup_count }}</span>
			<v-icon :color='bool_color(user.two_fa_enabled)' :icon='bool_icon(user.two_fa_enabled)' size='small' />
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			{{ user.password_reset }}
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			{{ user.login_attempt_number }}
			<v-icon
				v-if='(user.login_attempt_number > 0)'
				color='pi'
				:icon='mdiCloseCircle'
				size='small'
				@click='click_attempt'
			/>
		</v-col>

		<v-col class='text-right ma-0 pa-0' cols='1'>
			{{ sessions.length }}
			<v-icon v-if='(sessions.length > 0)' :color='session_color' :icon='session_icon' @click='click_session' />
		</v-col>
	</v-row>

	<!-- Refactor/split into component -->
	<!-- Bandwidth table -->
	<v-expand-transition>
		<v-row v-if='show_bandwidth' class='align-center ma-0 pa-0 justify-space-between'>
			<v-col class='ma-0 pa-0' cols='12'>
				<ExtraBandwidth class='' :device='fake_device' :show-calc='false' />
			</v-col>
		</v-row>
	</v-expand-transition>

	<!-- Refactor/split into component -->
	<!-- All Devices -->
	<v-expand-transition>
		<v-row v-if='show_devices' class='align-center ma-0 pa-0 justify-space-between'>
			<v-col class='ma-0 pa-0' cols='12'>
				<v-row class='align-center ma-0 pa-0 justify-space-between'>
					<v-col class='ma-0 pa-0' cols='12'>
						<v-row class='align-center ma-0 pa-0 small-text font-weight-bold justify-space-between'>
							<v-col class='ma-0 pa-0 text-left' cols='4'>
								name
							</v-col>

							<v-col class='ma-0 pa-0 text-right' cols='1'>
								api_key
							</v-col>

							<v-col class='ma-0 pa-0 text-right' cols='1'>
								creation_date
							</v-col>

							<v-col class='ma-0 pa-0 text-right' cols='1'>
								max_clients
							</v-col>

							<v-col class='ma-0 pa-0 cl text-right' cols='1'>
								status
							</v-col>

							<v-col class='ma-0 pa-0 text-right' cols='1'>
								structured_data
							</v-col>

							<v-col class='ma-0 pa-0 text-right' cols='1'>
								password_required
							</v-col>

							<v-col class='ma-0 pa-0 text-right' cols='1'>
								delete
							</v-col>

						</v-row>

						<v-divider />
					</v-col>

					<v-col v-for='(item, index) in all_devices' :key='index' class='ma-0 pa-0' cols='12'>
						<AdminDeviceRow :device='item' :email='user.email' @refresh='update_device' />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-expand-transition>

	<!-- Refactor/split into component -->
	<!-- Sessions -->
	<v-expand-transition>
		<v-row v-if='(show_session)' class='align-center ma-0 pa-0 justify-space-between'>
			<v-row class='align-center ma-0 pa-0 font-weight-bold justify-space-between'>
				<v-col class='ma-0 pa-0' cols='6'>
					key
				</v-col>

				<v-col class='ma-0 pa-0' cols='3'>
					ttl
				</v-col>

				<v-col class='ma-0 pa-0' cols='3'>
					created
				</v-col>
			</v-row>

			<v-divider />

			<v-col v-for='(item, index) in sessions' :key='index' class='ma-0 pa-0' cols='12'>
				<v-row class='align-center ma-0 pa-0 justify-space-between'>
					<v-col class='ma-0 pa-0 small-text' cols='6'>
						{{ item.key }}
					</v-col>

					<v-col class='ma-0 pa-0' cols='3'>
						{{ secondsToDays(item.ttl * 1000) }}
					</v-col>

					<v-col class='ma-0 pa-0' cols='3'>
						{{ new Date(item.timestamp * 1000).toLocaleString() }}
						<v-icon color='pi' :icon='mdiCloseCircle' size='small' @click='session_delete(item.key)' />
					</v-col>
				</v-row>

				<v-divider v-if='(index !== sessions.length - 1)' class='' />
			</v-col>
		</v-row>
	</v-expand-transition>

</template>

<script setup lang="ts">
import type { AdminDeviceAndConnections, TAdminSession, TAdminUser, TAuthObject, TDeviceInfo } from '@/types'
import { mdiAccountRemove, mdiCheck, mdiChevronDown, mdiChevronUp, mdiClose, mdiCloseCircle, mdiDelete } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { dialoger } from '@/services/dialog'
import { fetch_admin } from '@/services/fetch'
import { UserLevel } from '@/types/const_userLevel'
import { convert_bytes } from '@/vanillaTS/convert_bytes'
import { secondsToDays } from '@/vanillaTS/convert_seconds'

const { mobile } = useDisplay()

const disabled = computed(() => props.user.email === userModule().email)

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))
const all_devices: Ref<Array<AdminDeviceAndConnections>> = ref([])

const active = ref(false)

onMounted(() => {
	active.value = props.user.active
	watch(() => props.user.active, _ => {
		active.value = props.user.active
	})
})

onUnmounted(() => {
	clearInterval(show_devices_interval.value)
})

async function click_active (): Promise<void> {
	const valid = await fetch_admin.active_patch(props.user.email)
	if (valid) {
		emit('update')
	} else {
		active.value = props.user.active
	}
}
const bool_icon = (x: boolean): string => x ? mdiCheck : mdiClose
const bool_color = (x: boolean): string => x ? 'primary' : 'pi'

const user_level_class = computed(() => props.user.user_level === UserLevel.ADMIN ? 'text-pi font-weight-bold' : (props.user.user_level === UserLevel.PRO ? 'text-primary' : ''))

async function update_device (): Promise<void> {
	loadingModule().set_loading(true)
	all_devices.value = await fetch_admin.user_connections_get(props.user.email)
	loadingModule().set_loading(false)
}

async function click_device (): Promise<void> {
	if (!show_devices.value) {
		await update_device()
	}
	show_devices.value = !show_devices.value
}
const show_devices = ref(false)
const show_devices_interval = ref(0)

watch(show_devices, i => {
	if (i) {
		show_devices_interval.value = setInterval(async () => {
			await update_device()
		}, 10_000)
	} else {
		clearInterval(show_devices_interval.value)
	}
})

watch(all_devices, i => {
	if (i.length === 0) {
		show_devices.value = false
	}
})

const device_icon = computed(() => show_devices.value ? mdiChevronUp : mdiChevronDown)
const device_color = computed(() => show_devices.value ? 'pi' : 'primary')

function click_bandwidth (): void {
	show_bandwidth.value = !show_bandwidth.value
}
const show_bandwidth = ref(false)
const bandwidth_icon = computed(() => show_bandwidth.value ? mdiChevronUp : mdiChevronDown)
const bandwidth_color = computed(() => show_bandwidth.value ? 'pi' : 'primary')

function click_session (): void {
	show_session.value = !show_session.value
}

async function click_attempt (): Promise<void> {
	await fetch_admin.attempt_delete(props.user.email)
	emit('update')
}

const show_session = ref(false)
const session_icon = computed(() => show_session.value ? mdiChevronUp : mdiChevronDown)
const session_color = computed(() => show_session.value ? 'pi' : 'primary')

async function session_delete (key: string): Promise<void> {
	await fetch_admin.session_delete(key)
	emit('update')
}

function monthly_bandwidth (x: TAdminUser): string {
	const b = convert_bytes(Number(x.client_bytes_month_out) + Number(x.pi_bytes_month_out))
	return `${b.total} ${b.unit}`
}

// Make a "fake" device, just so can reuse the bandwidth table
const fake_device = computed((): TDeviceInfo => ({
	name_of_device: '',
	api_key: '',
	creation_date: '',
	client_password_required: false,
	device_password_required: false,
	paused: false,
	structured_data: false,
	ip: '',
	timestamp_online: '',
	timestamp_offline: '',
	max_clients: 0,

	pi_bytes_day_in: props.user.pi_bytes_day_in,
	pi_bytes_day_out: props.user.pi_bytes_day_out,
	pi_bytes_month_in: props.user.pi_bytes_month_in,
	pi_bytes_month_out: props.user.pi_bytes_month_out,
	pi_bytes_total_in: props.user.pi_bytes_total_in,
	pi_bytes_total_out: props.user.pi_bytes_total_out,

	client_bytes_day_in: props.user.client_bytes_day_in,
	client_bytes_day_out: props.user.client_bytes_day_out,
	client_bytes_month_in: props.user.client_bytes_month_in,
	client_bytes_month_out: props.user.client_bytes_month_out,
	client_bytes_total_in: props.user.client_bytes_total_in,
	client_bytes_total_out: props.user.client_bytes_total_out,
}))

const emit = defineEmits(['update'])

const props = defineProps<{
	user: TAdminUser
	sessions: Array<TAdminSession>
}>()

watch(() => props.sessions.length, i => {
	if (i === 0) {
		show_session.value = false
	}
})

const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

async function deleteUser (): Promise<void> {
	if (props.user.active || props.user.email === userModule().email) return
	dialoger({
		message: `Are you sure you want to delete the account: ${props.user.email}`,
		buttonText: 'delete account',
		icon: mdiAccountRemove,
		title: 'Delete Account',
		confirmMethod: deleteUser_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	})
}

async function deleteUser_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	await fetch_admin.user_delete({
		email: props.user.email,
		...authentication,
	})
	loading.value = false
	emit('update')
}
</script>
