<template>
	<!-- <v-col cols='12' class='ma-0 pa-0' v-for='(item, index) in all_devices' :key='index'> -->
	<v-row align='center' justify='space-between' class='ma-0 pa-0'>
		<v-col cols='4' class='ma-0 pa-0 text-left'>
			<v-icon v-if='(device.connections.length > 0)' :icon='connections_icon' @click='click_connections' :color='connections_color' />
			{{ device.device.name_of_device }}
		</v-col>
		
		<v-col cols='1' class='ma-0 pa-0 text-right'>
			<CopyButton
				:hoverMessage='`copy apikey`'
				:toCopy='device.device.api_key'
				:tooltipMessage='"api_key copied!"'
				color='primary'
				:small='true'
			/>
		</v-col>
		<v-col cols='1' class='ma-0 pa-0 text-right'>
			{{ new Date(device.device.creation_date).toLocaleDateString() }}
		</v-col>
		<v-col cols='1' class='ma-0 pa-0 text-right'>
			{{ device.device.max_clients }}

		</v-col>
		<v-col cols='1' class='cl ma-0 pa-0 text-right' @click='pauseDevice'>
			<v-tooltip activator='parent' location='top center' content-class='tooltip'>
				<span>click to {{ tooltip }}pause</span>
			</v-tooltip>
			<v-icon :icon='pause_icon' :color='bool_color(!device.device.paused)'/>
		</v-col>
		<v-col cols='1' class='ma-0 pa-0 text-right'>
			<v-icon :icon='bool_icon(device.device.structured_data)' :color='bool_color(device.device.structured_data)' size='small'/>
		</v-col>
		<v-col cols='1' class='ma-0 pa-0 text-right'>
			<v-icon :icon='bool_icon(device.device.device_password_required)' :color='bool_color(device.device.device_password_required)' size='small'/>
		</v-col>
		<v-col cols='1' class='ma-0 pa-0 text-right'>
			<v-icon @click='deleteDevice' :icon='mdiDeleteCircle' size='small' color='pi' />
		</v-col>

	</v-row>
	<v-expand-transition>
		<v-row align='center' justify='space-between' class='ma-0 pa-0' v-if='show_connections'>
			<v-col cols='12' class='ma-0 pa-0'>
				<v-divider />
			</v-col>
			<v-col cols='12' class='ma-0 pa-0 text-left'>
				<v-row align='center' justify='space-between' class=' small-text ma-0 pa-0' v-for='(con_item, index) in device.connections' :key='index'>
					<v-col cols='3' class='ma-0 pa-0'>
						type: {{ con_item.device_type }}
					</v-col>
					<v-col cols='3' class='ma-0 pa-0'>
						online_since: {{ new Date(con_item.timestamp).toLocaleString() }}
					</v-col>
					<v-col cols='3' class='ma-0 pa-0 cl' @click='close_connection(con_item.ulid, con_item.device_id, con_item.device_type)'>
						ulid: {{ con_item.ulid }}
						<v-tooltip activator='parent' location='top center' content-class='tooltip'>
							<span>click to kill connection</span>
						</v-tooltip>
					</v-col>
					<v-col cols='3' class='ma-0 pa-0'>
						ip: {{ con_item.ip }}
					</v-col>
					<v-col cols='12' class='ma-0 pa-0' v-if='(index !== device.connections.length -1)'>
						<v-divider />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-expand-transition>
</template>

<script setup lang='ts'>
import { axios_admin } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiCheck, mdiChevronDown, mdiChevronUp, mdiClose, mdiDeleteCircle, mdiPause, mdiPauseCircle, mdiPlay } from '@mdi/js';
import { snackSuccess } from '@/services/snack';
import CopyButton from '@/components/Buttons/CopyButton.vue';
import type { AdminDeviceAndConnections, TAuthObject } from '@/types';

const show_connections = ref(false);
const connections_icon = computed((): string => {
	return show_connections.value ? mdiChevronUp: mdiChevronDown;
});
const connections_color = computed((): string => {
	return show_connections.value ? 'pi' :'primary';
});

const click_connections = () : void => {
	show_connections.value = !show_connections.value;
};

const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const pause_icon = computed(() : string => {
	return props.device.device.paused? mdiPause: mdiPlay;
});

const tooltip = computed((): string => {
	return props.device.device.paused ? 'un' : '';
});

const bool_icon = (x: boolean) : string => {
	return x? mdiCheck: mdiClose;
};
const deleteDevice = async (): Promise<void> => {
	dialoger({
		message: `Are you sure you want to delete device "${props.device.device.name_of_device}"`,
		buttonText: 'delete',
		icon: mdiDeleteCircle,
		title: 'Delete device',
		confirmMethod: deleteDevice_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	});

};

const deleteDevice_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	const response = await axios_admin.device_delete({ device_name: props.device.device.name_of_device, email: props.email, ...authentication });
	loading.value = false;
	if (response) {
		snackSuccess({ message: `Deleted "${ props.device.device.name_of_device}"`, icon: mdiDeleteCircle });
		emits('refresh');
	}
};

const bool_color = (x: boolean) : string => {
	return x? 'primary': 'pi';
};

const pauseDevice = async (): Promise<void> => {
	dialoger({
		message: `Are you sure you want to pause device "${props.device.device.name_of_device}"`,
		buttonText: 'pause',
		icon: mdiPauseCircle,
		title: 'Pause device',
		confirmMethod: pauseDevice_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	});

};

const pauseDevice_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	const response = await axios_admin.device_pause_patch({ device_name: props.device.device.name_of_device, email: props.email, ...authentication });
	loading.value = false;
	if (response) {
		snackSuccess({ message: `${props.device.device.paused ? 'Unpaused' : 'Paused'} "${ props.device.device.name_of_device}"`, icon: props.device.device.paused ? mdiPlay : mdiPause });
		emits('refresh');
	}
};

const close_connection = async (connection_ulid: string, device_id: number, device_type: string): Promise<void> => {
	await axios_admin.connection_delete({ connection_ulid, device_id, device_type });
	emits('refresh');
};

const emits = defineEmits([ 'refresh' ]);

watch(() => props.device.connections.length, (i) => {
	if (i==0) {
		show_connections.value = false;
	}
});

const props = defineProps({
	device: {
		type: Object as () => AdminDeviceAndConnections,
		required: true,
	},
	email: {
		type: String,
		required: true
	}
});

</script>