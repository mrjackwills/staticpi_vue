<template>
	<section>
		All passwords need to be 12 characters minimum, and cannot contain your current password nor your email address.
		Your password should be unique to <StaticPi />, and ideally contain random letters, numbers, and symbols.
		Passwords are securely checked (using k-anonymity) against a database of known passwords, by utilizing the
		<a href='https://haveibeenpwned.com/Passwords' target='_blank' rel='noopener noreferrer' class='text-black'>
			hibp
			<v-icon size='x-small' color='black' style='vertical-align: middle;' :icon='mdiOpenInNew' />
		</a>
		service.
	</section>
</template>

<script setup lang='ts'>
import { mdiOpenInNew } from '@mdi/js';
</script>