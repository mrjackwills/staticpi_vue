<template>
	<section>
				
		<v-row
			v-for='(item, index) in tableData'
			:key='index'
			align='center'
			class='ma-0 pa-0 no-gutters hover-row unselectable'
			justify='space-between'
		>
			<v-col cols='12' class='ma-0 pa-0' >
				<v-row align='center' justify='space-between' class='ma-0 pa-0'>
					<v-col cols='6' class='ma-0 pa-0 text-left'>
						<span class='font-weight-bold' :class='{"small-text": mobile}'>
							{{ item.period }}
						</span>
					</v-col>
					
					<v-col class='ma-0 pa-0 text-right' cols='auto' >
						<v-row class='ma-0 pa-0 no-gutters' align='center' justify='end'>
							<v-col class='ma-0 pa-0' cols='12' md='auto'>
								<ExtraBandwidthCell :unit='item.unit' :total='item.total' variety='out' :borderRight='false'/>
								<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
									<span>{{ item.bytes }} bytes used {{ item.period }}</span>
								</v-tooltip>
							</v-col>
						</v-row>
					</v-col>
							
				</v-row>
				<v-divider v-if='index!==2' />
			</v-col>
		</v-row>
	</section>

</template>

<script setup lang="ts">
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import { useDisplay } from 'vuetify';
import ExtraBandwidthCell from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraBandwidthCell.vue';
import type { TDeviceInfo, TExtraBandwidthSimple } from '@/types';

const { mobile } = useDisplay();

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && mobile.value);
});

const tableData = computed((): Array<TExtraBandwidthSimple> =>{
	return [
		{
			period: 'last 24 hours',
			...convert_bytes(Number(props.device.pi_bytes_day_out) + Number(props.device.client_bytes_day_out)),
			bytes: `${Number(props.device.pi_bytes_day_out) + Number(props.device.client_bytes_day_out)}`,
		},
		{
			period: 'this month',
			...convert_bytes(Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)),
			bytes: `${Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)}`,
		},
		{
			period: 'all time',
			...convert_bytes(Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)),
			bytes: `${Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)}`,
		},
	];
});

const props = defineProps<{device: TDeviceInfo}>();
</script>
