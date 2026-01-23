<template>
	<v-col class='pa-0 ma-0' cols='12'>
		<span :id='createDeviceId' class='device_row' />

		<v-row align='center' class='ma-0 pa-0' justify='space-around'>
			<v-col
				v-for='(item, index) in cells'
				:key='index'
				class='ma-0 pa-0'
				cols='12'
				:md='item.cols'
			>
				<v-row align='center' class='no-gutters pa-0 ma-0' justify='space-around'>
					<v-col
						v-if='smAndDown'
						class='my-3 ma-0 pa-0 font-weight-bold unselectable text-uppercase small-text text-right'
						cols='4'
					>
						<DocumentationLink v-if='item.link' :section='item.link' :xsmall='true' />
						{{ item.text }}:
					</v-col>
					<v-col class='ma-0 pa-0' :cols='smAndDown ? "7" : "12"'>
						<component :is='item.component' :device @refresh='refresh' />
					</v-col>
				</v-row>
			</v-col>
		</v-row>

		<v-row align='center' class='ma-0 pa-0 py-1 mt-2' :class='{ "cl": !device.paused }' justify='center'>
			<v-col class='ma-0 pa-0' cols='auto'>
				<v-btn
					class='elevation-0'
					color='secondary'
					:disabled='device.paused'
					rounded
					size='small'
					:variant='show_extra ? "outlined" : "flat"'
					@click='click_extra'
				>
					<v-row align='center' class='unselectable px-1' justify='space-around'>
						<v-col class='ma-0 pa-0' cols='auto'>
							<v-icon
								:class='show_extra ? "" : "flipy"'
								:color='show_extra ? "secondary" : "white"'
								:icon='mdiChevronDoubleUp'
								size='small'
							/>
						</v-col>
						<v-col class='ma-0 pa-0' cols='auto'>
							<span class='text-overline' :class='show_extra ? "text-secondary" : "text-white"'>
								{{ show_text }}
							</span>
						</v-col>
					</v-row>
				</v-btn>
			</v-col>
		</v-row>

		<v-expand-transition>
			<section v-if='show_extra'>
				<ExtraInfo :device @emit-close='refresh_device' @refresh='refresh' />
			</section>
		</v-expand-transition>
	</v-col>

</template>

<script setup lang="ts">
import type { TDeviceInfo } from '@/types'
import { mdiChevronDoubleUp } from '@mdi/js'
import { useDisplay } from 'vuetify'
import CellApiKey from '@/components/Devices/AllDeviceTable/Cells/CellApiKey.vue'
import CellBandwidth from '@/components/Devices/AllDeviceTable/Cells/CellBandwidth.vue'
import CellDelete from '@/components/Devices/AllDeviceTable/Cells/CellDelete.vue'
import CellDeviceName from '@/components/Devices/AllDeviceTable/Cells/CellDeviceName.vue'
import CellDevicePassword from '@/components/Devices/AllDeviceTable/Cells/CellDevicePassword.vue'
import CellMaxClients from '@/components/Devices/AllDeviceTable/Cells/CellMaxClients.vue'
import CellOnline from '@/components/Devices/AllDeviceTable/Cells/CellOnline.vue'
import CellPause from '@/components/Devices/AllDeviceTable/Cells/CellPause.vue'
import CellStructuredData from '@/components/Devices/AllDeviceTable/Cells/CellStructuredData.vue'
const { smAndDown } = useDisplay()

const show_extra = ref(false)

const show_text = computed(() => show_extra.value ? 'less' : 'more')

function click_extra (): void {
	if (!props.device.paused) show_extra.value = !show_extra.value
}

function refresh_device (): void {
	emit('refresh')
}

const cells = [
	{
		text: 'connection',
		cols: '1',
		component: CellOnline,
		link: '',
	},
	{
		text: 'name',
		cols: '2',
		component: CellDeviceName,
		link: '',
	},
	{
		text: 'API key',
		cols: '1',
		component: CellApiKey,
		link: '',
	},
	{
		text: 'bandwidth',
		cols: '1',
		component: CellBandwidth,
		link: 'bandwidth',
	},
	{
		text: 'max clients',
		cols: '2',
		component: CellMaxClients,
		link: '',
	},
	{
		text: 'structured data',
		cols: '1',
		component: CellStructuredData,
		link: 'structured-data',
	},
	{
		text: 'device password',
		cols: '2',
		component: CellDevicePassword,
		link: 'connect-with-password',
	},
	{
		text: 'status',
		cols: '1',
		component: CellPause,
		link: 'device-status',
	},
	{
		text: 'delete',
		cols: '1',
		component: CellDelete,
		link: '',
	},
] as const

const refreshInterval = ref(0)

const createDeviceId = computed(() => `${props.device.name_of_device}-extra`)

const emit = defineEmits(['refresh'])

function refresh (): void {
	emit('refresh')
	clearInterval(refreshInterval.value)
	startRefreshInterval()
}

function startRefreshInterval (): void {
	refreshInterval.value = setInterval(() => emit('refresh'), 15_000)
}

const props = defineProps<{ device: TDeviceInfo }>()

</script>

<style>
.device_row {
	scroll-margin: -10px;
}
</style>
