<template>
	<section>
		<v-row align='center' justify='space-between' class='ma-0 pa-0' v-if='!mobile'>
			<v-col cols='2' class='ma-0 pa-0' />
			
			<v-col class='ma-0 pa-0 text-right' cols='3' v-for='(_item, index) of dataKeys' :key='index'>

				<v-row class='ma-0 pa-0 no-gutters' align='center' justify='space-between'>

					<v-col class='ma-0 pa-0 small-text pr-1' :class='borderRight(index, innerIndex)' cols='12' md='4' v-for='(item, innerIndex) of detailHeaders' :key='innerIndex'>
						{{ item }}
					</v-col>
				</v-row>
				
			</v-col>
		</v-row>

		<v-divider />
		<v-row
			v-for='(item, index) in tableData'
			:key='index'
			align='center'
			class='ma-0 pa-0 no-gutters hover-row unselectable'
			justify='space-between'
		>
			<v-col cols='12' class='ma-0 pa-0' >

				<v-row align='center' justify='space-between' class='ma-0 pa-0'>
					
					<v-col cols='2' class='ma-0 pa-0 text-left'>
						<span class='font-weight-bold' :class='{"small-text": mobile}'>
							{{ item.period }}
						</span>
					</v-col>

					<v-col class='ma-0 pa-0 text-right' cols='3' v-for='(inner, innerIndex) of dataKeys' :key='innerIndex'>

						<v-row class='ma-0 pa-0 no-gutters' align='center' justify='space-between'>

							<v-col class='ma-0 pa-0' cols='12' md='4'>
								
								<ExtraBandwidthCell :unit='item[inner].out.unit' :total='item[inner].out.total' variety='out'/>
								<v-tooltip activator='parent' location='top' content-class='tooltip'>
									<span>{{ item[inner].out.bytes }} bytes received {{ item.period }}</span>
								</v-tooltip>
							</v-col>

							<v-col class='ma-0 pa-0' cols='12' md='4'>

								<ExtraBandwidthCell :unit='item[inner].in.unit' :total='item[inner].in.total' variety='in'/>
								<v-tooltip activator='parent' location='top' content-class='tooltip'>
									<span>{{ item[inner].in.bytes }} bytes sent {{ item.period }}</span>
								</v-tooltip>
							</v-col>
									
							<v-col class='ma-0 pa-0' cols='12' md='4'>
								<ExtraBandwidthCell :unit='item[inner].total.unit' :total='item[inner].total.total' variety='total' :borderRight='innerIndex === 2 ? false: true' />
								<v-tooltip activator='parent'  location='top center' content-class='tooltip'>
									<span>{{ item[inner].total.bytes }} bytes sent + received {{ item.period }}</span>
								</v-tooltip>
							</v-col>
						</v-row>
					</v-col>
							
				</v-row>
				<v-divider v-if='index!==2' />
			</v-col>

		</v-row>
	</section>

</template>

<script setup lang="ts">
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import { useDisplay } from 'vuetify';
import ExtraBandwidthCell from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraBandwidthCell.vue';
import type { TDeviceInfo, TExtraBandwidthDetailed } from '@/types';

const { mobile } = useDisplay();

const tableData = computed((): Array<TExtraBandwidthDetailed> => {
	return [
		{
			period: 'last 24 hours',
					
			device: {
				in: {
					...convert_bytes(props.device.pi_bytes_day_in),
					bytes: props.device.pi_bytes_day_in
				},
				out: {
					...convert_bytes(props.device.pi_bytes_day_out),
					bytes: props.device.pi_bytes_day_out
				},
				total: {
					...convert_bytes(Number(props.device.pi_bytes_day_in) + Number(props.device.pi_bytes_day_out)),
					bytes: `${Number(props.device.pi_bytes_day_in) + Number(props.device.pi_bytes_day_out)}`,
				}
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
				}
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
				}
			},
		},
		{
			period: 'this month',
					
			device: {
				in: {
					...convert_bytes(props.device.pi_bytes_month_in),
					bytes: props.device.pi_bytes_month_in
				},
				out: {
					...convert_bytes(props.device.pi_bytes_month_out),
					bytes: props.device.pi_bytes_month_out
				},
				total: {
					...convert_bytes(Number(props.device.pi_bytes_month_in) + Number(props.device.pi_bytes_month_out)),
					bytes: `${Number(props.device.pi_bytes_month_in) + Number(props.device.pi_bytes_month_out)}`,
				}
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
				}
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
					bytes: `${Number(props.device.pi_bytes_month_in) + Number(props.device.client_bytes_month_in) + Number(props.device.pi_bytes_month_out) + Number(props.device.client_bytes_month_out)}`,
				}
			},
		},
		{
			period: 'all time',
					
			device: {
				in: {
					...convert_bytes(props.device.pi_bytes_total_in),
					bytes: props.device.pi_bytes_total_in
				},
				out: {
					...convert_bytes(props.device.pi_bytes_total_out),
					bytes: props.device.pi_bytes_total_out
				},
				total: {
					...convert_bytes(Number(props.device.pi_bytes_total_in) + Number(props.device.pi_bytes_total_out)),
					bytes: `${Number(props.device.pi_bytes_total_in) + Number(props.device.pi_bytes_total_out)}`,
				}
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
				}
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
					bytes: `${Number(props.device.pi_bytes_total_in) + Number(props.device.client_bytes_total_in) + Number(props.device.pi_bytes_total_out) + Number(props.device.client_bytes_total_out)}`,
				}
			},
		}

	];
});
const dataKeys = [ 'device', 'client', 'all' ] as const;
const detailHeaders = [ 'received', 'sent', 'combined' ] as const;

const borderRight = (index: number, innerIndex: number): string => {
	return index !==2 ? 'border-right' : innerIndex !== 2 ? 'border-right': '';

};

const props = defineProps({
	device: {
		type: Object as () => TDeviceInfo,
		required: true,
	}
});
</script>

<style scoped>
.border-right {
	border-right: 3px solid rgba(0,0,0,.15)
}
</style>