<template>
	<section>

		<v-row
			v-for='(item, index) in tableData'
			:key='index'
			class='ma-0 pa-0 align-center justify-space-between unselectable'
			density='compact'
			hover-row
		>
			<v-col class='ma-0 pa-0' cols='12'>
				<v-row class='align-center ma-0 pa-0 justify-space-between'>
					<v-col class='ma-0 pa-0 text-left' cols='6'>
						<span class='font-weight-bold' :class='{ "small-text": mobile }'>
							{{ item.period }}
						</span>
					</v-col>

					<v-col class='ma-0 pa-0 text-right' cols='auto'>
						<v-row class='align-center ma-0 pa-0 justify-end' density='compact'>
							<v-col class='ma-0 pa-0' cols='12' md='auto'>
								<ExtraBandwidthCell
									:border-right='false'
									:total='item.total'
									:unit='item.unit'
									variety='out'
								/>
								<v-tooltip
									v-if='show_tooltip'
									activator='parent'
									content-class='tooltip'
									location='top center'
								>
									<span>{{ item.bytes }} bytes used {{ item.period }}</span>
								</v-tooltip>
							</v-col>
						</v-row>
					</v-col>

				</v-row>
				<v-divider v-if='index !== 2' />
			</v-col>
		</v-row>
	</section>

</template>

<script setup lang="ts">
import type { TDeviceInfo, TExtraBandwidthSimple } from '@/types'
import { useDisplay } from 'vuetify'
import { convert_bytes } from '@/vanillaTS/convert_bytes'

const { mobile } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))

const tableData = computed((): Array<TExtraBandwidthSimple> => [
	{
		period: 'last 24 hours',
		...convert_bytes(Number(props.device.pi_bytes_day_out) + Number(props.device.client_bytes_day_out)),
		bytes: `${Number(props.device.pi_bytes_day_out) + Number(props.device.client_bytes_day_out)}`,
	},
	{
		period: 'this month',
		...convert_bytes(Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)),
		bytes: `${Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)}`,
	},
	{
		period: 'all time',
		...convert_bytes(Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)),
		bytes: `${Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)}`,
	},
])

const props = defineProps<{ device: TDeviceInfo }>()
</script>
