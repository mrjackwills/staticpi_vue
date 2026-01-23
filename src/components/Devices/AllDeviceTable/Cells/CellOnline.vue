<template>
	<v-row align='center' class='' :justify no-gutters>
		<v-col class='ma-0 pa-0' cols='auto'>

			<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
				<span> {{ tooltipText }}</span>
			</v-tooltip>

			<v-icon :color :disabled='paused' :icon :size='smAndDown ? "small" : "default"' />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import type { TDeviceInfo } from '@/types'
import { mdiWifi, mdiWifiOff } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mdAndUp, smAndDown } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

const tooltipText = computed(() => timestamp_online.value && !timestamp_offline.value
	? `online since ${timestamp_online.value.toLocaleString()}`
	: (timestamp_online.value && timestamp_offline.value
		? `offline since ${timestamp_offline.value.toLocaleString()}`
		: 'never connected'))
const online = computed(() => timestamp_online.value && !timestamp_offline.value ? true : false)
const color = computed(() => online.value ? 'primary' : 'pi')
const icon = computed(() => online.value ? mdiWifi : mdiWifiOff)
const justify = computed(() => mdAndUp.value ? 'center' : 'end')
const timestamp_online = computed(() => props.device.timestamp_online ? new Date(props.device.timestamp_online) : null)
const timestamp_offline = computed(() => props.device.timestamp_offline ? new Date(props.device.timestamp_offline) : null)
const paused = computed(() => props.device.paused)

const props = defineProps<{ device: TDeviceInfo }>()

</script>

<style>
.v-data-table td {
	margin: none;
	padding: none
}
</style>
