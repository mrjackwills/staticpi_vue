<template>
	<section>
		<v-row v-if='!backup && !backupProcess' class='align-center ma-0 pa-0 justify-center'>
			<v-col class='pa-0 mb-4' cols='12'>
				Backups enable a user to login to their account in situations where their Two-Factor Authentication app
				is unavailable.
				Each backup code can only be used once, and must be safely stored by the user.
				<br>
				<br>
				All backup tokens are salted and hashed before being written to the database. This means that lost
				backup tokens cannot be retrieved by
				<StaticPi />.
			</v-col>
		</v-row>

		<v-expand-transition>
			<v-row v-if='!backupArray' class='align-center ma-0 pa-0 justify-center'>
				<v-col class='ma-0 pa-0 my-2' cols='12' md='auto'>
					<ActionButton
						v-if='!backupProcess'
						:block='true'
						:color='backupButtonColor'
						:disabled='localLoading'
						:icon='backupButtonIcon'
						small
						:text='backupButtonText'
						@click='generateBackups'
					/>
				</v-col>
			</v-row>
		</v-expand-transition>

		<v-expand-transition>
			<section v-if='backupArray'>
				<section>
					<v-row class='align-center ma-0 pa-0  justify-center'>
						<v-col class='ma-0 pa-0 text-primary font-weight-bold' cols='auto'>
							These backup tokens need to be stored securely, each token can only be used once
						</v-col>
					</v-row>

					<v-row
						class='mt-4 align-center justify-center'
						density='compact'
					>
						<v-col class='ma-0 pa-0' cols='auto'>
							<v-table>
								<template #default>
									<tbody>
										<tr v-for='(item, index) in backupArray.slice(0, 5)' :key='index'>
											<td class=''>
												<v-row class='ma-0 pa-0' density='compact'>
													<v-col class='pa-0 ma-0'>
														{{ item }}
													</v-col>
												</v-row>
											</td>

											<td class=''>
												<v-row class='ma-0 pa-0' density='compact'>
													<v-col class='pa-0 ma-0'>
														{{ backupArrayIndexPlusFive(index) }}
													</v-col>
												</v-row>
											</td>
										</tr>
									</tbody>
								</template>
							</v-table>

							<v-row class='align-center mt-4 justify-space-between' density='compact'>
								<v-col cols='auto'>
									<ActionButton color='pi' :icon='mdiClose' text='close' @click='close' />

								</v-col>

								<v-col class='mx-2' cols='auto'>
									<ActionButton
										color='secondary'
										:icon='mdiDownload'
										text='download'
										@click='downloadCodes'
									/>
								</v-col>

								<v-col cols='auto'>
									<ActionButton
										id='tooltip'
										:icon='mdiContentCopy'
										text='copy all'
										@click='copyCodes'
									/>

									<v-tooltip
										v-if='show_tooltip'
										activator='parent'
										content-class='tooltip'
										location='top center'
										:open-on-click='true'
										:open-on-hover='false'
									>
										<span>copied to clipboard</span>
									</v-tooltip>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</section>
			</section>
		</v-expand-transition>
	</section>
</template>

<script setup lang='ts'>

import type { TAuthObject } from '@/types'
import { mdiClose, mdiContentCopy, mdiDownload, mdiShieldKey, mdiShieldRefresh } from '@mdi/js'
import { useClipboard } from '@vueuse/core'
import { useDisplay } from 'vuetify'
import { axios_authenticatedUser } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'

const settingsSectionStore = settingSectionModule()
onBeforeUnmount(() => {
	clearTimeout(showTooltipTimeout.value)
	showTooltipTimeout.value = 0
	backupProcess.value = false
})
const { mobile } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))
const twoFAStore = twoFAModule()
const backup = computed(() => twoFAStore.count > 0)
const backupButtonIcon = computed(() => backup.value ? mdiShieldRefresh : mdiShieldKey)
const backupButtonText = computed(() => backup.value ? 'refresh backup tokens' : 'generate backup tokens')
const backupButtonColor = computed(() => backup.value ? 'secondary' : 'primary')
const backupProcess = computed({
	get (): boolean {
		return twoFAStore.backupProcess
	},
	set (b: boolean): void {
		twoFAStore.set_backupProcess(b)
	},
})
const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

const backupArray: Ref<undefined | Array<string>> = ref(undefined)
const localLoading = ref(false)
const showTooltipTimeout = ref(0)
const showTooltip = ref(true)

function backupArrayIndexPlusFive (index: number): string {
	if (!backupArray.value) return 'ERROR'
	const i = index + 5
	const indexed = backupArray.value[i]
	if (indexed) return indexed
	return 'error'
}

function backupCodes (): string {
	if (!backupArray.value) return ''
	let output = `staticPi 2FA backup tokens\n`
	for (const i of backupArray.value) output += `\n${i}\n`
	return output
}

function close (): void {
	settingsSectionStore.set_current_section(undefined)
	backupProcess.value = false
	backupArray.value = undefined
}

/**
 ** Copy the 2fa codes, create multi-line string with description as first line
 */
function copyCodes (): void {
	useClipboard().copy(backupCodes())
	showTooltip.value = true
	showTooltipTimeout.value = setTimeout(() => {
		showTooltip.value = false
	}, 1500)
}

/**
 ** Download the 2fa codes as .txt, all clientside, create multi-line string with description as first line
 */
function downloadCodes (): void {
	const downloadCodes = document.createElement('a')
	downloadCodes.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(backupCodes()))
	downloadCodes.setAttribute('download', 'staticPi_2FA_backup_tokens.txt')
	downloadCodes.style.display = 'none'
	document.body.append(downloadCodes)
	downloadCodes.click()
	downloadCodes.remove()
}

// Generate button - dialog warning overwrite if backups already exist, else just generate
async function generateBackups (): Promise<void> {
	if (backup.value) {
		dialoger({
			message: 'Refreshing will revoke all currently active backup tokens, do you wish to continue?',
			buttonText: 'refresh',
			title: 'Confirm',
			passwordrequired: true,
			confirmMethod: re_generateBackups_confirm,
			icon: '',
			twoFABackup: true,
			twoFARequired: true,
		})
	} else {
		generateBackups_confirm()
	}
}

/**
 ** Patch request to re-generate backup codes, password is required
 */
async function re_generateBackups_confirm (authentication: TAuthObject): Promise<void> {
	loading.value = true
	localLoading.value = true
	backupProcess.value = true
	settingsSectionStore.set_current_section('2fa')
	const response = await axios_authenticatedUser.twoFA_backup_patch(authentication)
	if (response) {
		backupArray.value = response
		snackSuccess({ message: 'Backup codes re-generated' })
	} else close()
	loading.value = false
	localLoading.value = false
}

/**
 ** Post request to generate new backup tokens
 */
async function generateBackups_confirm (): Promise<void> {
	loading.value = true
	localLoading.value = true
	backupProcess.value = true
	settingsSectionStore.set_current_section('2fa')
	const response = await axios_authenticatedUser.twoFA_backup_post()
	loading.value = false
	localLoading.value = false
	if (response) backupArray.value = response
	else close()
}

watch(backup, (i: boolean): void => {
	if (!i && backupArray.value) backupArray.value = []
})
</script>
