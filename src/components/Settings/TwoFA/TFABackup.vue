<template>
	<section>
		<v-row align='center' justify='center' class='ma-0 pa-0' v-if='!backup && !backupProcess'>
			<v-col cols='12' class='pa-0 mb-4'>
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
			<v-row v-if='!backupArray' align='center' justify='center' class='ma-0 pa-0'>
				<v-col cols='12' md='auto' class='ma-0 pa-0 my-2'>
					<ActionButton v-if='!backupProcess' @click='generateBackups' :block='true'
						:color='backupButtonColor' v-model:disabled='localLoading' :icon='backupButtonIcon' small
						:text='backupButtonText' />
				</v-col>
			</v-row>
		</v-expand-transition>
		<v-expand-transition>
			<section v-if='backupArray'>
				<section>
					<v-row align='center' justify='center' class='ma-0 pa-0'>
						<v-col cols='auto' class='ma-0 pa-0 text-primary font-weight-bold'>
							These backup tokens need to be stored securely, each token can only be used once
						</v-col>
					</v-row>
					<v-row justify='center' align='center' density='compact' no-gutters class='mt-4'>
						<v-col cols='auto' class='ma-0 pa-0'>
							<v-table>
								<template v-slot:default>
									<tbody>
										<tr v-for='(item, index) in backupArray.slice(0, 5)' :key='index'>
											<td class=''>
												<v-row class='ma-0 pa-0' dense no-gutters>
													<v-col class='pa-0 ma-0'>
														{{ item }}
													</v-col>
												</v-row>
											</td>
											<td class=''>
												<v-row class='ma-0 pa-0' dense no-gutters>
													<v-col class='pa-0 ma-0'>
														{{ backupArrayIndexPlusFive(index) }}
													</v-col>
												</v-row>
											</td>
										</tr>
									</tbody>
								</template>
							</v-table>
							<v-row justify='space-between' align='center' no-gutters class='mt-4'>
								<v-col cols='auto'>
									<ActionButton @click='close' color='pi' :icon='mdiClose' text='close' />

								</v-col>
								<v-col cols='auto' class='mx-2'>
									<ActionButton @click='downloadCodes' :icon='mdiDownload' color='secondary'
										text='download' />
								</v-col>
								<v-col cols='auto'>
									<ActionButton @click='copyCodes' :icon='mdiContentCopy' id='tooltip'
										text='copy all' />
									<v-tooltip v-if='show_tooltip' :open-on-click='true' :open-on-hover='false'
										activator='parent' location='top center' content-class='tooltip'>
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

import { axios_authenticatedUser } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiClose, mdiContentCopy, mdiDownload, mdiShieldKey, mdiShieldRefresh } from '@mdi/js';
import { snackSuccess } from '@/services/snack';
import { useClipboard } from '@vueuse/core';
import { useDisplay } from 'vuetify';
import type { TAuthObject } from '@/types';

const settingsSectionStore = settingSectionModule();
onBeforeUnmount(() => {
	clearTimeout(showTooltipTimeout.value);
	showTooltipTimeout.value = 0;
	backupProcess.value = false;

});
const { mobile } = useDisplay();

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value));
const twoFAStore = twoFAModule();
const backup = computed(() => twoFAStore.count > 0);
const backupButtonIcon = computed(() => backup.value ? mdiShieldRefresh : mdiShieldKey);
const backupButtonText = computed(() => backup.value ? 'refresh backup tokens' : 'generate backup tokens');
const backupButtonColor = computed(() => backup.value ? 'secondary' : 'primary');
const backupProcess = computed({
	get (): boolean {
		return twoFAStore.backupProcess;
	},
	set (b: boolean): void {
		twoFAStore.set_backupProcess(b);
	}
});
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const backupArray: Ref<undefined | Array<string>> = ref(undefined);
const localLoading = ref(false);
const showTooltipTimeout = ref(0);
const showTooltip = ref(true);

const backupArrayIndexPlusFive = (index: number): string => {
	if (!backupArray.value) return 'ERROR';
	const i = index + 5;
	const indexed = backupArray.value[i];
	return indexed ? indexed : 'error';
};

const backupCodes = (): string => {
	if (!backupArray.value) return '';
	let output = `staticPi 2FA backup tokens\n`;
	for (const i of backupArray.value) output += `\n${i}\n`;
	return output;
};

const close = (): void => {
	settingsSectionStore.set_current_section(undefined);
	backupProcess.value = false;
	backupArray.value = undefined;
};

/**
 ** Copy the 2fa codes, create multi-line string with description as first line
 */
const copyCodes = (): void => {
	useClipboard().copy(backupCodes());
	showTooltip.value = true;
	showTooltipTimeout.value = setTimeout(() => {
		showTooltip.value = false;
	}, 1500);
};

/**
 ** Download the 2fa codes as .txt, all clientside, create multi-line string with description as first line
 */
const downloadCodes = (): void => {
	const downloadCodes = document.createElement('a');
	downloadCodes.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(backupCodes()));
	downloadCodes.setAttribute('download', 'staticPi_2FA_backup_tokens.txt');
	downloadCodes.style.display = 'none';
	document.body.appendChild(downloadCodes);
	downloadCodes.click();
	document.body.removeChild(downloadCodes);
};

/**
** Generate button - dialog warning overwrite if backups already exist, else just generate
*/
const generateBackups = async (): Promise<void> => {
	if (backup.value) {
		dialoger({
			message: 'Refreshing will revoke all currently active backup tokens, do you wish to continue?',
			buttonText: 'refresh',
			title: 'Confirm',
			passwordrequired: true,
			confirmMethod: re_generateBackups_confirm,
			icon: '',
			twoFABackup: true,
			twoFARequired: true
		});
	} else {
		generateBackups_confirm();
	}
};

/**
 ** Patch request to re-genenerate backup codes, password is required
 */
const re_generateBackups_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	localLoading.value = true;
	backupProcess.value = true;
	settingsSectionStore.set_current_section('2fa');
	const response = await axios_authenticatedUser.twoFA_backup_patch(authentication);
	if (response) {
		backupArray.value = response;
		snackSuccess({ message: 'Backup codes re-generated' });
	} else close();
	loading.value = false;
	localLoading.value = false;
};

/**
 ** Post request to generate new backup tokens
 */
const generateBackups_confirm = async (): Promise<void> => {
	loading.value = true;
	localLoading.value = true;
	backupProcess.value = true;
	settingsSectionStore.set_current_section('2fa');
	const response = await axios_authenticatedUser.twoFA_backup_post();
	loading.value = false;
	localLoading.value = false;
	if (response) backupArray.value = response;
	else close();
};

watch(backup, (i: boolean): void => {
	if (!i && backupArray.value) backupArray.value = [];
});
</script>