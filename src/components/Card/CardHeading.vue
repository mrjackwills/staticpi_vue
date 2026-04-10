<template>
	<!-- fix me -->
	<v-row
		class='ma-0 pa-0 align-center'
		:class='margin'
		density='compact'
		:justify='justify??"center"'
	>
		<!-- TOD fix me = :justify -->
		<v-col class='ma-0 pa-0' cols='auto'>
			<div class='text-center text-pi font-weight-bold' :class='headingSize'>{{ heading }}</div>
			<v-divider v-if='divider' />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import type { VRow } from 'vuetify/components/VGrid'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const headingSize = computed(() => {
	if (props.size !== undefined) {
		return props.size
	}
	if (mdAndUp.value) return 'text-headline-large'
	return 'text-headline-medium'
})

const props = withDefaults(defineProps<{
	divider?: boolean
	heading: string
	justify?: VRow['$props']['justify']
	margin?: string
	size?: string
}>(), {
	divider: false,
	justify: 'center',
	margin: '',
})
</script>
