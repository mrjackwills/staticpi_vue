<template>
	<ThePage :heading='pageTitle' :heading-justify='"start"' :page-ready>

		<template #body>
			<section>
				<v-expand-transition>
					<NoDevices v-if='devices.length === 0 && !showAdd' />
				</v-expand-transition>

				<section v-if='devices.length > 0'>
					<AllDeviceTable class='ma-0 pa-0 px-3' :table-data='devices' @refresh='getData' />

					<v-col class='ma-0 pa-0 mb-2' cols='auto'>
						<v-row class='align-center ma-0 pa-0 justify-center'>
							<v-col class='ma-0 pa-0' cols='auto'>
								<NumberOfDevices />
							</v-col>
						</v-row>
					</v-col>

				</section>

				<v-expand-transition>
					<v-row
						v-if='!showAdd'
						class='ma-0 pa-0 mb-3 justify-center align-center'
						density='compact'
					>

						<v-col
							v-if='devices.length > 0 && !showAdd'
							class='ma-0 pa-0 '
							:class='smAndDown ? `mt-3` : `mr-3`'
							cols='12'
							md='auto'
							:order='smAndDown ? "2" : "1"'
						>
							<DeleteAll @refresh='getData' />
						</v-col>

						<v-col class='ma-0 pa-0 ' cols='12' md='auto' :order='smAndDown ? "1" : "2"'>
							<v-tooltip
								v-if='disabled'
								v-model='tooltip_add'
								activator='parent'
								content-class='tooltip'
								location='top center'
							>
								<span>Max device limit reached</span>
							</v-tooltip>

							<ActionButton
								:block='true'
								:disabled
								:icon='mdiPlus'
								:icon-first='false'
								:mouse-over-events='true'
								text='add device'
								@click='showAddNewDevice'
								@mouseleave='tooltip(false)'
								@mouseover='tooltip(true)'
							/>
						</v-col>
					</v-row>
				</v-expand-transition>
			</section>

			<section v-if='showAdd'>
				<v-expand-transition>
					<AddDevice v-if='showAdd' class='' @refresh='getData' @show-add-new-device='showAddNewDevice' />
				</v-expand-transition>
			</section>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import type { TDeviceInfo } from '@/types'
import { mdiPlus } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_device } from '@/services/axios'

const { smAndDown } = useDisplay()

const [browserStore, deviceStore, loadingStore, userStore] = [browserModule(), deviceModule(), loadingModule(), userModule()]

onBeforeMount(async () => {
	await getData()
	pageReady.value = true
})

onMounted(() => {
	browserStore.set_description(`staticPi devices page - view and control your staticPi devices`)
	browserStore.set_title(pageTitle)
})

const devices = computed({
	get (): Array<TDeviceInfo> {
		return deviceStore.all
	},
	set (a: Array<TDeviceInfo>): void {
		deviceStore.set_all_devices(a)
	},
})
const disabled = computed((): boolean => devices.value.length >= userStore.maxDevices)
const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean): void {
		loadingStore.set_loading(b)
	},
})
const online = computed(() => browserStore.online)
const force_refresh = computed({
	get (): boolean {
		return browserStore.force_refresh
	},
	set (b: boolean): void {
		browserStore.set_force_refresh(b)
	},
})

const pageTitle = 'Devices'

const pageReady = ref(false)
const showAdd = ref(false)
const tooltip_add = ref(false)

/**
 ** Update device data
 */
async function getData (): Promise<void> {
	if (!online.value) return
	loading.value = true
	await axios_device.deviceAll_get()
	loading.value = false
	// data_ready.value = true;
}

/**
 ** Show add device component
 */
function showAddNewDevice (): void {
	if (disabled.value) return
	showAdd.value = !showAdd.value
}

/**
 ** Show a tooltip saying max devices.
 ** Uses disabled boolean which also disable the add new device button itself, base upon device numbers
 */
function tooltip (b: boolean): void {
	if (!disabled.value) return
	tooltip_add.value = b
}

watch(force_refresh, (i: boolean): void => {
	if (i) {
		// Why is it using a setTimeout?
		setTimeout(() => {
			getData()
			force_refresh.value = false
		}, 350)
	}
})

</script>
