<template>
	<v-row align='center' class='no-gutters ma-0 pa-0 text-caption'>
		<v-col cols='12' class='ma-0 pa-0 '>
			<v-row align='center' class='ma-0 pa-0'>
				<v-col cols='auto' class='ma-0 pa-0'>
					<span class='unselectable'>{{ name }}</span>
				</v-col>
				<v-spacer />
				<v-col cols='auto' class='ma-0 pa-0'>
					<span class='font-weight-bold'>{{ address }}</span>
				</v-col>
				<v-col cols='auto' class='ma-0 pa-0 ml-md-1'>
					<CopyButton color='primary' :noHeight='true' :small='true' :toCopy='toCopy' :tooltipMessage='tooltipMessage' :hoverMessage='hoverMessage' :density='"comfortable"'/>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
import CopyButton from '@/components/Buttons/CopyButton.vue';

defineProps({
	name: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	toCopy: {
		type: String,
		required: true
	},
	tooltipMessage: {
		type: String,
		required: true
	},
	hoverMessage: {
		type: String,
		required: true
	},
		
});
</script>