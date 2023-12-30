<template>
	<v-card
		class='mx-auto'
		:max-width='maxWidth'
	>
	
		<v-row justify='center' align='center' class='pa-0' dense>
			<v-col cols='auto' class='pa-0'>
				<div class='text-center text-pi font-weight-bold' :class='headingSize'>{{ heading }}</div>
			</v-col>
			<v-col cols='12' class='pa-0'>
				<div class='text-center text-black font-weight-bold' :class='priceSize' >{{ price }} <span class='text-overline text-lowercase' v-if='perMonth'>per month</span></div>
			</v-col>
		</v-row>
		<v-row align='center' justify='center' class='pa-0'>
			<v-col cols='11' class='pa-0'>
				<v-table>
					<template v-slot:default>
						<tbody>
							<tr v-for='(item, index) in sorted_details' :key='index'>
								<td class='px-0 text-left font-weight-bold'>
									<v-row class='ma-0 pa-0' dense no-gutters>
										<v-col class='pa-0 ma-0'>
											<span>{{ item.description }}</span>
											<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
												<span>{{ tooltipText(item.description) }}</span>
											</v-tooltip>
										</v-col>
									</v-row>
								</td>
								<td class=''>
									<v-row align='center' justify='end' class='ma-0 pa-0'>
										<v-col cols='auto' class='ma-0 pa-0 mr-4'>
											<span class='' :class='`text-${color(item.icon)}`'> {{ item.detail }}</span>
										</v-col>
										<v-col cols='auto' class='ma-0 pa-0'>
											<v-icon :color='color(item.icon)' :size='smAndDown?"small":"default"' :icon='icon(item.icon)' />
										</v-col>
									</v-row>
								</td>
							</tr>
						</tbody>
					</template>
				</v-table>
			</v-col>
		</v-row>
		<v-row align='center' justify='center' >
			<v-col cols='auto'>
				<router-link class='text--black' :to='FrontEndRoutes.REGISTER'>create account</router-link>
			</v-col>
		</v-row>
	</v-card>
</template>

<script setup lang='ts'>
import { FrontEndRoutes } from '@/types/enum_routes';
import { mdiDragHorizontalVariant, mdiInfinity, mdiCheck, mdiMinus } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { lgAndUp, mdAndUp, smAndDown, mobile } = useDisplay();

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && mobile.value);
});

const headingSize = computed((): string => {
	return mdAndUp.value ? 'text-h4' : 'text-h6';
});
const maxWidth = computed((): string => {
	return lgAndUp.value ? '30vw' : '80vw';
});
const priceSize = computed((): string => {
	return mdAndUp.value ? 'text-h3' : 'text-h5';
});

const sorted_details: Ref<Array<{icon: number, description: string, detail: string}>> = ref([]);

const icon = (icon: number): string => {
	return icon === 0 ? mdiMinus : icon === 1 ? mdiDragHorizontalVariant : icon === 2 ? mdiCheck : mdiInfinity;
};
const color = (icon: number): string => {
	return icon === 0 ? 'error' : icon === 1 ? 'secondary' : 'primary';
};
const tooltipText = (description: string): string => {
	if (!description) return '!error';
	switch (description) {
	case 'client connections':
		return 'Number of clients that are able to connect to each pi';
	case 'device names':
		return 'Customise the name of your pi';
	case 'max devices':
		return 'Max number of different devices per account';
	case 'message size':
		return 'Max size for each message';
	case 'rate limit':
		return 'Max number of message that can be sent, or received, to the device';
	default:
		return 'Set up email alters on specific device actions, e.g. on connection';
	}
};
onMounted(() => {
	sorted_details.value = [ ...props.details ];

});
type TDetails = {icon: number, description: string, detail: string}

const props = withDefaults(defineProps<{
	heading: string,
	price: string,
	perMonth: boolean,
	details: Array<TDetails>
}>(), {
	perMonth: false,
});

</script>