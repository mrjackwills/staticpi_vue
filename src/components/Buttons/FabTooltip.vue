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
			<v-tooltip v-if='tooltip_text' activator='parent' location='top center' class='tooltip-z'>
				<span>{{ tooltip_text }}</span>
			</v-tooltip>
		</v-btn>
	</v-col>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndDown } = useDisplay();

const iconSize = computed(() => {
	if (mdAndUp.value && !props.medium) {
		return 'large';

	} if (smAndDown.value) {
		return 'small';
	}
	return 'default';
});

const props = defineProps({
	color: {
		type: String,
		required: true
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	icon: {
		type: String,
		required: true
	},
	medium: {
		type: Boolean,
		default: false
	},
	tooltip_text: {
		type: String,
		required: true
	},
});

const emit = defineEmits([ 'click' ]);

</script>
