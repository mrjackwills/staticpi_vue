<template>
	<section>
		<v-row class='ma-0 pa-0 no-gutters'>
			<v-col cols='12' class='ma-0 pa-0'>
				<v-tooltip activator='parent' location='top center' class='tooltip-z'>
					<span v-intersect='onIntersect'>{{ message }}</span>
				</v-tooltip>
				<v-btn
					@click='copyItem'
					@mouseenter='mouseenter'
					@mouseleave='mouseleave'
					:dark='disabled && dark'
					:density='to_density'
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
import type { TDensity } from '@/types';

const { smAndDown } = useDisplay();

onBeforeUnmount(() => {
	clearTimeout(tooltipTimeout.value);
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

const to_density = computed((): TDensity => {
	switch (props.density) {
	case 'compact':
		return 'compact';
	case 'comfortable':
		return 'comfortable';
	}
	return 'default';
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

const props = defineProps({
	dark: {
		type: Boolean,
		default: false
	},
	density: {
		type: String,
		default: 'default'
	},
	disabled: {
		type: Boolean,
		default: false
	},
	color: {
		type: String,
		default: 'black'
	},
	hoverMessage: {
		type: String,
		default: ''
	},
	toCopy: {
		type: String,
		required: true
	},
	tooltipMessage: {
		type: String,
		required: true
	},
	xsmall: {
		type: Boolean,
		required: false
	},
	small: {
		type: Boolean,
		required: false
	},
});

watch(isIntersecting, (i) => {
	if (!i) {
		click.value = false;
		clearTimeout(tooltipTimeout.value);
	}
});
</script>