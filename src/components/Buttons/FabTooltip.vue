<template>
	<v-col cols='auto' class='ma-0 pa-0'>
		<v-btn
			@click='emit("click")'
			:disabled='disabled'
			class='fab-fix ma-0 pa-0'
			variant='text'
			icon
		>
			<v-icon
				:color='color'
				:icon='icon'
				:size='iconSize'
			/>
			<v-tooltip v-if='show_tooltip && tooltip_text' activator='parent' location='top center' content-class='tooltip'>
				<span>{{ tooltip_text }}</span>
			</v-tooltip>
		</v-btn>
	</v-col>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndDown, mobile } = useDisplay();

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && mobile.value);
});

const iconSize = computed(() => {
	if (mdAndUp.value && !props.medium) {
		return 'large';

	} if (smAndDown.value) {
		return 'small';
	}
	return 'default';
});

const props = withDefaults(defineProps<{
	color: string;
	disabled?: boolean;
	icon: string;
	medium?: boolean;
	tooltip_text: string;
}>(), {
	disabled: false,
	medium: false
});

const emit = defineEmits([ 'click' ]);

</script>
