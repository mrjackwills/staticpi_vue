<template>
	<v-col class='ma-0 pa-0' cols='auto'>
		<v-btn
			class='fab-fix ma-0 pa-0'
			:disabled
			icon
			variant='text'
			@click='emit("click")'
		>
			<v-icon :color :icon :size='iconSize' />
			<v-tooltip
				v-if='show_tooltip && tooltipText'
				activator='parent'
				content-class='tooltip'
				location='top center'
			>
				<span>{{ tooltipText }}</span>
			</v-tooltip>
		</v-btn>
	</v-col>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { mdAndUp, smAndDown, mobile } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))

const iconSize = computed(() => mdAndUp.value && !props.medium ? 'large' : (smAndDown.value ? 'small' : 'default'))

const props = withDefaults(defineProps<{
	color: string
	disabled?: boolean
	icon: string
	medium?: boolean
	tooltipText: string
}>(), {
	disabled: false,
	medium: false,
})

const emit = defineEmits(['click'])

</script>
