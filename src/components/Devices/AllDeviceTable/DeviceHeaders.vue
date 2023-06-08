<template>
	<section v-if='mdAndUp'>
		<v-row align='center' justify='space-between' class='ma-0 pa-0 no-gutters py-2'>
			<v-col v-for='(item, index) in headings' :key='index'
				:cols='item.cols' class='text-center unselectable ma-0 pa-0 text-table-heading text-black small-text' :class='{"cl": item.sortable}' @click='item.sortable ? sort(item.text) : undefined'>
				<DocumentationLink v-if='item.link' :section='item.link' />
				{{ item.text }}
				<v-icon
					v-if='item.sortable'
					:icon='columnIcon(item.text)'
					:size='smAndDown?"x-small":"small"'
					color='primary'
				/>
			</v-col>

		</v-row>
		<v-divider class='mb-4' />
	</section>

</template>

<script setup lang='ts'>
import { mdiArrowDownBold, mdiArrowUpBold, mdiSwapVerticalBold } from '@mdi/js';
import { useDisplay } from 'vuetify';
import type { TDeviceInfo, TSortableColumns, TSortedBy } from '@/types';

const { mdAndUp, smAndDown } = useDisplay();

const deviceStore = deviceModule();
const tableData = computed((): Array<TDeviceInfo> => {
	return deviceStore.all;
});
const devicesUpdatedAxios = computed((): Date => {
	return deviceStore.timestamp;
});
	
const headings = [
	{
		text: 'connection',
		cols: '1',
		sortable: true,
		link: ''
	},
	{
		text: 'name',
		cols: '2',
		sortable: true,
		link: ''
	},
	{
		text: 'API key',
		cols: '1',
		sortable: false,
		link: ''
	},
	{
		text: 'bandwidth',
		cols: '1',
		sortable: true,
		link: 'bandwidth'
	},
	{
		text: 'max clients',
		cols: '2',
		sortable: true,
		link: ''
	},
	{
		text: 'structured data',
		cols: '1',
		sortable: true,
		link: 'structured-data'
	},
	{
		text: 'device password',
		cols: '2',
		sortable: true,
		link: 'connect-with-password'
	},
	{
		text: 'status',
		cols: '1',
		sortable: true,
		link: 'device-status'
	},
	{
		text: 'delete',
		cols: '1',
		sortable: false,
		link: ''
	},
] as const;

const sortedBy: Ref<TSortedBy>= ref({ name: undefined, largestFirst: true });

const columnIcon = (columnName: TSortableColumns): string => {
	return sortedBy.value.name === columnName? sortedBy.value.largestFirst? mdiArrowUpBold : mdiArrowDownBold :mdiSwapVerticalBold;
};

const sort = (heading: TSortableColumns): void => {
	switch (heading) {
	case 'name':
		sortByName();
		break;
	case 'connection':
		sortByConnection();
		break;
	case 'bandwidth':
		sortByBandwidth();
		break;
	case 'max clients' :
		sortByMaxClients();
		break;
	case 'structured data':
		sortByStructuredData();
		break;
	case 'device password':
		sortByPasswordRequired();
		break;
	case 'status':
		sortByDeviceStatus();
		break;
	}
};

const sortByConnection = (): void => {
	sortedBy.value.name = 'connection';
	const tmp = tableData.value.sort((a, b) => {
		const onlineA = a.timestamp_online && !a.timestamp_offline ? true : false;
		const onlineB = b.timestamp_online && !b.timestamp_offline ? true : false;
		if (onlineA && onlineB && a.timestamp_online && b.timestamp_online) {
			return a.timestamp_online > b.timestamp_online ? 1 : -1;
		}
		if (onlineA && !onlineB) return sortedBy.value.largestFirst ? -1 : 1;
		if (!onlineA && onlineB) return sortedBy.value.largestFirst ? 1 : -1;
		return a.name_of_device.localeCompare(b.name_of_device);
	});
	sortedBy.value.largestFirst = !sortedBy.value.largestFirst;
	deviceStore.set_all_devices(tmp);
};

const sortByName = (): void => {
	sortedBy.value.name = 'name';
	const tmp = sortedBy.value.largestFirst ? tableData.value.sort((a, b) => a.name_of_device.localeCompare(b.name_of_device)) : tableData.value.sort((a, b) => b.name_of_device.localeCompare(a.name_of_device));
	sortedBy.value.largestFirst = !sortedBy.value.largestFirst;
	deviceStore.set_all_devices(tmp);
};
	
const sortByBandwidth = (): void => {
	sortedBy.value.name = 'bandwidth';
	const tmp = tableData.value.sort((a, b) => {
		return Number(a.pi_bytes_month_out??0) + Number(a.client_bytes_month_out??0) >= Number(b.pi_bytes_day_out??0) + Number(b.client_bytes_month_out??0) ?
			sortedBy.value.largestFirst
				? -1 : 1 : sortedBy.value.largestFirst
				? 1 : -1;
	});
	sortedBy.value.largestFirst = !sortedBy.value.largestFirst;
	deviceStore.set_all_devices(tmp);
};

const sortByMaxClients = (): void => {
	sortedBy.value.name = 'max clients';
	const tmp = tableData.value.sort((a, b) => {
		if (a.max_clients > b.max_clients) return sortedBy.value.largestFirst ? -1 : 1;
		if (a.max_clients < b.max_clients) return sortedBy.value.largestFirst ? 1 : -1;
		return a.name_of_device.localeCompare(b.name_of_device);
	});
	sortedBy.value.largestFirst = !sortedBy.value.largestFirst;
	deviceStore.set_all_devices(tmp);
};

const sortByStructuredData = (): void => {
	sortedBy.value.name = 'structured data';
	const tmp = tableData.value.sort((a, b) => {
		if (a.structured_data && !b.structured_data) return sortedBy.value.largestFirst ? -1 : 1;
		if (!a.structured_data && b.structured_data) return sortedBy.value.largestFirst ? 1:-1;
		return a.name_of_device.localeCompare(b.name_of_device);
	});
	sortedBy.value.largestFirst = !sortedBy.value.largestFirst;
	deviceStore.set_all_devices(tmp);
};

const sortByPasswordRequired = (): void => {
	sortedBy.value.name = 'device password';
	const tmp = tableData.value.sort((a, b) => {
		if (a.device_password_required && !b.device_password_required) return sortedBy.value.largestFirst ? -1 : 1;
		if (!a.device_password_required && b.device_password_required) return sortedBy.value.largestFirst ? 1:-1;
		return a.name_of_device.localeCompare(b.name_of_device);
	});
	sortedBy.value.largestFirst = !sortedBy.value.largestFirst;
	deviceStore.set_all_devices(tmp);
};

const sortByDeviceStatus = (): void=> {
	sortedBy.value.name = 'status';
	const tmp = tableData.value.sort((a, b) => {
		if (!a.paused && b.paused) return sortedBy.value.largestFirst ? -1 : 1;
		if (a.paused && !b.paused) return sortedBy.value.largestFirst ? 1:-1;
		return a.name_of_device.localeCompare(b.name_of_device);
	});
	sortedBy.value.largestFirst = !sortedBy.value.largestFirst;
	deviceStore.set_all_devices(tmp);
};

watch(devicesUpdatedAxios, (_)=> {
	if (sortedBy.value.name) {
		sortedBy.value.largestFirst = !sortedBy.value.largestFirst;
		sort(sortedBy.value.name);
	}
});
</script>

<style>

.text-table-heading {
	font-size: .65rem;
	text-transform: uppercase;
	font-weight: 600;
}

</style>