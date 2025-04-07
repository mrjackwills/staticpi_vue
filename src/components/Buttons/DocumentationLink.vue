<template>
	<router-link :to='to' target='_blank'>
		<v-icon :size='iconSize' color='primary' :icon='mdiLinkVariant' />
		<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
			<span> open documentation</span>
		</v-tooltip>
	</router-link>
</template>

<script setup lang="ts">
import { FrontEndRoutes } from '@/types/const_routes';
import { mdiLinkVariant } from '@mdi/js';
import { useDisplay } from 'vuetify';

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value));

const to = computed(() => `${FrontEndRoutes.DOCUMENTATION}#${props.section}`);

const iconSize = computed(() => props.xsmall ? 'x-small' : props.small ? 'small' : 'default');

const props = withDefaults(defineProps<{
	section: string;
	small?: boolean;
	xsmall?: boolean;
}>(), {
	small: true,
	xsmall: false
});

</script>