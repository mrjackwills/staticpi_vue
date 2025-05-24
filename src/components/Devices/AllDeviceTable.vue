<template>
	<AppCard
		:hasButton='false'
		sm='12'
		xl='12'
		lg='12'
	>
		<template v-slot:start >
			<DeviceHeaders />

		</template>
		<template v-slot:body >

			<v-row
				v-for='(device, index) in tableData'
				:key='device.name_of_device'
				align='center'
				justify='center'
				class='ma-0 pa-0'
			>
				<DeviceRow :device='device' @refresh='refresh' />
				<v-col cols='12' class='ma-0 pa-0 py-1' v-if='index!==tableData.length-1'>
					<v-divider />
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang='ts'>

const deviceStore = deviceModule();

onBeforeUnmount(() => {
	clearInterval(refreshInterval.value);
});

onMounted(() => {
	startRefreshInterval();
});

const tableData = computed(() => deviceStore.all);

const refreshInterval = ref(0);

const emit = defineEmits(['refresh']);

const refresh = (): void => {
	emit('refresh');
	clearInterval(refreshInterval.value);
	startRefreshInterval();
};

const startRefreshInterval = (): void => {
	refreshInterval.value = setInterval(() => emit('refresh'), 15000);
};

</script>

<style>
.text-table-heading {
	font-size: .65rem;
	text-transform: uppercase;
	font-weight: 600;
}

.countdown{
	font-feature-settings: 'tnum';
	font-variant-numeric: tabular-nums;
}
</style>
