<template>
	<transition
		mode='out-in'
		name='fade'
	>
		<v-btn
			v-if='scrolled'
			class='mr-1 cl up_arrow'
			color='secondary'
			dark
			icon
			position='fixed'
			size='small'
			@click='goToTop'
		>
			<v-icon
				:icon='mdiArrowCollapseUp'
			/>

			<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
				<span>scroll to top</span>
			</v-tooltip>
		</v-btn>
	</transition>
</template>

<script setup lang='ts'>
import { mdiArrowCollapseUp } from '@mdi/js'
import { useDisplay } from 'vuetify'

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

onMounted(() => {
	window.addEventListener('scroll', scrollEvent)
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', scrollEvent)
})

const scrolled = ref(false)

function scrollEvent (): void {
	scrolled.value = window.scrollY > 200 ? true : false
}

function goToTop (): void {
	window.scrollTo({
		top: 0, // Scrolls to the very top of the page
		behavior: 'smooth', // Makes the scroll animation smooth
	})
	// document.body.scrollTop = 0;
	// document.documentElement.scrollTop = 0;
}
</script>

<style scoped>
.up_arrow{
	bottom: 1rem;
	right: 1rem;
}
</style>
