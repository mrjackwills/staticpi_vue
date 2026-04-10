<template>
	<SettingSection :disabled='componentDisabled'>
		<template #title>
			<span>Two-Factor Authentication</span>
		</template>
		<template #titleIcon>
			<v-icon class='mr-2' color='pi' :icon='mdiShieldHalfFull' :size='smAndDown ? "small" : "default"' />
		</template>

		<template #text_description>
			<v-expand-transition>
				<TFAInactiveText v-if='!active && !setupProcessStarted' />
			</v-expand-transition>
			<v-expand-transition>
				<section v-if='active && !backupProcess'>
					<TFAStatusRow :active text='Two-Factor enabled' @click='removeTwoFA' />
					<v-row class='ma-0 pa-0 justify-center'>
						<v-col class='ma-0 pa-0' cols='12' md='8'>
							<v-divider />
						</v-col>
					</v-row>
				</section>
			</v-expand-transition>
			<v-expand-transition>
				<TFAStatusRow
					v-if='active && !backupProcess'
					:active='count > 0'
					:text='backupText'
					@click='removeBackups'
				/>
			</v-expand-transition>
			<v-expand-transition>
				<TFABackup v-if='active' />
			</v-expand-transition>
			<v-expand-transition>
				<TFAAlwaysRequired v-if='active && !backupProcess' />
			</v-expand-transition>
		</template>
		<template #body>
			<v-expand-transition>
				<TFAInstructions v-if='!active && setupProcessStarted' />
			</v-expand-transition>
		</template>
		<template #action_button>
			<v-expand-transition>
				<TFAEnable v-if='!active && !setupProcessStarted' />
			</v-expand-transition>
			<ActionButton
				v-if='showCancel && !backupProcess && singleSectionOpen'
				color='pi'
				:icon='mdiClose'
				:icon-first='true'
				:small='true'
				text='close'
				@click='cancel'
			/>
		</template>
	</SettingSection>
</template>

<script setup lang='ts'>
import type { TAuthObject } from '@/types'
import { mdiClose, mdiDeleteCircle, mdiShieldHalfFull } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_authenticatedUser } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'

const { smAndDown } = useDisplay()

const [settingSectionStore, twoFAStore] = [settingSectionModule(), twoFAModule()]

onBeforeMount(async () => {
	twoFAStore.set_secret('')
	twoFAStore.set_setupProcessStarted(false)
	twoFAStore.set_backupProcess(false)
	if (setupProcessStarted.value) {
		await axios_authenticatedUser.setupTwoFA_delete()
	}
})

onMounted(() => {
	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === '2fa') {
		settingSectionStore.set_beforemount_open(false)
		settingSectionStore.set_current_section(undefined)
	}
})

const active = computed(() => twoFAStore.active)
const backupProcess = computed(() => twoFAStore.backupProcess)
const backupText = computed(() => Number(count.value) > 0 ? `Backups enabled (${count.value} remaining)` : 'Backup tokens not enabled')
const componentDisabled = computed(() => settingSectionStore.current_section && settingSectionStore.current_section !== '2fa' ? true : false)
const count = computed(() => twoFAStore.count)
const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})
const setupProcessStarted = computed(() => twoFAStore.setupProcessStarted)
const singleSectionOpen = computed(() => settingSectionStore.current_section === '2fa')

const showCancel = ref(false)

function cancel (): void {
	showCancel.value = false
	settingSectionStore.set_current_section(undefined)
}
async function removeTwoFA_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_authenticatedUser.twoFA_delete(authentication)
	loading.value = false
	settingSectionStore.set_current_section(undefined)
	if (response) snackSuccess({
		message: 'Two-Factor Authentication removed',
		icon: mdiDeleteCircle,
	})
}
async function removeBackups_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_authenticatedUser.twoFA_backup_delete(authentication)
	loading.value = false
	settingSectionStore.set_current_section(undefined)
	if (response) snackSuccess({
		message: 'Two-Factor backup codes removed',
		icon: mdiDeleteCircle,
	})
}

async function removeBackups (): Promise<void> {
	dialoger({
		message: 'Are you sure you want to remove your Two-Factor Authentication backup tokens?',
		buttonText: 'confirm',
		title: 'Remove Backup Codes',
		passwordrequired: true,
		confirmMethod: removeBackups_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: true,
	})
}

function removeTwoFA (): void {
	let message = 'Are you sure you want to reduce the safety and security of your account by removing Two-Factor Authentication'
	message += count.value > 0 ? ', and your backup tokens?' : '?'
	dialoger({
		message,
		buttonText: 'confirm',
		title: 'Warning',
		passwordrequired: true,
		confirmMethod: removeTwoFA_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: true,
	})
}

</script>
