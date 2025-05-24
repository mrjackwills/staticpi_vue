<template>
	<v-row align='center' :justify='justify' no-gutters class='no-gutters pa-0 ma-0'>
		<v-col cols='auto' class=''>
			<span class='text-caption' :class='[bandwidthLimit_class, { "disabled": paused }]'>
				{{ converted_bandwidth.total }} {{ converted_bandwidth.unit }}
			</span>
			<v-tooltip v-if='show_tooltip' :disabled='device.paused' activator='parent' location='top center'
				content-class='tooltip'>
				<span>{{ current_month_bytes }} bytes in {{ months[new Date().getMonth()] }}</span>
			</v-tooltip>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import { months } from '@/vanillaTS/globalConst';
import { useDisplay } from 'vuetify';
import type { TDeviceInfo } from '@/types';
import type { VRow } from 'vuetify/components/VGrid';

const { mdAndUp, mobile } = useDisplay();

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value));

const converted_bandwidth = computed(() => convert_bytes(current_month_bytes.value));
const current_month_bytes = computed(() => `${Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)}`);
const bandwidthLimit_class = computed(() => Number(maxBandwidth.value) - Number(current_month_bytes.value) <= 0 ? 'text-pi font-weight-black' : '');
const justify = computed(() => mdAndUp.value ? 'center' : 'end');
const maxBandwidth = computed(() => userModule().maxBandwidth);
const paused = computed(() => props.device.paused);
const props = defineProps<{ device: TDeviceInfo }>();

</script>

<style scoped>
.disabled {
	color: rgba(0, 0, 0, 0.38) !important;
}
</style>
