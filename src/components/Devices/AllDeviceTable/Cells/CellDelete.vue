<template>
	<v-row align='center' class='no-gutters pa-0 ma-0' :justify>

		<FabTooltip
			color='pi'
			:disabled='!online'
			:icon='mdiDeleteCircle'
			:tooltip-text
			@click='deleteDevice'
		/>
	</v-row>
</template>

<script setup lang='ts'>
import type { VRow } from 'vuetify/components/VGrid'
import type { TAuthObject, TDeviceInfo } from '@/types'
import { mdiDeleteCircle } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_device } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'

const { mdAndUp } = useDisplay()

const justify = computed(() => mdAndUp.value ? 'center' : 'end')
const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})
const tooltipText = computed(() => `delete: ${name_of_device.value}`)
const name_of_device = computed(() => props.device.name_of_device)
const online = computed(() => browserModule().online)

async function deleteDevice (): Promise<void> {
	dialoger({
		message: `Are you sure you want to delete device "${name_of_device.value}"`,
		buttonText: 'delete',
		icon: mdiDeleteCircle,
		title: 'Delete device',
		confirmMethod: deleteDevice_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: false,
	})
}
async function deleteDevice_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_device.named_delete({
		name: name_of_device.value,
		authentication,
	})
	loading.value = false
	if (response) {
		snackSuccess({
			message: `Deleted "${name_of_device.value}"`,
			icon: mdiDeleteCircle,
		})
		emit('refresh')
	}
}

const emit = defineEmits(['refresh'])

const props = defineProps<{ device: TDeviceInfo }>()
</script>
