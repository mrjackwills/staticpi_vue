<template>
	<section>
		<v-row class='ma-0 pa-0 no-gutters'>
			<v-col cols='12' class='ma-0 pa-0'>
				<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
					<span v-intersect='onIntersect'>{{ message }}</span>
				</v-tooltip>
				<v-btn
					@click='copyItem'
					@mouseenter='mouseenter'
					@mouseleave='mouseleave'
					:dark='disabled && dark'
					:density='density'
					:disabled='disabled'
					:size='iconSize'
					class='fab-fix pa-0 ma-0'
					variant='text'
					icon
				>
					<v-icon
						:color='color'
						:icon='mdiContentCopy'
						:size='iconSize'
					/>
				</v-btn>
			</v-col>
		</v-row>
	</section>
</template>
<script setup lang='ts'>
import { mdiContentCopy } from '@mdi/js';
import { useClipboard } from '@vueuse/core';
import { useDisplay } from 'vuetify';
import type { VBtn } from 'vuetify/components/VBtn';
const { smAndDown } = useDisplay();

onBeforeUnmount(() => {
	clearTimeout(tooltipTimeout.value);
});

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && useDisplay().mobile.value);
});

const iconSize = computed((): string => {
	if (onMobile.value || props.xsmall) {
		return 'x-small';
	}
	if (props.small) {
		return 'small';
	}
	return 'default';
});
const onMobile = computed((): boolean => {
	return smAndDown.value || props.xsmall;
});

const message = computed((): string => {
	return click.value? props.tooltipMessage : props.hoverMessage;
});
	
const click = ref(false);
const hover = ref(false);
const isIntersecting = ref(false);
const show = ref(false);
const tooltipTimeout = ref(0);

const copyItem = (): void => {
	hover.value = false;
	click.value = true;
	show.value = true;
	useClipboard().copy(props.toCopy);
	clearTimeout(tooltipTimeout.value);
	tooltipTimeout.value = setTimeout(() => {
		show.value = false;
	}, 1250);
};

const mouseenter = (): void => {
	if (!props.hoverMessage) return;
	hover.value = true;
	show.value = true;
};

const mouseleave = (): void => {
	if (click.value || !props.hoverMessage) return;
	show.value = false;
	hover.value = false;
};

const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};

const props = withDefaults(defineProps<{
	color: string,
	dark: boolean,
	density: VBtn['$props']['density'],
	disabled: boolean,
	hoverMessage: string,
	small?:boolean
	toCopy: string,
	tooltipMessage: string,
	xsmall?: boolean,
}>(), {
	color: 'black',
	dark: false,
	density: 'default',
	disabled: false,
	hoverMessage: '',
});

watch(isIntersecting, (i) => {
	if (!i) {
		click.value = false;
		clearTimeout(tooltipTimeout.value);
	}
});
</script>