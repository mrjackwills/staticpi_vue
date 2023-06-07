<template>
	<v-row :justify='justify' align='center' class='ma-0 pa-0' no-gutters>
		<v-col cols='auto' class='ma-0 pa-0'>
			<div class='text-center font-weight-bold' :class='[headingSize, headingColor]'>{{ heading }}</div>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify';
import type { VRow } from 'vuetify/components/VGrid';

const { mdAndUp } = useDisplay();

const headingSize = computed((): string => {
	return props.heading_size ? props.heading_size : mdAndUp.value ? 'text-h6' : 'text-h7';
});
const headingColor = computed((): string => {
	return `text-${props.color}`;
});

const props = withDefaults(defineProps<{
	color?: string,
	heading: string,
	heading_size?: string,
	justify?: VRow['$props']['justify']
}>(), {
	color: 'pi',
	justify: 'center',
});

</script>