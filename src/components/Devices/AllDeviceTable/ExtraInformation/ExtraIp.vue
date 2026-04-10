<template>
	<v-row class='align-center ma-0 pa-0 no gutters'>

		<v-col class='ma-0 pa-0' cols='auto'>
			<span class='hidden-md-and-up font-weight-bold'>ip address: </span>
		</v-col>

		<v-spacer />

		<v-col class='ma-0 pa-0' cols='auto' order='2'>
			{{ ip }}
		</v-col>

		<v-col class='ma-0 pa-0' cols='auto' order='1'>
			<CopyButton
				color='primary'
				density='compact'
				hover-message='click to copy IP address'
				small
				:to-copy='ip'
				tooltip-message='IP address copied!'
			/>
		</v-col>

	</v-row>
</template>

<script setup lang='ts'>
defineProps<{ ip: string }>()
</script>
