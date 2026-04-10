<template>
	<!-- TODO fix this -->
	<v-row class='align-center ma-0 pa-0' density='compact' :justify='justify??"center"'>
		<v-col class='ma-0 pa-0' cols='auto'>
			<div class='text-center font-weight-bold' :class='[headingSize, headingColor]'>{{ heading }}</div>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import type { VRow } from 'vuetify/components/VGrid'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const headingSize = computed(() => {
	if (props.headingSize) return props.headingSize
	if (mdAndUp.value) return 'text-headline-small'
	return 'text-h7'
})

// todo fix justify, use a computed
const headingColor = computed(() => `text-${props.color}`)

const props = withDefaults(defineProps<{
	color?: string
	heading: string
	headingSize?: string
	justify?: VRow['$props']['justify']
}>(), {
	color: 'pi',
	justify: 'center',
})

</script>
