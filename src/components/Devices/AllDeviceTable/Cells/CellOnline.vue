<template>
	<v-row align='center' :justify='justify' no-gutters class=''>
		<v-col cols='auto' class='ma-0 pa-0'>

			<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
				<span> {{ tooltipText }}</span>
			</v-tooltip>

			<v-icon :color='color' :disabled='paused' :icon='icon' :size='smAndDown ? "small" : "default"' />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { mdiWifi, mdiWifiOff } from '@mdi/js';
import { useDisplay } from 'vuetify';
import type { TDeviceInfo } from '@/types';

const { mdAndUp, smAndDown } = useDisplay();

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value));

const tooltipText = computed(() => timestamp_online.value && !timestamp_offline.value ?
	`online since ${timestamp_online.value.toLocaleString()}` : timestamp_online.value && timestamp_offline.value ?
		`offline since ${timestamp_offline.value.toLocaleString()}` : 'never connected');
const online = computed(() => timestamp_online.value && !timestamp_offline.value ? true : false);
const color = computed(() => online.value ? 'primary' : 'pi');
const icon = computed(() => online.value ? mdiWifi : mdiWifiOff);
const justify = computed(() => mdAndUp.value ? 'center' : 'end');
const timestamp_online = computed(() => props.device.timestamp_online ? new Date(props.device.timestamp_online) : null);
const timestamp_offline = computed(() => props.device.timestamp_offline ? new Date(props.device.timestamp_offline) : null);
const paused = computed(() => props.device.paused);

const props = defineProps<{ device: TDeviceInfo }>();

</script>

<style>
.v-data-table td {
	margin: none;
	padding: none
}
</style>