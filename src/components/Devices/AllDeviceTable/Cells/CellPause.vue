<template>
	<v-row align='center' class='' :justify no-gutters>
		<FabTooltip
			:color
			:disabled='!online'
			:icon
			:tooltip-text
			@click='pauseDevice'
		/>
	</v-row>
</template>
<script setup lang='ts'>
import type { VRow } from 'vuetify/components/VGrid'
import type { TAuthObject, TDeviceInfo } from '@/types'
import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_device } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'

const { mdAndUp } = useDisplay()

const color = computed(() => paused.value ? 'primary' : 'secondary')
const icon = computed(() => paused.value ? mdiPlayCircle : mdiPauseCircle)
const justify = computed(() => mdAndUp.value ? 'center' : 'end')
const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})
const tooltipText = computed(() => `${paused.value ? 'resume' : 'pause'}: ${name_of_device.value}`)

const paused = computed(() => props.device.paused)
const name_of_device = computed(() => props.device.name_of_device)
const online = computed(() => browserModule().online)

function pauseDevice (): void {
	dialoger({
		message: `Are you sure you want to ${paused.value ? 'resume' : 'pause'} device "${name_of_device.value}"?`,
		buttonText: paused.value ? 'resume' : 'pause',
		icon: paused.value ? mdiPlayCircle : mdiPauseCircle,
		title: `${paused.value ? 'Resume' : 'Pause'} device`,
		passwordrequired: false,
		timeout: 5,
		confirmMethod: pauseDevice_confirm,
		twoFABackup: false,
		twoFARequired: false,
	})
}

const emit = defineEmits(['refresh'])

async function pauseDevice_confirm (authentication?: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_device.paused_patch({
		pause: !paused.value,
		name: name_of_device.value,
		...authentication ? { authentication } : {},
	})
	loading.value = false
	if (response) {
		snackSuccess({
			message: `${paused.value ? 'resumed' : 'paused'} device : ${name_of_device.value}`,
			icon: paused.value ? mdiPlayCircle : mdiPauseCircle,
		})
		emit('refresh')
	}
}

const props = defineProps<{ device: TDeviceInfo }>()

</script>
