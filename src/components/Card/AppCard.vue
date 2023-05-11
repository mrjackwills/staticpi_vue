<template>
	<v-row align='center' justify='center' class='ma-0 pa-0 no-gutters' :class='my' >
		<v-col cols='12' :sm='sm' :lg='lg' :xl='xl' class='' >
			<v-card :disabled='disabled' :class='[padding, border]' class='elevation-0' >
				<v-progress-linear
					:active='loading'
					:indeterminate='loading'
					color='primary'
					width='100%'
					absolute
				/>

				<CardHeading v-if='heading' :heading='heading' :class='heading_class' :justify='heading_justify' :size='heading_size' class='' />
				<v-row justify='center' align='center' class='ma-0 pa-0'>
					<v-col cols='12' :sm='sm' :lg='lg' class='ma-0 pa-0'>
						<slot name='start'></slot>
					</v-col>
				</v-row>

				<v-row justify='center' align='center' class='ma-0 pa-0'>
					<v-col cols='12' :sm='sm' :lg='lg' class='ma-0 pa-0'>
						<slot name='body'></slot>
					</v-col>
				</v-row>
				
				<v-card-actions class='pa-0 ma-0 ' v-if='hasButton'>
					<v-row align='center' class='ma-0 pa-0' justify='center' :class='padding'>
						<v-col cols='12' class='ma-0 pa-0'>
							<slot name='button'></slot>
						</v-col>
					</v-row>
				</v-card-actions>
				<v-row justify='center' align='center' class='ma-0 pa-0' :class='padding'>
					<v-col cols='12' :sm='sm' :lg='lg' class='ma-0 pa-0'>
						<slot name='end'></slot>
					</v-col>
				</v-row>
			</v-card>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import type { VRow } from 'vuetify/components/VGrid';

import { useDisplay } from 'vuetify';
import CardHeading from '@/components/Card/CardHeading.vue';

const { smAndDown } = useDisplay();

const padding = computed((): string => {
	return smAndDown.value && props.pad ? 'px-4' : '';
});

const border = computed((): string => {
	return props.outlined ? 'card_border' : '';
});

const props = withDefaults(defineProps<{
	disabled: boolean,
	flat: boolean,
	hasButton: boolean,
	heading: string,
	heading_justify?: VRow['$props']['justify'],
	heading_class?: string,
	heading_size?: string,
	lg: string,
	loading: boolean,
	my: string,
	outlined: boolean,
	pad: boolean,
	sm: string,
	tile: boolean,
	xl: string
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
	xl: '6'
});

</script>

<style>
.card_border{
	border: 1px solid rgba(0,0,0,.2);
}
</style>