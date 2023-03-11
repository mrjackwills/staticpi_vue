<template>
	<router-link :to='to' target='_blank'>
		<v-icon :size='iconSize' color='primary' :icon='mdiLinkVariant' />
		<v-tooltip activator='parent' location='top center' content-class='tooltip'>
			<span> open documentation</span>
		</v-tooltip>
	</router-link>
</template>

<script setup lang="ts">
import { FrontEndRoutes } from '@/types/enum_routes';
import { mdiLinkVariant } from '@mdi/js';

const to = computed((): string =>{
	return `${FrontEndRoutes.DOCUMENTATION}#${props.section}`;
});

const iconSize = computed((): string => {
	if (props.xsmall) {
		return 'x-small';
	}
	if (props.small) {
		return 'small';
	}
	return 'default';
});

const props = defineProps({
	section: {
		type: String,
		required: true,
	},
	small: {
		type: Boolean,
		default: true
	},
	xsmall: {
		type: Boolean,
		default: false
	}
});
</script>