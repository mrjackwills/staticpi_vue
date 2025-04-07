<template>
	<ThePage :heading='pageTitle' :pageReady='pageReady' :heading-justify='"start"'>

		<template v-slot:body>
			<section>
				<v-expand-transition>
					<NoDevices v-if='devices.length === 0 && !showAdd' />
				</v-expand-transition>

				<section v-if='devices.length > 0'>
					<AllDeviceTable @refresh='getData' v-model:tableData='devices' class='ma-0 pa-0' />

					<v-col cols='auto' class='ma-0 pa-0 mb-2'>
						<v-row align='center' justify='center' class='ma-0 pa-0'>
							<v-col cols='auto' class='ma-0 pa-0'>
								<NumberOfDevices />
							</v-col>
						</v-row>
					</v-col>

				</section>

				<v-expand-transition>
					<v-row v-if='!showAdd' align='center' justify='center' no-gutters class='ma-0 pa-0 mb-3'>

						<v-col cols='12' md='auto' :class='smAndDown ? `mt-3` : `mr-3`'
							v-if='devices.length > 0 && !showAdd' :order='smAndDown ? "2" : "1"' class='ma-0 pa-0 '>
							<DeleteAll @refresh='getData' />
						</v-col>

						<v-col cols='12' md='auto' class='ma-0 pa-0 ' :order='smAndDown ? "1" : "2"'>
							<v-tooltip v-if='disabled' v-model='tooltip_add' content-class='tooltip' activator='parent'
								location='top center'>
								<span>Max device limit reached</span>
							</v-tooltip>

							<ActionButton @click='showAddNewDevice' @mouseover='tooltip(true)'
								@mouseleave='tooltip(false)' :block='true' v-model:disabled='disabled' :icon='mdiPlus'
								:iconFirst='false' :mouseOverEvents='true' text='add device' />
						</v-col>
					</v-row>
				</v-expand-transition>
			</section>

			<section v-if='showAdd'>
				<v-expand-transition>
					<AddDevice v-if='showAdd' @refresh='getData' @show-add-new-device='showAddNewDevice' class='' />
				</v-expand-transition>
			</section>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { mdiPlus } from '@mdi/js';
import { useDisplay } from 'vuetify';
import type { TDeviceInfo } from '@/types';

const { smAndDown } = useDisplay();

const [browserStore, deviceStore, loadingStore, userStore] = [browserModule(), deviceModule(), loadingModule(), userModule()];

onBeforeMount(async () => {
	await getData();
	pageReady.value = true;

});

onMounted(() => {
	browserStore.set_description(`staticPi devices page - view and control your staticPi devices`);
	browserStore.set_title(pageTitle);
});

const devices = computed({
	get (): Array<TDeviceInfo> {
		return deviceStore.all;
	},
	set (a: Array<TDeviceInfo>): void {
		deviceStore.set_all_devices(a);
	}
});
const disabled = computed((): boolean => devices.value.length >= userStore.maxDevices);
const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});
const online = computed(() => browserStore.online);
const force_refresh = computed({
	get (): boolean {
		return browserStore.force_refresh;
	},
	set (b: boolean): void {
		browserStore.set_force_refresh(b);
	}
});

const pageTitle = 'Devices';

const pageReady = ref(false);
const showAdd = ref(false);
const tooltip_add = ref(false);

/**
 ** Update device data
 */
const getData = async (): Promise<void> => {
	if (!online.value) return;
	loading.value = true;
	await axios_device.deviceAll_get();
	loading.value = false;
	// data_ready.value = true;
};

/**
** Show add device component
*/
const showAddNewDevice = (): void => {
	if (disabled.value) return;
	showAdd.value = !showAdd.value;
};

/**
** Show a tooltip saying max devices.
** Uses disabled boolean which also disable the add new device button itself, base upon device numbers
*/
const tooltip = (b: boolean): void => {
	if (!disabled.value) return;
	tooltip_add.value = b;
};

watch(force_refresh, (i: boolean): void => {
	if (i) {
		// Why is it using a setTimeout?
		setTimeout(() => {
			getData();
			force_refresh.value = false;
		}, 350);
	}
});

</script>