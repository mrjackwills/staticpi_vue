<template>
	<ActionButton
		:block='true'
		:icon='mdiShieldPlus'
		small
		text='enable 2FA'
		@click='start2FASetup'
	/>
</template>

<script setup lang='ts'>
import { mdiShieldPlus } from '@mdi/js'
import { axios_authenticatedUser } from '@/services/axios'

async function start2FASetup (): Promise<void> {
	const [loadingStore, settingsectionStore, twofaStore] = [loadingModule(), settingSectionModule(), twoFAModule()]
	loadingStore.set_loading(true)
	const setupValid = await axios_authenticatedUser.setupTwoFA_get()
	if (setupValid) {
		settingsectionStore.set_current_section('2fa')
		twofaStore.set_setupProcessStarted(true)
	} else {
		settingsectionStore.set_current_section(undefined)
		twofaStore.set_setupProcessStarted(false)
	}
	loadingStore.set_loading(false)
}
</script>
