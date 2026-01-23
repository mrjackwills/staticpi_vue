<template>
	<v-col class='unselectable ma-0 pa-0' cols='auto' :order>
		<v-chip
			color='secondary'
			label
			:ripple='false'
			:size
			variant='flat'
		>
			<v-row align='center' class='ma-0 pa-0 no-gutters' justify='center'>
				<v-col class='ma-0 pa-0 mr-1' cols='auto'>
					<v-icon :icon='mdiStarCircle' :size />
				</v-col>
				<v-col class='ma-0 pa-0' cols='auto'>pro user only</v-col>
			</v-row>

		</v-chip>
	</v-col>
</template>

<script setup lang="ts">
import { mdiStarCircle } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const size = computed(() => mobile.value ? 'x-small' : 'default')

withDefaults(defineProps<{ order?: string }>(), { order: '1' })
</script>
