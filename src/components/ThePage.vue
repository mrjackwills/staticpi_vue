<template>

	<v-container class='ma-0 pa-0 fill' :class='{"fill-height d-flex align-center flex-wrap":fillHeight}' density='compact' fluid>
		<v-progress-linear
			:active='true'
			bg-opacity='0'
			class='mb-n2 sticky-loading'
			color='primary'
			:indeterminate='loading'
		/>

		<!-- TODO fix me -->
		<v-row
			v-if='pageReady'
			id='the_page'
			class='ma-0 pa-0 align-center '
			:class='[{"fill-height d-flex align-center flex-wrap":fillHeight}, computedJustify]'
			density='compact'
		>

			<v-container class='ma-0 pa-0' :class='{"fill-height d-flex align-center flex-wrap":fillHeight}' fluid>
				<v-row class='align-center ma-0 pa-0 justify-center' density='compact'>
					<v-col class='pa-0 ma-0 mt-1' cols='12'>
						<CardHeading
							v-if='heading'
							class='ml-2'
							:class='justify'
							:heading
							:margin
						/>
						<slot name='body' />
					</v-col>
				</v-row>
			</v-container>
		</v-row>
		<div id='goto_page_bottom' class='' />
	</v-container>
</template>

<script setup lang='ts'>
import type { VRow } from 'vuetify/components/VGrid'
const loading = computed(() => loadingModule().loading)

const appbarHeight = computed(() => appBarModule().size)

const computedJustify = computed(() => `justify-${props.justify}`)

const props = withDefaults(defineProps<{
	fillHeight?: boolean
	heading?: string
	headingJustify?: VRow['$props']['justify']
	justify?: VRow['$props']['justify']
	margin?: string
	pageReady?: boolean
}>(), {
	fillHeight: false,
	heading: '',
	headingJustify: 'center',
	justify: 'center',
	margin: '',
	pageReady: true,
})

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

.sticky-loading {
  position: fixed;
  top: v-bind(appbarHeight + 'px')!important;
}
</style>
