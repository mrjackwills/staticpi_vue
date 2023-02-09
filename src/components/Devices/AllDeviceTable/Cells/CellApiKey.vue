<template>
	<v-row align='center' :justify='justify' class='no-gutters pa-0 ma-0' >
		<v-col cols='auto' class='ma-0 pa-0' :class='mdAndUp? "mr-2" : "mr-4"'>
			<CopyButton
				:name_of_device='name_of_device'
				:disabled='paused'
				color='primary'
				hoverMessage='click to copy API key'
				tooltipMessage='API key copied!'
				:toCopy='device.api_key'
				small
				density='comfortable'
			/>
		</v-col>
		<v-col cols='auto' class='ma-0 pa-0'>
			
			<template v-if='tooltipAvailable'>
				<v-btn
					@click='regenerateApiKey'
					:disabled='paused'
					class='fab-fix'
					size='small'
					icon
					variant='text'
					density='comfortable'
				>
					<v-icon color='pi' :icon='mdiAutorenew' />
					<v-tooltip activator='parent' location='top center' class='tooltip-z'>
						<span>regenerate api key</span>
					</v-tooltip>
				</v-btn>
			</template>
			<v-btn
				v-else
				@click='regenerateApiKey'
				@mouseover='tooltipAvailable=true'
				:disabled='paused'
				class='fab-fix'
				size='x-small'
				fab
				text
			>
				<v-icon color='pi' :icon='mdiAutorenew' />
			</v-btn>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiAutorenew, } from '@mdi/js';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import CopyButton from '@/components/Buttons/CopyButton.vue';
import type { TAuthObject, TDeviceInfo, TJustify } from '@/types';

const { mdAndUp } = useDisplay();

const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});
		
const justify = computed((): TJustify =>{
	return mdAndUp.value ? 'center' : 'end';
},);

const name_of_device = computed((): string =>{
	return props.device.name_of_device;
},);
const paused = computed((): boolean =>{
	return props.device.paused;
});
	
const showTooltip = ref(false);
const tooltipAvailable = ref(true);

const regenerateApiKey = (): void => {
	showTooltip.value = false;
	tooltipAvailable.value = false;
	dialoger({
		message: `Regenerating the API key for "${name_of_device.value}" will force disconnect the pi and any connected clients`,
		icon: mdiAutorenew,
		buttonText: 'regenerate',
		title: 'Regenerate API Key',
		confirmMethod: regenerateApiKey_confirm,
		passwordrequired: true,
		twoFABackup: false,
		twoFARequired: false,
	});
};

const emit = defineEmits([ 'refresh' ]);
const regenerateApiKey_confirm = async (authentication: TAuthObject): Promise<void> => {
	loading.value = true;
	const response = await axios_device.apiKey_patch({ authentication, name: name_of_device.value });
	loading.value = false;
	if (response) {
		snackSuccess({ message: `"${name_of_device.value}" API key regenerated`, icon: mdiAutorenew });
		emit('refresh');
	}
};
	
const props = defineProps({
		
	device: {
		type: Object as () => TDeviceInfo,
		required: true
	}
});
</script>