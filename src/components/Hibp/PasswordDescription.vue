<template>
	<section>
		All passwords need to be 12 characters minimum, and cannot contain your current password nor your email address.
		Your password should be unique to <StaticPi />, and ideally contain random letters, numbers, and symbols.
		Passwords are securely checked (using k-anonymity) against a database of known passwords, by utilizing the
		<a class='text-black' href='https://haveibeenpwned.com/Passwords' rel='noopener noreferrer' target='_blank'>
			hibp
			<v-icon color='black' :icon='mdiOpenInNew' size='x-small' style='vertical-align: middle;' />
		</a>
		service.
	</section>
</template>

<script setup lang='ts'>
import { mdiOpenInNew } from '@mdi/js'
</script>
