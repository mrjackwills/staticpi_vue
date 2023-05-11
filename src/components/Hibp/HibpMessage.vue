<template>
	<section >
		<div class='text-center text-pi font-weight-medium mb-2 ' :class='[pSize, mt]'><span class='text-uppercase font-weight-bold'>
				This password is unsafe and invalid</span>
			<br>
			This password has previously appeared in a data breach and should never be used. If you use this password elsewhere, it should be changed immediately.
			Passwords should be a complex combination of letters, numbers, and symbols. A password manager is strongly recommended
			<br>
			<a href='https://haveibeenpwned.com/Passwords' target='_blank' rel='noopener noreferrer' class='text-caption text-black'>
				(password checking powered by hipb)
				<v-icon size='x-small' style='vertical-align: middle;' :icon='mdiOpenInNew' />
			</a>
		</div>
	</section>
</template>

<script setup lang='ts'>
import { mdiOpenInNew } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mdAndDown } = useDisplay();

const pSize = computed((): string => {
	return mdAndDown.value ? 'text-caption': 'text-body-2';
});

defineProps<{mt?: string}>();
</script>