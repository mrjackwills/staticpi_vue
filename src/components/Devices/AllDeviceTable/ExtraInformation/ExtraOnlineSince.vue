<template>
	<v-row class='ma-0 pa-0 no gutters'>

		<v-col class='ma-0 pa-0' cols='12'>
			<v-row class='align-center ma-0 pa-0 justify-space-between'>
				<v-col v-if='smAndDown' class='ma-0 pa-0' cols='auto'>
					<span class='font-weight-bold'>online since: </span>
				</v-col>
				<v-col class='ma-0 pa-0' cols='auto'>
					{{ text }}
				</v-col>
				<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
					<span v-intersect='onIntersect'>connected for: {{ tooltipText }}</span>
				</v-tooltip>
			</v-row>
		</v-col>

	</v-row>
</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify'
import { secondsToDays } from '@/vanillaTS/convert_seconds'

const { smAndDown } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

onBeforeUnmount(() => {
	clear()
})

const text = computed(() => props.timestamp ? new Date(props.timestamp).toLocaleString() : '')

const isIntersecting = ref(false)
const tooltipText = ref('')
const tooltipTimeout = ref(0)

function clear (): void {
	clearTimeout(tooltipTimeout.value)
}

function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}

function updateTooltip (): void {
	if (!props.timestamp) return
	tooltipText.value = secondsToDays(Date.now() - new Date(props.timestamp).getTime(), false)
}

const props = defineProps<{ timestamp?: string }>()

watch(isIntersecting, (i: boolean): void => {
	if (i) updateTooltip()
	else clear()
})
</script>
