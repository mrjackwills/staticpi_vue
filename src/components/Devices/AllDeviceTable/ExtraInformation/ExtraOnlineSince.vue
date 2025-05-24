<template>
	<v-row class='ma-0 pa-0 no gutters'>

		<v-col cols='12' class='ma-0 pa-0'>
			<v-row justify='space-between' align='center' class='ma-0 pa-0'>
				<v-col v-if='smAndDown' cols='auto' class='ma-0 pa-0'>
					<span class='font-weight-bold'>online since: </span>
				</v-col>
				<v-col cols='auto' class='ma-0 pa-0'>
					{{ text }}
				</v-col>
				<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
					<span v-intersect='onIntersect'>connected for: {{ tooltipText }}</span>
				</v-tooltip>
			</v-row>
		</v-col>

	</v-row>
</template>

<script setup lang='ts'>
import { secondsToDays } from '@/vanillaTS/convert_seconds';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay();

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value));

onBeforeUnmount(() => {
	clear();
});

const text = computed(() => !props.timestamp ? '' : new Date(props.timestamp).toLocaleString());

const isIntersecting = ref(false);
const tooltipText = ref('');
const tooltipTimeout = ref(0);

const clear = (): void => {
	clearTimeout(tooltipTimeout.value);
};

const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};

const updateTooltip = (): void => {
	if (!props.timestamp) return;
	tooltipText.value = secondsToDays(new Date().getTime() - new Date(props.timestamp).getTime(), false);
};

const props = defineProps<{ timestamp?: string }>();

watch(isIntersecting, (i: boolean): void => {
	if (i) updateTooltip();
	else clear();
});
</script>
