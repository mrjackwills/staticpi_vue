<template>
	<v-row class='ma-0 pa-0 no-gutters' :class='showBorder' align='center' justify='end' justify-md='end'>

		<v-col class='ma-0 pa-0' :class='mobileClass' cols='auto'>
			<span class='bandwidth-text'>
				{{ total }} {{ unit }}</span>
		</v-col>
		
		<v-col class='ma-0 pa-0 text-right' cols='auto' >
			<v-icon :color='color' :icon='icon' :size='mobile?"x-small":"small"' />
		</v-col>

	</v-row>
</template>

<script setup lang='ts'>
import { mdiArrowDownBold, mdiArrowUpBold, mdiSwapVerticalBold } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const combined = computed(() :boolean => {
	return ! [ 'in', 'out' ].includes(props.variety);
});
const color = computed((): string => {
	return props.variety === 'in' ? 'primary' : props.variety === 'out' ? 'secondary' : 'error';
});
const icon = computed((): string => {
	return props.variety === 'in' ? mdiArrowUpBold : props.variety === 'out' ? mdiArrowDownBold: mdiSwapVerticalBold ;
});
const mobileClass = computed((): string => {
	return mobile.value ? 'small-text' : 'total-unit-width';
});
const showBorder = computed(() : string => {
	return !mobile.value && combined.value && props.borderRight ? 'thick-border-right': !mobile.value && props.borderRight? 'border-right' : '';
});

const props = withDefaults(defineProps<{
	borderRight?: boolean,
	total: string,
	unit: string,
	variety: string
}>(), {
	borderRight: true,
});
	
</script>

<style scoped>
.bandwidth-text{
	font-size: .75rem;
}
.total-unit-width{
	min-width: 2.4rem;
}

.border-right {
	border-right: 1px solid rgba(0,0,0,.15)
}

.thick-border-right {
	border-right: 3px solid rgba(0,0,0,.15)
}
</style>