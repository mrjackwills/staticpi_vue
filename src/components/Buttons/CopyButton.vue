<template>
	<section>
		<v-row class='ma-0 pa-0 ' density='compact'>
			<v-col class='ma-0 pa-0' cols='12'>
				<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
					<span v-intersect='onIntersect'>{{ message }}</span>
				</v-tooltip>

				<v-btn
					class='fab-fix pa-0 ma-0'
					:dark='disabled && dark'
					:density='density??"default"'
					:disabled
					icon
					:size='iconSize'
					variant='text'
					@click='copyItem'
					@mouseenter='mouseenter'
					@mouseleave='mouseleave'
				>
					<v-icon :color :icon='mdiContentCopy' :size='iconSize' />
				</v-btn>
			</v-col>
		</v-row>
	</section>
</template>
<script setup lang='ts'>
import type { VBtn } from 'vuetify/components/VBtn'
import { mdiContentCopy } from '@mdi/js'
import { useClipboard } from '@vueuse/core'
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()

onBeforeUnmount(() => {
	clearTimeout(tooltipTimeout.value)
})

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

const iconSize = computed(() => onMobile.value || props.xsmall ? 'x-small' : (props.small ? 'small' : 'default'))
const onMobile = computed(() => smAndDown.value || props.xsmall)

const message = computed(() => click.value ? props.tooltipMessage : props.hoverMessage)

const click = ref(false)
const hover = ref(false)
const isIntersecting = ref(false)
const show = ref(false)
const tooltipTimeout = ref(0)

function copyItem (): void {
	hover.value = false
	click.value = true
	show.value = true
	useClipboard().copy(props.toCopy)
	clearTimeout(tooltipTimeout.value)
	tooltipTimeout.value = setTimeout(() => {
		show.value = false
	}, 1250)
}

function mouseenter (): void {
	if (!props.hoverMessage) return
	hover.value = true
	show.value = true
}

function mouseleave (): void {
	if (click.value || !props.hoverMessage) return
	show.value = false
	hover.value = false
}

function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}

const props = withDefaults(defineProps<{
	color?: string
	dark?: boolean
	density?: VBtn['$props']['density']
	disabled?: boolean
	hoverMessage?: string
	small?: boolean
	toCopy: string
	tooltipMessage: string
	xsmall?: boolean
}>(), {
	color: 'black',
	dark: false,
	density: 'default',
	disabled: false,
	hoverMessage: '',
})

watch(isIntersecting, i => {
	if (!i) {
		click.value = false
		clearTimeout(tooltipTimeout.value)
	}
})
</script>
