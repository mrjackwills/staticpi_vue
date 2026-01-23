<template>
	<v-row class='ma-0 pa-0' justify='center'>
		<v-col class='ma-0 pa-0' cols='12' md='12'>
			<v-divider v-if='!current_section' class='my-6' />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>

const current_section = computed(() => settingSectionModule().current_section)
</script>
