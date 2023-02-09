<template>
	<ActionButton
		@click='start2FASetup'
		:block='true'
		:icon='mdiShieldPlus'
		text='enable 2FA'
		small
	/>
</template>

<script setup lang='ts'>
import { axios_authenticatedUser } from '@/services/axios';
import { mdiShieldPlus } from '@mdi/js';
import ActionButton from '@/components/Buttons/ActionButton.vue';

const start2FASetup = async (): Promise<void> => {
	const [ loadingStore, settingsectionStore, twofaStore ] = [ loadingModule(), settingSectionModule(), twoFAModule() ];
	loadingStore.set_loading(true);
	const setupValid = await axios_authenticatedUser.setupTwoFA_get();
	if (setupValid) {
		settingsectionStore.set_current_section('2fa');
		twofaStore.set_setupProcessStarted(true);
	}
	else {
		settingsectionStore.set_current_section(undefined);
		twofaStore.set_setupProcessStarted(false);
	}
	loadingStore.set_loading(false);
};
</script>