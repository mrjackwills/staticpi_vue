<template>
	<section>
		<v-row v-if='!mobile' class='align-center ma-0 pa-0 justify-space-between'>
			<v-col class='ma-0 pa-0' cols='2' />

			<v-col v-for='(_item, index) of dataKeys' :key='index' class='ma-0 pa-0 text-right' cols='3'>

				<v-row class='align-center ma-0 pa-0 justify-space-between' density='compact'>

					<v-col
						v-for='(item, innerIndex) of detailHeaders'
						:key='innerIndex'
						class='ma-0 pa-0 small-text pr-1'
						:class='borderRight(index, innerIndex)'
						cols='12'
						md='4'
					>
						{{ item }}
					</v-col>
				</v-row>

			</v-col>
		</v-row>

		<v-divider />

		<v-row
			v-for='(item, index) in tableData'
			:key='index'
			class='ma-0 pa-0 hover-row unselectable justify-space-between align-center'
			density='compact'
		>
			<v-col class='ma-0 pa-0' cols='12'>

				<v-row class='align-center ma-0 pa-0 justify-space-between'>

					<v-col class='ma-0 pa-0 text-left' cols='2'>
						<span class='font-weight-bold' :class='{ "small-text": mobile }'>
							{{ item.period }}
						</span>
					</v-col>

					<v-col
						v-for='(inner, innerIndex) of dataKeys'
						:key='innerIndex'
						class='ma-0 pa-0 text-right'
						cols='3'
					>

						<v-row class='align-center ma-0 pa-0 justify-space-between' density='compact'>

							<v-col class='ma-0 pa-0' cols='12' md='4'>

								<ExtraBandwidthCell
									:total='item[inner].out.total'
									:unit='item[inner].out.unit'
									variety='out'
								/>

								<v-tooltip
									v-if='show_tooltip'
									activator='parent'
									content-class='tooltip'
									location='top'
								>
									<span>{{ item[inner].out.bytes }} bytes received {{ item.period }}</span>
								</v-tooltip>
							</v-col>

							<v-col class='ma-0 pa-0' cols='12' md='4'>

								<ExtraBandwidthCell
									:total='item[inner].in.total'
									:unit='item[inner].in.unit'
									variety='in'
								/>

								<v-tooltip
									v-if='show_tooltip'
									activator='parent'
									content-class='tooltip'
									location='top'
								>
									<span>{{ item[inner].in.bytes }} bytes sent {{ item.period }}</span>
								</v-tooltip>
							</v-col>

							<v-col class='ma-0 pa-0' cols='12' md='4'>
								<ExtraBandwidthCell
									:border-right='innerIndex === 2 ? false : true'
									:total='item[inner].total.total'
									:unit='item[inner].total.unit'
									variety='total'
								/>

								<v-tooltip
									v-if='show_tooltip'
									activator='parent'
									content-class='tooltip'
									location='top center'
								>
									<span>{{ item[inner].total.bytes }} bytes sent + received {{ item.period }}</span>
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
import type { TDeviceInfo, TExtraBandwidthDetailed } from '@/types'
import { useDisplay } from 'vuetify'
import { convert_bytes } from '@/vanillaTS/convert_bytes'

const { mobile } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))

const tableData = computed((): Array<TExtraBandwidthDetailed> => [
	{
		period: 'last 24 hours',
		device: {
			in: {
				...convert_bytes(props.device.pi_bytes_day_in),
				bytes: props.device.pi_bytes_day_in,
			},
			out: {
				...convert_bytes(props.device.pi_bytes_day_out),
				bytes: props.device.pi_bytes_day_out,
			},
			total: {
				...convert_bytes(Number(props.device.pi_bytes_day_in) + Number(props.device.pi_bytes_day_out)),
				bytes: `${Number(props.device.pi_bytes_day_in) + Number(props.device.pi_bytes_day_out)}`,
			},
		},
		client: {
			in: {
				...convert_bytes(props.device.client_bytes_day_in),
				bytes: props.device.client_bytes_day_in,
			},
			out: {
				...convert_bytes(props.device.client_bytes_day_out),
				bytes: props.device.client_bytes_day_out,
			},
			total: {
				...convert_bytes(Number(props.device.client_bytes_day_in) + Number(props.device.client_bytes_day_out)),
				bytes: `${Number(props.device.client_bytes_day_in) + Number(props.device.client_bytes_day_out)}`,
			},
		},
		all: {
			in: {
				...convert_bytes(Number(props.device.pi_bytes_day_in) + Number(props.device.client_bytes_day_in)),
				bytes: `${Number(props.device.pi_bytes_day_in) + Number(props.device.client_bytes_day_in)}`,
			},
			out: {
				...convert_bytes(Number(props.device.pi_bytes_day_out) + Number(props.device.client_bytes_day_out)),
				bytes: `${Number(props.device.pi_bytes_day_out) + Number(props.device.client_bytes_day_out)}`,
			},
			total: {
				...convert_bytes(Number(props.device.pi_bytes_day_in) + Number(props.device.client_bytes_day_in) + Number(props.device.pi_bytes_day_out) + Number(props.device.client_bytes_day_out)),
				bytes: `${Number(props.device.pi_bytes_day_in) + Number(props.device.client_bytes_day_in) + Number(props.device.pi_bytes_day_out) + Number(props.device.client_bytes_day_out)}`,
			},
		},
	},
	{
		period: 'this month',
		device: {
			in: {
				...convert_bytes(props.device.pi_bytes_month_in),
				bytes: props.device.pi_bytes_month_in,
			},
			out: {
				...convert_bytes(props.device.pi_bytes_month_out),
				bytes: props.device.pi_bytes_month_out,
			},
			total: {
				...convert_bytes(Number(props.device.pi_bytes_month_in) + Number(props.device.pi_bytes_month_out)),
				bytes: `${Number(props.device.pi_bytes_month_in) + Number(props.device.pi_bytes_month_out)}`,
			},
		},
		client: {
			in: {
				...convert_bytes(props.device.client_bytes_month_in),
				bytes: props.device.client_bytes_month_in,
			},
			out: {
				...convert_bytes(props.device.client_bytes_month_out),
				bytes: props.device.client_bytes_month_out,
			},
			total: {
				...convert_bytes(Number(props.device.client_bytes_month_in) + Number(props.device.client_bytes_month_out)),
				bytes: `${Number(props.device.client_bytes_month_in) + Number(props.device.client_bytes_month_out)}`,
			},
		},
		all: {
			in: {
				...convert_bytes(Number(props.device.pi_bytes_month_in) + Number(props.device.client_bytes_month_in)),
				bytes: `${Number(props.device.pi_bytes_month_in) + Number(props.device.client_bytes_month_in)}`,
			},
			out: {
				...convert_bytes(Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)),
				bytes: `${Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)}`,
			},
			total: {
				...convert_bytes(Number(props.device.pi_bytes_month_in) + Number(props.device.client_bytes_month_in) + Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)),
				bytes: `${Number(props.device.pi_bytes_month_in)
				+ Number(props.device.client_bytes_month_in) + Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)}`,
			},
		},
	},
	{
		period: 'all time',
		device: {
			in: {
				...convert_bytes(props.device.pi_bytes_total_in),
				bytes: props.device.pi_bytes_total_in,
			},
			out: {
				...convert_bytes(props.device.pi_bytes_total_out),
				bytes: props.device.pi_bytes_total_out,
			},
			total: {
				...convert_bytes(Number(props.device.pi_bytes_total_in) + Number(props.device.pi_bytes_total_out)),
				bytes: `${Number(props.device.pi_bytes_total_in) + Number(props.device.pi_bytes_total_out)}`,
			},
		},
		client: {
			in: {
				...convert_bytes(props.device.client_bytes_total_in),
				bytes: props.device.client_bytes_total_in,
			},
			out: {
				...convert_bytes(props.device.client_bytes_total_out),
				bytes: props.device.client_bytes_total_out,
			},
			total: {
				...convert_bytes(Number(props.device.client_bytes_total_in) + Number(props.device.client_bytes_total_out)),
				bytes: `${Number(props.device.client_bytes_total_in) + Number(props.device.client_bytes_total_out)}`,
			},
		},
		all: {
			in: {
				...convert_bytes(Number(props.device.pi_bytes_total_in) + Number(props.device.client_bytes_total_in)),
				bytes: `${Number(props.device.pi_bytes_total_in) + Number(props.device.client_bytes_total_in)}`,
			},
			out: {
				...convert_bytes(Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)),
				bytes: `${Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)}`,
			},
			total: {
				...convert_bytes(Number(props.device.pi_bytes_total_in) + Number(props.device.client_bytes_total_in) + Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)),
				bytes: `${Number(props.device.pi_bytes_total_in)
				+ Number(props.device.client_bytes_total_in) + Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)}`,
			},
		},
	},

])
const dataKeys = ['device', 'client', 'all'] as const
const detailHeaders = ['received', 'sent', 'combined'] as const

const borderRight = (index: number, innerIndex: number): string => index === 2 ? (innerIndex === 2 ? '' : 'border-right') : 'border-right'

const props = defineProps<{ device: TDeviceInfo }>()

</script>

<style scoped>
.border-right {
	border-right: 3px solid rgba(0, 0, 0, .15)
}
</style>
