<template>
	<v-card class='mx-auto' :max-width='maxWidth'>

		<v-row class='align-center pa-0 justify-center' density='compact'>
			<v-col class='pa-0' cols='auto'>
				<div class='text-center text-pi font-weight-bold' :class='headingSize'>{{ heading }}</div>
			</v-col>
			<v-col class='pa-0' cols='12'>
				<div class='text-center text-black font-weight-bold' :class='priceSize'>{{ price }} <span
					v-if='perMonth'
					class='text-label-small text-lowercase'
				>per month</span></div>
			</v-col>
		</v-row>
		<v-row class='align-center pa-0 justify-center'>
			<v-col class='pa-0' cols='11'>
				<v-table>
					<template #default>
						<tbody>
							<tr v-for='(item, index) in sorted_details' :key='index'>
								<td class='px-0 text-left font-weight-bold'>
									<v-row class='ma-0 pa-0' density='compact'>
										<v-col class='pa-0 ma-0'>
											<span>{{ item.description }}</span>
											<v-tooltip
												v-if='show_tooltip'
												activator='parent'
												content-class='tooltip'
												location='top center'
											>
												<span>{{ tooltipText(item.description) }}</span>
											</v-tooltip>
										</v-col>
									</v-row>
								</td>
								<td class=''>
									<v-row class='align-center ma-0 pa-0 justify-end'>
										<v-col class='ma-0 pa-0 mr-4' cols='auto'>
											<span class='' :class='`text-${color(item.icon)}`'> {{ item.detail }}</span>
										</v-col>
										<v-col class='ma-0 pa-0' cols='auto'>
											<v-icon
												:color='color(item.icon)'
												:icon='icon(item.icon)'
												:size='smAndDown ? "small" : "default"'
											/>
										</v-col>
									</v-row>
								</td>
							</tr>
						</tbody>
					</template>
				</v-table>
			</v-col>
		</v-row>
		<v-row class='align-center justify-center'>
			<v-col cols='auto'>
				<router-link class='text--black' :to='FrontEndRoutes.REGISTER'>create account</router-link>
			</v-col>
		</v-row>
	</v-card>
</template>

<script setup lang='ts'>
import { mdiCheck, mdiDragHorizontalVariant, mdiInfinity, mdiMinus } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { FrontEndRoutes } from '@/types/const_routes'

const { lgAndUp, mdAndUp, smAndDown, mobile } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))
const headingSize = computed(() => mdAndUp.value ? 'text-headline-large' : 'text-headline-small')
const maxWidth = computed(() => lgAndUp.value ? '30vw' : '80vw')
const priceSize = computed(() => mdAndUp.value ? 'text-display-small' : 'text-headline-medium')

const sorted_details: Ref<Array<{
	icon: number
	description: string
	detail: string
}>> = ref([])

function icon (icon: number): string {
	if (icon === 0) return mdiMinus
	if (icon === 1) return mdiDragHorizontalVariant
	if (icon === 2) return mdiCheck
	return mdiInfinity
}

const color = (icon: number): string => icon === 0 ? 'error' : (icon === 1 ? 'secondary' : 'primary')

function tooltipText (description: string): string {
	if (!description) return '!error'
	switch (description) {
		case 'client connections': {
			return 'Number of clients that are able to connect to each pi'
		}
		case 'device names': {
			return 'Customise the name of your pi'
		}
		case 'max devices': {
			return 'Max number of different devices per account'
		}
		case 'message size': {
			return 'Max size for each message'
		}
		case 'rate limit': {
			return 'Max number of message that can be sent, or received, to the device'
		}
		default: {
			return 'Set up email alters on specific device actions, e.g. on connection'
		}
	}
}
onMounted(() => {
	sorted_details.value = [...props.details]
})

type TDetails = {
	icon: number
	description: string
	detail: string
}

const props = withDefaults(defineProps<{
	heading: string
	price: string
	perMonth?: boolean
	details: Array<TDetails>
}>(), { perMonth: false })

</script>
