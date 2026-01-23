<template>
	<AppCard
		v-intersect='onIntersect'
		:flat='true'
		:has-button='false'
		lg='12'
		my='ma-0 pa-0'
		:outlined='false'
		:pad='false'
		sm='12'
		:tile='true'
		xl='12'
	>
		<template #body>

			<v-row align='center' class='ma-0 pa-0 no-gutters' justify='center'>
				<v-col class='ma-0 pa-0 text-center' cols='auto'>
					<span class='font-weight-bold' :class='onlineColor'>{{ device.name_of_device }}</span> was created
					on {{ new Date(device.creation_date).toLocaleString() }}
				</v-col>
			</v-row>

			<v-row align='center' class='ma-0 pa-0 no-gutters' justify='center'>
				<v-col class='ma-0 pa-0 text-center ma-1' cols='11'>
					<ExtraCache :device />
				</v-col>
			</v-row>

			<v-row align='start' class='ma-0 pa-0 no-gutters' justify='center'>
				<v-col class='ma-0 pa-0' cols='11'>
					<v-row align='start' class='ma-0 pa-0 no-gutters' justify='center'>
						<v-col class='ma-0 pa-0' cols='11' md='4' :order='orderDevice'>
							<ExtraConnectedTable
								:class='{ "pr-6": !smAndDown }'
								:is-device='true'
								:online='deviceOnline'
								:table-rows='connectedDevice'
								@hidden='handleHidden($event, 0)'
							/>
						</v-col>

						<v-col class='ma-0 pa-0' cols='11' md='4' :order='orderClient'>
							<ExtraConnectedTable
								:class='{ "pl-6": !smAndDown }'
								:is-device='false'
								:online='connectedClients.length > 0'
								:table-rows='connectedClients'
								@hidden='handleHidden($event, 1)'
							/>
						</v-col>

						<v-col class='ma-0 pa-0' cols='11' :md='singleRow ? "4" : "8"' :order='orderBandwidth'>
							<ExtraBandwidth class='' :device @hidden='handleHidden($event, 2)' />
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row align='start' class='ma-0 pa-0' justify='center'>

				<v-expand-transition>
					<v-col v-if='!sendMessage' class='ma-0 pa-0 mt-2' cols='11'>
						<ActionButton
							:block='true'
							color='primary'
							:disabled='maxConnected || ttl'
							:icon='mdiForum'
							small
							text='send message'
							@click='sendMessage = true'
						/>
					</v-col>
				</v-expand-transition>

				<v-expand-transition>
					<v-col v-if='sendMessage' class='ma-0 pa-0' cols='12' md='10'>
						<ExtraSendMessage
							:device
							:max-connected
							@cancel='sendMessage = false'
							@refresh='refresh'
							@update-extra-info='updateExtraInfo'
						/>
					</v-col>
				</v-expand-transition>

			</v-row>

			<v-expand-transition>
				<v-row
					v-if='maxConnected && !sendMessage'
					align='start'
					class='ma-0 pa-0 no-gutters mb-2'
					justify='center'
				>
					<v-col class='text-center ma-0 pa-0' cols='auto'>
						<span class='font-weight-bold text-pi small-text'>max clients already connected</span>
					</v-col>
				</v-row>
			</v-expand-transition>

		</template>

	</AppCard>
</template>

<script setup lang='ts'>

import type { TDeviceInfo, TExtraTableRow, TSelectConnectedClient } from '@/types'
import { mdiForum } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_device } from '@/services/axios'
const { smAndDown } = useDisplay()

onBeforeUnmount(() => {
	clear()
})

const connectedDevice = computed((): Array<TExtraTableRow> => [props.device])

const deviceOnline = computed((): boolean => {
	const timestamp_online = props.device.timestamp_online ? new Date(props.device.timestamp_online) : null
	const timestamp_offline = props.device.timestamp_offline ? new Date(props.device.timestamp_offline) : null
	return timestamp_online && !timestamp_offline ? true : false
})
const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

const maxConnected = computed(() => connectedClients.value.length >= props.device.max_clients)
const onlineColor = computed(() => deviceOnline.value ? 'text-primary' : 'text-pi')
const orderBandwidth = computed(() => smAndDown.value ? '1' : (singleRow.value ? '2' : '3'))
const orderClient = computed(() => singleRow.value ? '3' : '3')
const orderDevice = computed(() => smAndDown.value ? '2' : '1')
const paused = computed(() => props.device.paused)
const ttl = computed(() => deviceModule().get_ttl(props.device.name_of_device) > 0)

const connectedClients: Ref<Array<TSelectConnectedClient>> = ref([])
const isIntersecting = ref(false)
const refreshInterval = ref(0)
const sendMessage = ref(false)
const hidden: Ref<Array<boolean>> = ref([false, false, false])
const singleRow = ref(false)
const init = ref(false)

function clear (): void {
	init.value = false
	clearInterval(refreshInterval.value)
}
function handleHidden (value: boolean, index: 0 | 1 | 2): void {
	hidden.value[index] = value
	singleRow.value = hidden.value.includes(false) ? false : true
}
function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}
const emit = defineEmits(['emit-close', 'refresh'])
function refresh (): void {
	emit('refresh')
}
async function updateExtraInfo (): Promise<void> {
	loading.value = true
	const data = await axios_device.named_get({ name: props.device.name_of_device })
	if (data) connectedClients.value = data
	loading.value = false
	init.value = true
}

const props = defineProps<{ device: TDeviceInfo }>()

watch(isIntersecting, async i => {
	if (i) {
		refresh()
		updateExtraInfo()
		refreshInterval.value = setInterval(() => updateExtraInfo(), 10_000)
	} else clear()
})
watch(paused, (i: boolean): void => {
	if (i) emit('emit-close')
})

</script>
