<template>
	<v-row class='pa-0 ma-0 align-center' :class='justify' density='compact'>
		<v-col class='ma-0 pa-0' :class='mdAndUp ? "mr-2" : "mr-4"' cols='auto'>
			<CopyButton
				color='primary'
				density='comfortable'
				:disabled='paused'
				hover-message='click to copy API key'
				:name_of_device
				small
				:to-copy='device.api_key'
				tooltip-message='API key copied!'
			/>
		</v-col>

		<v-col class='ma-0 pa-0' cols='auto'>

			<template v-if='tooltipAvailable'>
				<v-btn
					class='fab-fix'
					density='comfortable'
					:disabled='paused'
					icon
					size='small'
					variant='text'
					@click='regenerateApiKey'
				>
					<v-icon color='pi' :icon='mdiAutorenew' />

					<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
						<span>regenerate API key</span>
					</v-tooltip>
				</v-btn>
			</template>

			<v-btn
				v-else
				class='fab-fix'
				:disabled='paused'
				fab
				size='x-small'
				text='true'
				@click='regenerateApiKey'
				@mouseover='tooltipAvailable = true'
			>
				<v-icon color='pi' :icon='mdiAutorenew' />
			</v-btn>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import type { TAuthObject, TDeviceInfo } from '@/types'
import type { VRow } from 'vuetify/components/VGrid'
import { mdiAutorenew } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_device } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'

const { mdAndUp, mobile } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))

const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

const justify = computed(() => mdAndUp.value ? 'justify-center' : 'justify-end')
const name_of_device = computed(() => props.device.name_of_device)
const paused = computed(() => props.device.paused)

const showTooltip = ref(false)
const tooltipAvailable = ref(true)

function regenerateApiKey (): void {
	showTooltip.value = false
	tooltipAvailable.value = false
	dialoger({
		message: `Regenerating the API key for "${name_of_device.value}" will force disconnect the pi and any connected clients`,
		icon: mdiAutorenew,
		buttonText: 'regenerate',
		title: 'Regenerate API Key',
		confirmMethod: regenerateApiKey_confirm,
		passwordrequired: true,
		twoFABackup: false,
		twoFARequired: false,
	})
}

const emit = defineEmits(['refresh'])
async function regenerateApiKey_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_device.apiKey_patch({
		authentication,
		name: name_of_device.value,
	})
	loading.value = false
	if (response) {
		snackSuccess({
			message: `"${name_of_device.value}" API key regenerated`,
			icon: mdiAutorenew,
		})
		emit('refresh')
	}
}

const props = defineProps<{ device: TDeviceInfo }>()
</script>
