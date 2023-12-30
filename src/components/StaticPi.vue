<template>
	<span :class='`text-${color}`'>static<span class='font-weight-black'>Pi</span></span>
</template>

<script setup lang="ts">

withDefaults(defineProps<{color?: string}>(), {
	color: 'pi'
});

</script>