<template>
	<v-row :justify='justify' align='center' class='ma-0 pa-0 no-gutters' :class='margin' no-gutters>
		<v-col cols='auto' class='ma-0 pa-0'>
			<div class='text-center text-pi font-weight-bold' :class='headingSize'>{{ heading }}</div>
			<v-divider v-if='divider' />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify';
import type { VRow } from 'vuetify/components/VGrid';

const { mdAndUp } = useDisplay();

const headingSize = computed(() => props.size ? props.size : mdAndUp.value ? 'text-h4' : 'text-h5');

const props = withDefaults(defineProps<{
	divider?: boolean;
	heading: string;
	justify?: VRow['$props']['justify'];
	margin?: string;
	size?: string;
}>(), {
	divider: false,
	justify: 'center',
	margin: ''
});
</script>
