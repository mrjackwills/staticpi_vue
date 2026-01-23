<template>
	<AppCard
		:has-button='false'
		lg='12'
		sm='12'
		xl='12'
	>
		<template #start>
			<DeviceHeaders />

		</template>
		<template #body>

			<v-row
				v-for='(device, index) in tableData'
				:key='device.name_of_device'
				align='center'
				class='ma-0 pa-0'
				justify='center'
			>
				<DeviceRow :device @refresh='refresh' />
				<v-col v-if='index!==tableData.length-1' class='ma-0 pa-0 py-1' cols='12'>
					<v-divider />
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang='ts'>

const deviceStore = deviceModule()

onBeforeUnmount(() => {
	clearInterval(refreshInterval.value)
})

onMounted(() => {
	startRefreshInterval()
})

const tableData = computed(() => deviceStore.all)

const refreshInterval = ref(0)

const emit = defineEmits(['refresh'])

function refresh (): void {
	emit('refresh')
	clearInterval(refreshInterval.value)
	startRefreshInterval()
}

function startRefreshInterval (): void {
	refreshInterval.value = setInterval(() => emit('refresh'), 15_000)
}

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
