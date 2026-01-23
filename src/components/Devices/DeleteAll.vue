<template>
	<ActionButton
		:block='true'
		color='pi'
		:icon='mdiDelete'
		:icon-first='true'
		text='delete all'
		@click='deleteAll'
	/>
</template>

<script setup lang='ts'>
import type { TAuthObject } from '@/types'
import { mdiDelete } from '@mdi/js'
import { axios_device } from '@/services/axios'
import { dialoger } from '@/services/dialog'

const emit = defineEmits(['refresh'])
async function deleteAll_confirm (authentication: TAuthObject): Promise<void> {
	const loading_store = loadingModule()
	loading_store.set_loading(true)
	await axios_device.all_delete(authentication)
	emit('refresh')
	loading_store.set_loading(false)
}
async function deleteAll (): Promise<void> {
	dialoger({
		message: 'Are you sure you want to delete all your devices?',
		buttonText: 'confirm',
		title: 'Delete Device',
		passwordrequired: true,
		twoFABackup: true,
		icon: '',
		confirmMethod: deleteAll_confirm,
		twoFARequired: false,
	})
}

</script>
