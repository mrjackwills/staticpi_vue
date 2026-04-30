<template>
	<AppCard
		:disabled
		lg='11'
		md='12'
		my='my-2'
		sm='12'
		xl='11'
	>
		<template #body>
			<v-row class='align-center ma-0 pa-0  my-3 justify-start' density='compact'>
				<v-col class='ma-a pa-0' cols='auto'>
					<slot name='titleIcon' />
				</v-col>

				<v-col class='ma-0 pa-0 font-weight-bold text-pi' :class='title' cols='auto'>
					<slot name='title' />
				</v-col>

				<v-spacer />
				<ProUserChip v-if='proOnly' />

			</v-row>

			<v-row class='align-center ma-0 pa-0 justify-center'>
				<v-col class='pa-0 ma-0 text-body-large' cols='12'>
					<slot name='text_description' />
				</v-col>
			</v-row>

			<v-row class='align-center ma-0 pa-0 justify-center'>
				<v-col class='pa-0 ma-0' cols='12'>
					<slot name='body' />
				</v-col>
			</v-row>

			<v-row class='pa-0 ma-0 justify-center'>
				<v-col class='pa-0 ma-0' cols='12' lg='4' md='8'>
					<v-row class='pa-0 ma-0 justify-space-around'>
						<v-col class='pa-0 ma-0' cols='6' md='auto'>
							<slot name='cancel_button' />
						</v-col>

						<v-col class='pa-0 ma-0' cols='6' md='auto'>
							<slot name='save_button' />
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row class='align-center ma-0 pa-0 my-3 justify-center'>
				<v-col class='ma-0 pa-0' cols='12'>
					<slot name='action_button' />
				</v-col>
			</v-row>
		</template>
	</AppCard>

</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

const title = computed(() => smAndDown.value ? 'text-h7' : 'text-headline-small')

withDefaults(defineProps<{
	disabled?: boolean
	proOnly?: boolean
}>(), {
	disabled: false,
	proOnly: false,
})
</script>
