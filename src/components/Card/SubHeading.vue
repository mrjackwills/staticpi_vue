<template>
	<v-row :justify='to_justify' align='center' class='ma-0 pa-0' no-gutters>
		<v-col cols='auto' class='ma-0 pa-0'>
			<div class='text-center font-weight-bold' :class='[headingSize, headingColor]'>{{ heading }}</div>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify';
import type { TJustify } from '@/types';

const { mdAndUp } = useDisplay();

const headingSize = computed((): string => {
	return props.heading_size ? props.heading_size : mdAndUp.value ? 'text-h6' : 'text-h7';
});
const headingColor = computed((): string => {
	return `text-${props.color}`;
});

const to_justify = computed((): TJustify=> {
	switch (props.justify) {
	case 'end':
		return 'end';
	case 'start':
		return 'start';
	case 'space-around':
		return 'space-around';
	case 'space-between':
		return 'space-between';
	case 'space-evenly':
		return 'space-evenly';
	case 'stretch':
		return 'stretch';
	}
	return 'center';
});

const props = defineProps({
	color: {
		type: String,
		default: 'pi'
	},
	heading: {
		type: String,
		required: true,
	},
	heading_size: {
		type: String,
	},
	justify: {
		type: String,
		default: 'center',
	},
});
</script>