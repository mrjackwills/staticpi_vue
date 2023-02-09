<template>
	<span :class='`text-${color}`'>static<span class='font-weight-black'>Pi</span></span>
</template>

<script setup lang="ts">
defineProps({
	color: {
		type: String,
		default: 'pi'
	}

});
</script>