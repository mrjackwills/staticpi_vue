<template>
	<AppCard
		lg='11'
		md='12'
		sm='12'
		xl='11'
	>
		<template #body>
			<v-row class='align-center ma-0 pa-0 px-2 px-md-12 justify-center' :class='smallText'>
				<v-col class='ma-0 pa-0' cols='12'>
					<v-row class='align-center ma-0 pa-0 justify-start'>
						<v-col class='ma-0 pa-0' cols='auto' order='2'>
							<ProUserChip v-if='pro' class='ma-1 ml-3' :class='proMargin' />
						</v-col>

						<v-col class='ma-0 pa-0' cols='auto' order='1'>
							<SubHeading :id='createId' :heading justify='start' />
						</v-col>
					</v-row>

					<v-divider class='mb-1' />
				</v-col>

				<v-col class='ma-0 pa-0 mb-4' cols='12'>
					<slot name='doc-body' />
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const createId = computed(() => props.heading.toLowerCase().replaceAll(' ', '-'))
const proMargin = computed(() => mobile.value ? 'mr-2' : 'mr-12')
const smallText = computed(() => mobile.value ? 'small-text' : '')

const props = withDefaults(defineProps<{
	heading: string
	pro?: boolean
}>(), { pro: false })

</script>
