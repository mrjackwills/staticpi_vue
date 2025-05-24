<template>
	<v-row align='center' justify='center' class='ma-0 pa-0 no-gutters'>
		<v-col :cols='computedCols' class='ma-0 pa-0'>
			<span class='font-weight-bold' :class='text_size'>number of devices: </span> <span
				:class='[deviceLimit_class, text_size]'>{{ deviceNumber }} / {{ maxDevices }}</span>
		</v-col>
		<v-col :cols='computedCols' class='ma-0 pa-0'>
			<span class='font-weight-bold' :class='text_size'>monthly bandwidth: </span>
			<span :class='[bandwidthLimit_class, text_size]'>{{ converted_total.total }} {{ converted_total.unit }} / {{
				converted_limit.total }} {{ converted_limit.unit }}</span>
			<span class='ml-2 font-weight-medium' :class='[percentageClass, text_size]'>({{ used_percentage }}%)</span>
			<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
				<span>{{ totalBandwidth }} bytes in {{ thisMonth }}</span>
			</v-tooltip>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import { months } from '@/vanillaTS/globalConst';
import { useDisplay } from 'vuetify';

const { smAndDown, mobile } = useDisplay();
const [deviceStore, userStore] = [deviceModule(), userModule()];

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value));

const bandwidthLimit_class = computed(() => Number(maxBandwidth.value) - Number(totalBandwidth.value) <= 0 ? 'text-pi font-weight-black' : '');
const percentageClass = computed(() => Number(maxBandwidth.value) - Number(totalBandwidth.value) <= 0 ? 'text-pi font-weight-black' : 'text-secondary');
const deviceNumber = computed(() => deviceStore.numberOfDevices);
const used_percentage = computed(() => Number(totalBandwidth.value) > 0
	? Number(totalBandwidth.value) > 0 ? (Number(totalBandwidth.value) / Number(maxBandwidth.value) * 100).toFixed(2) : '00.00' : '00.00');
const deviceLimit_class = computed(() => deviceNumber.value >= maxDevices.value ? 'text-pi font-weight-black' : '');

const maxBandwidth = computed(() => userStore.maxBandwidth);
const maxDevices = computed(() => userStore.maxDevices);
const text_size = computed(() => smAndDown.value ? 'small-text' : '');
const totalBandwidth = computed(() => `${deviceStore.total_counted_bandwidth}`);
const thisMonth = computed(() => months[new Date().getMonth()] ?? '[ERROR]');
const computedCols = computed(() => smAndDown.value ? '12' : props.rowCols);
const converted_limit = computed(() => convert_bytes(maxBandwidth.value));
const converted_total = computed(() => convert_bytes(totalBandwidth.value));

const props = withDefaults(defineProps<{ rowCols?: string }>(), { rowCols: '12' });

</script>
