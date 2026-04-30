<template>
	<v-row class='ma-0 pa-0 text-body-small align-center' density='compact'>
		<v-col class='ma-0 pa-0 ' cols='12'>
			<v-row class='align-center ma-0 pa-0'>
				<v-col class='ma-0 pa-0' cols='auto'>
					<span class='unselectable'>{{ name }}</span>
				</v-col>

				<v-spacer />

				<v-col class='ma-0 pa-0' cols='auto'>
					<span class='font-weight-bold'>{{ address }}</span>
				</v-col>

				<v-col class='ma-0 pa-0 ml-md-1' cols='auto'>
					<CopyButton
						color='primary'
						:density='"comfortable"'
						:hover-message
						:no-height='true'
						:small='true'
						:to-copy
						:tooltip-message
					/>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">

defineProps<{
	address: string
	name: string
	toCopy: string
	tooltipMessage: string
	hoverMessage: string
}>()

</script>
