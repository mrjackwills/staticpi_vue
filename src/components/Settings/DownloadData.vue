<template>
	<SettingSection :disabled='componentDisabled'>
		<template  v-slot:titleIcon>
			<v-icon color='pi' class='mr-2' :size='smAndDown?"small":"default"' :icon='mdiAccountArrowDown ' />
		</template>

		<template v-slot:title>
			Download Data
		</template>

		<template v-slot:text_description>
			If you wish to access and download all the information associated with their account, simply click the 'download data' button and follow the prompts to receive your information.
			<br>
			Please note, that this is limited to once per 24-hours.
		</template>

		<template v-slot:action_button>
			<v-expand-transition>
				<v-row
					align='center'
					justify='center'
					class='ma-0 pa-0'
				>
					<v-col cols='12' md='auto' class='ma-0 pa-0'>
						<ActionButton
							@click='downloadData'
							:block='true'
							:icon='mdiDownload '
							small
							text='download data'
						/>
					</v-col>
				</v-row>
			</v-expand-transition>
		</template>
		
	</SettingSection>
</template>

<script setup lang='ts'>
import { axios_authenticatedUser } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiAccountArrowDown, mdiDownload } from '@mdi/js';
import { useDisplay } from 'vuetify';
import type { TAuthObject } from '@/types';

const { smAndDown } = useDisplay();

const settingSectionStore = settingSectionModule();

onBeforeMount(() => {

	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'downloaddata') {
		settingSectionStore.set_beforemount_open(false);
	}
});

const componentDisabled = computed((): boolean => {
	return settingSectionStore.current_section && settingSectionStore.current_section !== 'downloaddata' ? true : false;
});

const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const downloadData = async (): Promise<void> => {
	dialoger({
		message: `Authentication required in order to download user data`,
		buttonText: 'download data',
		icon: mdiDownload,
		title: 'User Data',
		confirmMethod: downloadData_confirm,
		passwordrequired: true,
		twoFABackup: true,
		twoFARequired: true,
	});

};

const downloadData_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	let data = await axios_authenticatedUser.data_get(authentication);
	if (data) {

		const file = document.createElement('a');
		file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(JSON.parse(data), null, '  ')));
		file.setAttribute('download', 'staticPi_user_data.txt');
		file.style.display = 'none';
		document.body.appendChild(file);
		file.click();
		document.body.removeChild(file);
	}
	loading.value = false;
};

</script>