
<template>
	<v-container fluid class='ma-0 pa-0 no-gutters' :class='{"fill-height":fillHeight}'>
		<v-progress-linear
			:active='true'
			:indeterminate='loading'
			bg-opacity='0'
			class='mb-n2'
			color='primary'
			top
		/>

		<v-row class='ma-0 pa-0 no-gutters' :class='{"fill-height":fillHeight}'  v-if='pageReady' align='center' :justify='to_justify' id='the_page'>
			
			<v-container fluid class='ma-0 pa-0' :class='{"fill-height":fillHeight}' >
				<v-row class='ma-0 pa-0' dense justify='center' align='center'>
					<v-col cols='12' class='pa-0 ma-0 mt-1'>
						<CardHeading
							v-if='heading'
							:heading='heading'
							:justify='heading_justify'
							:margin='margin'
							class='ml-2'
							
						/>
						<slot name='body' />
					</v-col>
				</v-row>
			</v-container>
		</v-row>
		<div class='' id='goto_page_bottom' >
		</div>
	</v-container>
</template>

<script setup lang='ts'>
import CardHeading from '@/components/Card/CardHeading.vue';
import type { TJustify } from '@/types';

const loading = computed((): boolean => {
	return loadingModule().loading;
});

const heading_justify = computed((): TJustify=> {
	switch (props.headingJustify) {
	case 'end':
		return 'end';
	case 'start':
		return 'start';
	case 'space-around':
		return 'space-around';
	case 'space-between':
		return 'space-between';
	case 'space-evenly':
		return 'space-evenly';
	case 'stretch':
		return 'stretch';
	}
	return 'center';
});

const to_justify = computed((): TJustify=> {
	switch (props.justify) {
	case 'end':
		return 'end';
	case 'start':
		return 'start';
	case 'space-around':
		return 'space-around';
	case 'space-between':
		return 'space-between';
	case 'space-evenly':
		return 'space-evenly';
	case 'stretch':
		return 'stretch';
	}
	return 'center';
});

const props = defineProps({
	heading: {
		type: String,
		default: '',
	},
	fillHeight: {
		type: Boolean,
		default: false
	},
	justify: {
		type: String,
		default: 'center',
	},
	headingJustify: {
		type: String,
		default: 'center',
	},
	margin: {
		type: String,
		default: ''
	},
	pageReady: {
		type: Boolean,
		default: true
	}
}) ;

</script>

<style scoped>

.page{
	background-color: rgb(var(--v-theme-backgroundColor));
}

.alert-bottom {
	bottom: 0;
	margin-bottom: 100px;
	min-width: 100%;
	position: fixed;
	z-index: 100;
}

.alert-top {
	margin-bottom: 100px;
	min-width: 100%;
	top: 0;
	z-index: 100;
}
</style>