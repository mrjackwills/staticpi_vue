<template>
	<v-row align='center' justify='center' class='ma-0 pa-0 no-gutters'>
		<v-col :cols='computedCols' class='ma-0 pa-0'>
			<span class='font-weight-bold' :class='text_size'>number of devices: </span> <span :class='[deviceLimit_class, text_size]'>{{ deviceNumber }} / {{ maxDevices }}</span>
		</v-col>
		<v-col :cols='computedCols' class='ma-0 pa-0'>
			<span class='font-weight-bold' :class='text_size'>monthly bandwidth: </span>
			<span :class='[bandwidthLimit_class, text_size]' >{{ converted_total.total }} {{ converted_total.unit }} / {{ converted_limit.total }} {{ converted_limit.unit }}</span>
			<span class='ml-2 font-weight-medium' :class='[percentageClass, text_size]'>({{ used_percentage }}%)</span>
			<v-tooltip activator='parent' location='top center' class='tooltip-z'>
				<span>{{ totalBandwidth }} bytes in {{ thisMonth }}</span>
			</v-tooltip>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import { months } from '@/vanillaTS/globalConst';
import { useDisplay } from 'vuetify';
import type { TConvertBytes } from '@/types';

const { smAndDown } = useDisplay();
const [ deviceStore, userStore ] = [ deviceModule(), userModule() ];

const bandwidthLimit_class = computed((): string => {
	return Number(maxBandwidth.value) - Number(totalBandwidth.value) <= 0 ? 'text-pi font-weight-black' : '';
});
const percentageClass = computed((): string => {
	return Number(maxBandwidth.value) - Number(totalBandwidth.value) <= 0 ? 'text-pi font-weight-black' : 'text-secondary';
});
const deviceNumber = computed((): number => {
	return deviceStore.numberOfDevices;
});
const used_percentage = computed((): string => {
	if (Number(totalBandwidth.value) > 0) {
		return Number(totalBandwidth.value) > 0 ? (Number(totalBandwidth.value) / Number(maxBandwidth.value) *100).toFixed(2) : '00.00';
	} else {
		return '00.00';
	}
});
const deviceLimit_class = computed((): string => {
	return deviceNumber.value >= maxDevices.value ? 'text-pi font-weight-black' : '';
});
const maxBandwidth = computed((): string => {
	return userStore.maxBandwidth;
});
const maxDevices = computed((): number => {
	return userStore.maxDevices;
});
const text_size = computed((): string => {
	return smAndDown.value ? 'small-text' : '';
});
const totalBandwidth = computed((): string => {
	return `${deviceStore.total_counted_bandwidth}`;
});
const thisMonth = computed((): string => {
	return months[new Date().getMonth()] ?? '[ERROR]';
});
const computedCols = computed((): string => {
	return smAndDown.value ? '12' : props.rowCols;
});
const converted_limit = computed((): TConvertBytes => {
	return convert_bytes(maxBandwidth.value);
});
const converted_total = computed((): TConvertBytes => {
	return convert_bytes(totalBandwidth.value);
});

const props = defineProps({
	rowCols: {
		type: String,
		default: '12'
	}
});
</script>