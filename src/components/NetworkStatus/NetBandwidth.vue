
<template>

	<v-table class=''>
		<tbody>
			<tr v-for='(item, index) in computed_bandwidth' :key='index'>
				<td class='font-weight-bold'>
					<v-icon color='pi' class='mr-md-8 mr-sm-2' v-if='!smAndDown' :icon='item.icon' />
					<span :class='{"small-text" : smAndDown}'>{{ item.timespan }}</span>
				</td>
				<td class='text-right text-secondary'>
					<template v-if='init'>
						<v-row align='center' justify='end' class='ma-0 pa-0'>
							
							<v-col cols='auto' class='ma-0 pa-0' :class='mobileClass'>
								<div class='text-right'>
									<span class='font-weight-bold'> {{ item.in.human_readable.total }}</span>
									<span class='mr-1 font-weight-bold'>{{ item.in.human_readable.unit }}</span>
								</div>
								<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
									<span>{{ item.in.bytes }} bytes received</span>
								</v-tooltip>
							</v-col>
							<v-col cols='auto' class='ma-0 pa-0' v-if='!smAndDown'>
								<v-icon small color='secondary' :icon='mdiArrowDownBold' />
							</v-col>
						</v-row>
					</template>
					<v-progress-circular v-else :indeterminate='true' :size='20' color='primary' />
				</td>
				<td class='text-right text-primary'>
					<template v-if='init'>
						<v-row align='center' justify='end' class='ma-0 pa-0'>

							<v-col cols='auto' class='ma-0 pa-0' :class='mobileClass'>
								<div class='text-right'>
									<span class='font-weight-bold'> {{ item.out.human_readable.total }}</span>
									<span class='mr-1 font-weight-bold'>{{ item.out.human_readable.unit }}</span>
								</div>
								<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
									<span>{{ item.out.bytes }} bytes sent</span>
								</v-tooltip>
							</v-col>
							<v-col cols='auto' class='ma-0 pa-0'  v-if='!smAndDown'>
								<v-icon small color='primary' :icon='mdiArrowUpBold' />
							</v-col>
						</v-row>
					</template>
					<v-progress-circular v-else :indeterminate='true' :size='20' color='primary' />
				</td>
			</tr>
		</tbody>
	</v-table>
</template>

<script setup lang='ts'>

import { axios_incognito } from '@/services/axios';
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import { useDisplay } from 'vuetify';
import { mdiArrowDownBold, mdiArrowUpBold, mdiCalendarBlank, mdiClockOutline, mdiEarth } from '@mdi/js';
import type { TComputedBandwidth } from '@/types';

const { smAndDown, mobile } = useDisplay();

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && mobile.value);
});

onBeforeUnmount(() => {
	clearInterval(bandwidthInterval.value);
});

onMounted(async () => {
	await checkAll();
	bandwidthInterval.value = window.setInterval(checkBandwidth, 10000);
});
const computed_bandwidth = computed((): Array<TComputedBandwidth> => {
	return [
				
		{
			icon: mdiClockOutline,
			timespan: 'last hour',
			in: {
				human_readable: convert_bytes(bandwidth.value.hour_in),
				bytes: bandwidth.value.hour_in
			},
			out: {
				human_readable: convert_bytes(bandwidth.value.hour_out),
				bytes: bandwidth.value.hour_out
						
			}
		},
		{
			icon: mdiCalendarBlank,
			timespan: 'last 24 hours',
			in: {
				human_readable: convert_bytes(bandwidth.value.day_in),
				bytes: bandwidth.value.day_in
			},
			out: {
				human_readable: convert_bytes(bandwidth.value.day_out),
				bytes: bandwidth.value.day_out
						
			}
		},

		{
			icon: mdiEarth,
			timespan: 'all time',
			in: {
				human_readable: convert_bytes(bandwidth.value.total_in),
				bytes: bandwidth.value.total_in
			},
			out: {
				human_readable: convert_bytes(bandwidth.value.total_out),
				bytes: bandwidth.value.total_out
						
			}
		}
			
	];
});
		
const mobileClass = computed((): string => {
	return smAndDown.value ? 'small-text' : 'total-unit-width';
});
const init = ref(false);

const bandwidthInterval = ref(0);
const bandwidth = ref({
	day_in: 0,
	day_out: 0,
	hour_in: 0,
	hour_out: 0,
	month_in: 0,
	month_out: 0,
	total_in: 0,
	total_out: 0
});

const checkAll = async (): Promise<void> => {
	await checkBandwidth();
};

const checkBandwidth = async (): Promise<void> => {
	const bandwidthRequest = await axios_incognito.bandwidth_get();
	if (bandwidthRequest) bandwidth.value = bandwidthRequest;
	init.value = true;
};

</script>

<style scoped>
.total-unit-width{
	min-width: 3.4rem;
}

</style>