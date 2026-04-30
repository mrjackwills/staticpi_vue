<template>
	<v-row class='align-center ma-0 pa-0 pl-2 justify-start'>
		<v-col class='ma-0 pa-0' cols='12'>
			<v-row class='align-center ma-0 pa-0 justify-start'>
				<v-col
					v-if='smAndUp'
					class='ma-0 pa-0'
					cols='2'
					lg='1'
					:order='order_icon'
				>
					<v-icon :color :icon />
				</v-col>

				<v-col class='ma-0 pa-0' cols='12' :order='order_detail' sm='10'>
					<span class='' :class='`text-${color}`'>{{ detail }}</span>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { mdiCheck, mdiMinus } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mdAndUp, smAndUp } = useDisplay()

const color = computed(() => props.freePlan ? 'error' : 'primary')
const icon = computed(() => props.freePlan ? mdiMinus : mdiCheck)
const order_icon = computed(() => mdAndUp.value ? '1' : '2')
const order_detail = computed(() => mdAndUp.value ? '2' : '1')

const props = defineProps<{
	freePlan: boolean
	detail: string
}>()
</script>
