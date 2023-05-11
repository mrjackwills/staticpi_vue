
<template>
	<!-- <section> -->
	<AppCard
		v-intersect='onIntersect'
		:hasButton='false'
		:tile='true'
		:flat='true'
		:outlined='false'
		:pad='false'
		my='ma-0 pa-0'
		sm='12'
		xl='12'
		lg='12'
		
	>
		<template v-slot:body>
			
			<v-row align='center' justify='center' class='ma-0 pa-0 no-gutters'>
				<v-col cols='auto' class='ma-0 pa-0 text-center'>
					<span class='font-weight-bold' :class='onlineColor'>{{ device.name_of_device }}</span> was created on {{ new Date(device.creation_date).toLocaleString() }}
				</v-col>
			</v-row>

			<v-row align='start' justify='center' class='ma-0 pa-0 no-gutters' >
				<v-col cols='11' class='ma-0 pa-0'>
					<v-row align='start' justify='center' class='ma-0 pa-0 no-gutters'>
						<v-col cols='11' md='4' class='ma-0 pa-0' :order='orderDevice'>
							<ExtraTable :class='{"pr-6": !smAndDown}' :online='deviceOnline' v-model:tableRows='connectedDevice' :is_device='true' @hidden='handleHidden($event,0)' />
						</v-col>
				
						<v-col cols='11' md='4' class='ma-0 pa-0' :order='orderClient'>
							<ExtraTable :class='{"pl-6": !smAndDown}' :online='connectedClients.length > 0' v-model:tableRows='connectedClients' :is_device='false' @hidden='handleHidden($event, 1)'  />
						</v-col>

						<v-col cols='11' :md='singleRow?"4":"8"' class='ma-0 pa-0' :order='orderBandwidth'>
							<ExtraBandwidth class='' :device='device' @hidden='handleHidden($event, 2)' />
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row align='start' justify='center' class='ma-0 pa-0'>
				
				<v-expand-transition>
					<v-col cols='11' class='ma-0 pa-0 mt-2' v-if='!sendMessage'>
						<ActionButton
							@click='sendMessage = true'
							:block='true'
							:disabled='maxConnected || ttl'
							:icon='mdiForum'
							color='primary'
							text='send message'
							small
						/>
					</v-col>
				</v-expand-transition>

				<v-expand-transition>
					<v-col cols='12' md='10' class='ma-0 pa-0' v-if='sendMessage'>
						<ExtraSendMessage
							@cancel='sendMessage=false'
							@refresh='refresh'
							@updateExtraInfo='updateExtraInfo'
							:device='device'
							:maxConnected='maxConnected'
						/>
					</v-col>
				</v-expand-transition>

			</v-row>

			<v-expand-transition>
				<v-row align='start' justify='center' class='ma-0 pa-0 no-gutters mb-2' v-if='maxConnected && !sendMessage' >
					<v-col cols='auto' class='text-center ma-0 pa-0'>
						<span class='font-weight-bold text-pi small-text'>max clients already connected</span>
					</v-col>
				</v-row>
			</v-expand-transition>

		</template>

	</AppCard>
</template>

<script setup lang='ts'>

import { axios_device } from '@/services/axios';
import { mdiForum } from '@mdi/js';
import type { TDeviceInfo, TExtraTableRow, TSelectConnectedClient } from '@/types';
import ActionButton from '@/components/Buttons/ActionButton.vue';
import ExtraBandwidth from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraBandwidth.vue';
import AppCard from '@/components/Card/AppCard.vue';
import ExtraTable from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraConnectedTable.vue';
import ExtraSendMessage from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraSendMessage.vue';
import { useDisplay } from 'vuetify';
const { smAndDown } = useDisplay();

onBeforeUnmount(() => {
	clear();
});
	
const connectedDevice = computed((): Array<TExtraTableRow> => {
	return [ props.device ];
});
		
const deviceOnline = computed((): boolean => {
	const timestamp_online = props.device.timestamp_online ? new Date(props.device.timestamp_online) : null;
	const timestamp_offline = props.device.timestamp_offline ? new Date(props.device.timestamp_offline) : null;
	return timestamp_online && !timestamp_offline ? true : false;
});
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const maxConnected = computed((): boolean => {
	return connectedClients.value.length >= props.device.max_clients;
});

const onlineColor = computed((): string => {
	return deviceOnline.value ? 'text-primary' : 'text-pi';
});
const orderBandwidth = computed((): string => {
	return smAndDown.value ? '1' : singleRow.value ? '2': '3';
});
const orderClient = computed((): string => {
	return singleRow.value ? '3': '3';
});
const orderDevice = computed((): string => {
	return smAndDown.value ? '2' : '1';
});
const paused = computed((): boolean => {
	return props.device.paused;
});
const ttl = computed((): boolean => {
	return deviceModule().get_ttl(props.device.name_of_device) > 0;
});
	
const connectedClients: Ref<Array<TSelectConnectedClient>> = ref([]);
const isIntersecting = ref(false);
const refreshInterval = ref(0);
const sendMessage = ref(false);
const hidden: Ref<Array<boolean>> = ref([ false, false, false ]);
const singleRow = ref(false);
const init = ref(false);

// const gotoId = (): string => {
// 	return `${props.device.name_of_device}-ws-send-box`;
// };
	
const clear = (): void => {
	init.value = false;
	clearInterval(refreshInterval.value);
};
const handleHidden = (value: boolean, index: 0|1|2): void => {
	hidden.value[index] = value;
	if (!hidden.value.includes(false)) singleRow.value = true;
	else singleRow.value = false;
};
const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};
const emit = defineEmits([ 'emitClose', 'refresh' ]);
const refresh = (): void => {
	emit('refresh');
};
const updateExtraInfo = async (): Promise<void> => {
	loading.value = true;
	const data = await axios_device.named_get({ name: props.device.name_of_device });
	if (data) connectedClients.value = data;
	loading.value = false;
	init.value = true;
};

const props = defineProps<{device: TDeviceInfo}>();

watch(isIntersecting, async (i) => {
	if (i) {
		refresh();
		updateExtraInfo();
		refreshInterval.value = setInterval(() => updateExtraInfo(), 10000);
	}
	else clear();
},
);
watch(paused, (i:boolean): void => {
	if (i) emit('emitClose');
});

</script>