<template>
	<v-row class='ma-0 pa-0 no gutters' align='center'>

		<v-col cols='auto' class='ma-0 pa-0'>
			<span v-if='smAndDown' class='font-weight-bold'>ip address: </span>
		</v-col>

		<v-spacer />

		<v-col cols='auto' class='ma-0 pa-0' order='2'>
			{{ ip }}
		</v-col>

		<v-col cols='auto' class='ma-0 pa-0' order='1'>
			<CopyButton color='primary' :toCopy='ip' tooltipMessage='IP address copied!' hoverMessage='click to copy IP address' density='compact' small/>
		</v-col>
		
	</v-row>
</template>

<script setup lang='ts'>
import CopyButton from '@/components/Buttons/CopyButton.vue';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay();
defineProps({
	ip: {
		type: String,
		required: true
	}
});
</script>