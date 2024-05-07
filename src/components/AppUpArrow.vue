<template>
	<transition
		name='fade'
		mode='out-in'
	>
		<v-btn
			@click='goToTop'
			v-if='scrolled'
			color='secondary'
			class='mr-1 cl up_arrow'
			position='fixed'
			size='small'
			icon
			dark
		>
			<v-icon
				:icon='mdiArrowCollapseUp'
			/>
			<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
				<span>scroll to top</span>
			</v-tooltip>
		</v-btn>
	</transition>
</template>

<script setup lang='ts'>
import { mdiArrowCollapseUp } from '@mdi/js';
import { useDisplay } from 'vuetify';

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value));

onMounted(() => {
	window.addEventListener('scroll', scrollEvent);
});

onBeforeUnmount(() => {
	window.removeEventListener('scroll', scrollEvent);
});

const scrolled = ref(false);

const scrollEvent = (): void => {
	scrolled.value = window.scrollY > 200 ? true : false;
};

const goToTop = (): void => {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
};
</script>

<style scoped>
.up_arrow{
	bottom: 1rem;
	right: 1rem;
}
</style>