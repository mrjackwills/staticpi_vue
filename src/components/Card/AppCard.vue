<template>
	<v-row class='align-center ma-0 pa-0 justify-center' :class='my' density='compact'>
		<v-col
			class=''
			cols='12'
			:lg
			:sm
			:xl
		>
			<v-card class='elevation-0' :class='[padding, border]' :disabled>
				<v-progress-linear
					absolute
					:active='loading'
					color='primary'
					:indeterminate='loading'
					width='100%'
				/>

				<CardHeading
					v-if='heading'
					class=''
					:class='headingClass'
					:heading
					:justify='headingJustify'
					:size='headingSize'
				/>
				<v-row class='align-center ma-0 pa-0 justify-center'>
					<v-col class='ma-0 pa-0' cols='12' :lg :sm>
						<slot name='start' />
					</v-col>
				</v-row>

				<v-row class='align-center ma-0 pa-0 justify-center'>
					<v-col class='ma-0 pa-0' cols='12' :lg :sm>
						<slot name='body' />
					</v-col>
				</v-row>

				<v-card-actions v-if='hasButton' class='pa-0 ma-0 '>
					<v-row class='align-center ma-0 pa-0 justify-center' :class='padding'>
						<v-col class='ma-0 pa-0' cols='12'>
							<slot name='button' />
						</v-col>
					</v-row>
				</v-card-actions>
				<v-row class='align-center ma-0 pa-0 justify-center' :class='padding'>
					<v-col class='ma-0 pa-0' cols='12' :lg :sm>
						<slot name='end' />
					</v-col>
				</v-row>
			</v-card>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import type { VRow } from 'vuetify/components/VGrid'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

const padding = computed(() => smAndDown.value && props.pad ? 'px-4' : '')

const border = computed(() => props.outlined ? 'card_border' : '')

const props = withDefaults(defineProps<{
	disabled?: boolean
	flat?: boolean
	hasButton?: boolean
	heading?: string
	headingJustify?: VRow['$props']['justify']
	headingClass?: string
	headingSize?: string
	lg?: string
	loading?: boolean
	my?: string
	outlined?: boolean
	pad?: boolean
	sm?: string
	tile?: boolean
	xl?: string
}>(), {
	disabled: false,
	flat: false,
	hasButton: false,
	heading: '',
	lg: '7',
	loading: false,
	my: 'my-1',
	outlined: true,
	pad: true,
	sm: '9',
	tile: false,
	xl: '6',
})

</script>

<style>
.card_border {
	border: 1px solid rgba(0, 0, 0, .2);
}
</style>
