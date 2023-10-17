<template>
	<v-row align='center' justify='space-between' class='ma-0 pa-0 no-gutters'>
		
		<v-col cols='1' class='text-left ma-0 pa-0'>

			<v-row align='center' justify='start' class='ma-0 pa-0 no-gutters'>

				<v-col cols='auto' class='ma-0 pa-0'>
					<v-switch
						v-model='active'
						@click='click_active'
						:disabled='disabled'
						:hide-details='true'
						class='ma-0 pa-0'
						color='primary'
						density='compact'
						label=''
					/>
					<v-tooltip v-if='show_tooltip && disabled' activator='parent' location='top center' content-class='tooltip'>
						<span>can't disable self</span>
					</v-tooltip>
					
				</v-col>
				<v-col cols='auto' class='ml-2 ma-0 pa-0 cl' v-if='!active'>
					<v-icon  :icon='mdiDelete' color='pi' @click='deleteUser'/>
				</v-col>
			</v-row>
		</v-col>

		<v-col cols='1' class='text-right ma-0 pa-0'>
			<span class='font-weight-bold'>{{ user.registered_user_id }}</span>
		</v-col>

		<v-col cols='1' class='text-right ma-0 pa-0'>
			{{ user.full_name }}
		</v-col>

		<v-col cols='2' class='text-right ma-0 pa-0 small-text'>
			{{ user.email }}
		</v-col>
	
		<v-col cols='1' class='text-right ma-0 pa-0'>
			<span :class='user_level_class' >
				{{ user.user_level }}
			</span>
		</v-col>
		<v-col cols='1' class='text-right ma-0 pa-0'>
			{{ monthly_bandwidth(user) }}
			<v-icon :icon='bandwidth_icon' @click='click_bandwidth' :color='bandwidth_color' />
		</v-col>
		<v-col cols='1' class='text-right ma-0 pa-0'>
			{{ user.device_count }}
			<v-icon :icon='device_icon' v-if='user.device_count>0' @click='click_device' :color='device_color' />
		</v-col>
		<v-col cols='1'  class='text-right ma-0 pa-0'>
			<span v-if='user.two_fa_enabled' class='mr-1'>{{ user.two_fa_backup_count }}</span>
			<v-icon :icon='bool_icon(user.two_fa_enabled)'  :color='bool_color(user.two_fa_enabled)'  size='small'/>
		</v-col>
		<v-col cols='1'  class='text-right ma-0 pa-0'>
			{{ user.password_reset }}
		</v-col>
		<v-col cols='1'  class='text-right ma-0 pa-0'>
			{{ user.login_attempt_number }}
			<v-icon color='pi' v-if='(user.login_attempt_number > 0)' :icon='mdiCloseCircle' size='small' @click='click_attempt' />
		</v-col>
		<v-col cols='1'  class='text-right ma-0 pa-0'>
			{{ sessions.length }}
			<v-icon v-if='(sessions.length > 0)' :icon='session_icon' @click='click_session' :color='session_color' />
		</v-col>
	</v-row>

	<!-- Refactor/split into component -->
	<!-- Bandwidth table -->
	<v-expand-transition>
		<v-row align='center' justify='space-between' class='ma-0 pa-0' v-if='show_bandwidth'>
			<v-col cols='12' class='ma-0 pa-0'>
				<ExtraBandwidth class='' :device='fake_device' :show_calc='false' />
			</v-col>
		</v-row>
	</v-expand-transition>

	<!-- Refactor/split into component -->
	<!-- All Devices -->
	<v-expand-transition>
		<v-row align='center' justify='space-between' class='ma-0 pa-0' v-if='show_devices'>
			<v-col cols='12' class='ma-0 pa-0'>
				<v-row align='center' justify='space-between' class='ma-0 pa-0'>
					<v-col cols='12' class='ma-0 pa-0' >
						<v-row align='center' justify='space-between' class='ma-0 pa-0 small-text font-weight-bold'>
							<v-col cols='4' class='ma-0 pa-0 text-left'>
								name
							</v-col>
							<v-col cols='1' class='ma-0 pa-0 text-right'>
								api_key
							</v-col>
							<v-col cols='1' class='ma-0 pa-0 text-right'>
								creation_date
							</v-col>
							<v-col cols='1' class='ma-0 pa-0 text-right'>
								max_clients
							</v-col>
							<v-col cols='1' class='ma-0 pa-0 cl text-right'>
								status
							</v-col>
							<v-col cols='1' class='ma-0 pa-0 text-right'>
								structured_data
							</v-col>
							<v-col cols='1' class='ma-0 pa-0 text-right'>
								password_required
							</v-col>
							<v-col cols='1' class='ma-0 pa-0 text-right'>
								delete
							</v-col>

						</v-row>
						<v-divider />
					</v-col>
					<v-col cols='12' class='ma-0 pa-0' v-for='(item, index) in all_devices' :key='index'>
						<AdminDeviceRow :device='item' :email='user.email' @refresh='update_device'/>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-expand-transition>

	<!-- Refactor/split into component -->
	<!-- Sessions -->
	<v-expand-transition>
		<v-row align='center' justify='space-between' class='ma-0 pa-0' v-if='(show_session)'>
			<v-row align='center' justify='space-between' class='ma-0 pa-0 font-weight-bold'>
				<v-col cols='6' class='ma-0 pa-0'>
					key
				</v-col>
				<v-col cols='3' class='ma-0 pa-0'>
					ttl
				</v-col>
				<v-col cols='3' class='ma-0 pa-0'>
					created
				</v-col>
			</v-row>
			<v-divider />
			<v-col v-for='(item, index) in sessions' :key='index' cols='12' class='ma-0 pa-0'>
				<v-row align='center' justify='space-between' class='ma-0 pa-0'>
					<v-col cols='6' class='ma-0 pa-0 small-text'>
						{{ item.key }}
					</v-col>
					<v-col cols='3' class='ma-0 pa-0'>
						{{ secondsToDays(item.ttl*1000) }}
					</v-col>
					<v-col cols='3' class='ma-0 pa-0'>
						{{ new Date(item.timestamp*1000).toLocaleString() }}
						<v-icon color='pi' :icon='mdiCloseCircle' size='small' @click='session_delete(item.key)' />
					</v-col>
				</v-row>
				<v-divider class='' v-if='(index!== sessions.length -1)'/>
			</v-col>
		</v-row>
	</v-expand-transition>

</template>

<script setup lang="ts">
import { axios_admin } from '@/services/axios';
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import { dialoger } from '@/services/dialog';
import { mdiAccountRemove, mdiCloseCircle, mdiChevronDown, mdiChevronUp, mdiCheck, mdiClose, mdiDelete } from '@mdi/js';
import { secondsToDays } from '@/vanillaTS/convert_seconds';
import { useDisplay } from 'vuetify';
import { UserLevel } from '@/types/enum_userLevel';
import type { AdminDeviceAndConnections, TAdminSession, TAdminUser, TAuthObject, TDeviceInfo } from '@/types';

const { mobile } = useDisplay();

const disabled = computed((): boolean => {
	return props.user.email === userModule().email;
});

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && mobile.value);
});
const all_devices: Ref<Array<AdminDeviceAndConnections>> = ref([]);

const active = ref(false);

onMounted(() => {
	active.value = props.user.active;
	watch(() => props.user.active, async (_) => {
		active.value = props.user.active;
	});
});

onUnmounted(() => {
	clearInterval(show_devices_interval.value);
});

const click_active = async (): Promise<void> => {
	const valid = await axios_admin.active_patch(props.user.email);
	if (valid) {
		emit('update');
	} else {
		active.value = props.user.active;

	}
};
const bool_icon = (x: boolean) : string => {
	return x? mdiCheck: mdiClose;
};
const bool_color = (x: boolean) : string => {
	return x? 'primary' : 'pi';
};

const user_level_class = computed(():string =>{
	return props.user.user_level === UserLevel.ADMIN ? 'text-pi font-weight-bold' : props.user.user_level === UserLevel.PRO ? 'text-primary':'';

});

const update_device = async (): Promise<void> => {
	loadingModule().set_loading(true);
	all_devices.value = await axios_admin.user_connections_get(props.user.email);
	loadingModule().set_loading(false);
};

const click_device = async (): Promise<void> => {
	if (!show_devices.value) {
		await update_device();
	}
	show_devices.value = !show_devices.value;
};
const show_devices = ref(false);
const show_devices_interval = ref(0);

watch(show_devices, (i) => {
	if (i) {
		show_devices_interval.value = setInterval(async () => {
			await update_device();
		}, 10000);
		
	} else {
		clearInterval(show_devices_interval.value);
	}
});

watch(all_devices, (i) => {
	if (i.length == 0) {
		show_devices.value = false;
	}
});

const device_icon = computed((): string => {
	return show_devices.value ? mdiChevronUp: mdiChevronDown;
});
const device_color = computed((): string => {
	return show_devices.value ? 'pi' :'primary';
});

const click_bandwidth = (): void => {
	show_bandwidth.value = !show_bandwidth.value;
};
const show_bandwidth = ref(false);
const bandwidth_icon = computed((): string => {
	return show_bandwidth.value ? mdiChevronUp: mdiChevronDown;
});
const bandwidth_color = computed((): string => {
	return show_bandwidth.value ? 'pi' :'primary';
});

const click_session = (): void => {
	show_session.value = !show_session.value;
};

const click_attempt = async (): Promise<void> => {
	await axios_admin.attempt_delete(props.user.email);
	emit('update');
};

watch(() => props.sessions.length, (i) => {
	if (i === 0) {
		show_session.value = false;
	}
});

const show_session = ref(false);
const session_icon = computed((): string => {
	return show_session.value ? mdiChevronUp: mdiChevronDown;
});
const session_color = computed((): string => {
	return show_session.value ? 'pi' :'primary';
});

const session_delete = async (key: string): Promise<void> => {
	await axios_admin.session_delete(key);
	emit('update');
};

const monthly_bandwidth = (x: TAdminUser): string => {
	const b = convert_bytes(Number(x.client_bytes_month_out) + Number(x.pi_bytes_month_out));
	return `${b.total} ${b.unit}`;
};

/// Make a "fake" device, just so can reuse the bandwidth table
const fake_device = computed((): TDeviceInfo => {
	return {
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
	};

});

const emit = defineEmits([ 'update' ]);

const props = defineProps<{user: TAdminUser, sessions: Array<TAdminSession>}>();

const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const deleteUser = async (): Promise<void> => {
	if (props.user.active || props.user.email === userModule().email) return;
	dialoger({
		message: `Are you sure you want to delete the account: ${props.user.email}`,
		buttonText: 'delete account',
		icon: mdiAccountRemove,
		title: 'Delete Account',
		confirmMethod: deleteUser_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	});

};

const deleteUser_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	await axios_admin.user_delete({ email: props.user.email, ...authentication });
	loading.value = false;
	emit('update');
};
</script>
