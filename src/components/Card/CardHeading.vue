<template>
	<v-row :justify='to_justify' align='center' class='ma-0 pa-0 no-gutters' :class='margin' no-gutters>
		<v-col cols='auto' class='ma-0 pa-0'>
			<div class='text-center text-pi font-weight-bold' :class='headingSize'>{{ heading }}</div>
			<v-divider v-if='divider' />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify';
import type { TJustify } from '@/types';

const { mdAndUp } = useDisplay();

const headingSize = computed((): string => {
	return props.size? props.size : mdAndUp.value ? 'text-h4' : 'text-h5';
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
	divider: {
		type: Boolean,
		default: false
	},
	heading: {
		type: String,
		required: true,
	},

	size: {
		type: String,
		required: false
	},
	
	justify: {
		type: String,
		default: 'center'
	},
	margin: {
		type: String,
		default: ''
	}
});
</script>