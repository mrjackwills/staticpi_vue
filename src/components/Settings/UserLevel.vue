<template>
	<SettingSection :disabled='disabled'>
		<template v-slot:title>
			<span>User Level</span>
		</template>
		<template v-slot:titleIcon>
			<v-icon color='pi' class='mr-2' :size='smAndDown?"small":"default"' :icon='mdiCardAccountDetails' />
		</template>

		<template v-slot:body>

			<v-row align='center' justify='center' class='no-gutters ma-0 pa-0'>

				<v-col cols='12' md='6'  class='pa-0 ma-0 text-body-1'>
					<span class='font-weight-bold' :class='text_size'>current user level: </span>
					<span class='text-primary font-weight-black' :class='text_size'> {{ userLevel }}</span>
				</v-col>

				<v-col cols='12' md='6' class='ma-0 pa-0'>
					<v-row align='center' class='ma-0 pa-0 no-gutters'>
						<v-col v-if='timestamp' cols='auto' class='pa-0 ma-0 text-body-1'>
							<span class='font-weight-bold' :class='text_size'>member since:</span> <span :class='text_size'>{{ new Date(timestamp).toISOString().substring(0,10) }}</span>
						</v-col>

						<v-col
							v-if='birthday'
							cols='auto'
							class='ma-0 pa-0 ml-2'
						>
							<v-icon
								color='primary'
								size='small'
								class='mb-1'
								:icon='mdiCakeVariant'
							/>
							<v-tooltip v-if='show_tooltip' activator='parent' location='top center' content-class='tooltip'>
								<span >{{ birthday_tooltip }}</span>
							</v-tooltip>
					
						</v-col>
					</v-row>
				</v-col>

				<v-col cols='12' class='pa-0 ma-0 text-body-1'>
					<NumberOfDevices rowCols='6' />
				</v-col>
			</v-row>
		</template>

		<template v-slot:action_button>
			<v-row class='ma-0 pa-0' align='center' justify='center'>
				<v-col cols='12' class='ma-0 pa-0'>

					<ActionButton
						@click='upgradeAccount'
						:disabled='true'
						:block='true'
						small
						:icon='mdiProgressUpload'
						text='upgrade account'
						class=''
					/>
					<v-tooltip v-if='show_tooltip' activator='parent' v-model='show_tooltip' location='top center' content-class='tooltip'>
						<span>work-in-progress</span>
					</v-tooltip>

				</v-col>
			</v-row>
		</template>
	</SettingSection>
</template>

<script setup lang='ts'>
import { mdiCakeVariant, mdiCardAccountDetails, mdiProgressUpload } from '@mdi/js';
import { useDisplay } from 'vuetify';
import { zero_pad } from '@/vanillaTS/convert_seconds';
import ActionButton from '@/components/Buttons/ActionButton.vue';
import NumberOfDevices from '@/components/Devices/NumberOfDevices.vue';
import SettingSection from '@/components/Settings/SettingSection.vue';
import type { TSettingSection, u } from '@/types';
import type { UserLevel } from '@/types/enum_userLevel';

const { smAndDown } = useDisplay();
const [ settingSectionStore, userStore ] = [ settingSectionModule(), userModule() ];

onBeforeMount(() => {

	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'userlevel') {
		settingSectionStore.set_beforemount_open(false);
		settingSectionStore.set_current_section(undefined);
	}
});
	
const birthday_tooltip = computed((): string => {
	if (!timestamp.value) return '';
	const number = now.getFullYear() - timestamp.value.getFullYear();
	return number === 0 ? 'joined today!' :`member for ${number} year${number>1 ? 's' : ''}`;
});
// Do not like this
const birthday = computed((): boolean => {
	if (!timestamp.value) return false;
	let month_day =timestamp.value.toISOString().substring(5, 10);
	const now_day = now.getDate();
	const now_month = now.getMonth() +1;
	return `${month_day}` === `${zero_pad(now_month)}-${zero_pad(now_day)}`;
});

const text_size = computed((): string => {
	return smAndDown.value ? 'small-text' : '';
});
const timestamp = computed((): u<Date> => {
	return userStore.timestamp? new Date(userStore.timestamp.substring(0, 10)) : new Date();
});
const userLevel = computed((): UserLevel => {
	return userStore.userLevel;
});
const disabled = computed((): boolean => {
	return settingSectionStore.current_section && settingSectionStore.current_section !== 'userlevel' ? true : false;
});

const now = new Date();
const emitter: Ref<u<TSettingSection>> = ref(undefined);
const show_tooltip = ref(false);

const upgradeAccount = (): void => {
	emitter.value = !emitter.value ? 'userlevel': undefined;
	settingSectionStore.set_current_section(emitter.value);
};

</script>