<template>
	<section>
		<v-row align='center' :justify='justify' no-gutters class='pt-1'  >
			<v-col cols='6' class='pa-0 ma-0' >
				<v-tooltip v-if='show_tooltip' :disabled='!freeUser' activator='parent' location='top center' content-class='tooltip'>
					<span >Free users are limited to 1 client</span>
				</v-tooltip>

				<v-text-field
					class='mb-n2'
					v-model='new_value'
					@focus='changeInFocus'
					@keydown.enter='updateMaxClients'
					:append-inner-icon='freeUser? `` : mdiPencilOutline'
					:disabled='isDisabled'
					:error-messages='errorMessage'
					:prepend-inner-icon='mdiLanConnect'
					color='primary'
					density='compact'
					single-line
					validate-on-blur
				/>
			</v-col>
		</v-row>
		<v-expand-transition>
			<v-row align='center' justify='center'  class='ma-0 pa-0 no-gutters' v-if='inFocus' v-intersect='onIntersect' >
				<v-col
					v-for='(item, index) in buttons'
					:key='index'
					cols='auto'
					class='ma-0 pa-0 pb-2 px-2'
				>
					<v-btn
						@click='item.click'
						:class='item.class'
						:disabled='item.disabled'
						class='fab-fix'
						size='x-small'
						variant='text'
						icon
					>
						<v-icon :color='item.color' :icon='item.icon' />
					</v-btn>
				</v-col>
			</v-row>
		</v-expand-transition>
	</section>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { mdiClose, mdiContentSave, mdiLanConnect, mdiPencilOutline } from '@mdi/js';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import type { TAuthObject, TDeviceTableFields, TDeviceInfo, TJustify } from '@/types';
const { mdAndUp } = useDisplay();

onBeforeMount(() => {
	new_value.value = current_value.value;

});

/// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed((): boolean => {
	return !(browserModule().android_ios && useDisplay().mobile.value);
});

const buttons = computed((): Array<TDeviceTableFields> => {
	return [
		{
			click: clear,
			color: 'pi',
			icon: mdiClose,
		},
		{
			class: disabled.value ? '' : 'heartbeat',
			click: updateMaxClients,
			color: 'primary',
			disabled: disabled.value,
			icon: mdiContentSave,
		},
	];
});

const current_value = computed((): number => {
	return props.device.max_clients;
});
const disabled = computed((): boolean => {
	return !new_value.value || error.value || loading.value || new_value.value === current_value.value || freeUser.value;
});
const freeUser = computed((): boolean => {
	return userModule().isFreeUser;
});
const isDisabled = computed((): boolean => {
	return freeUser.value || paused.value;
});
const justify = computed((): TJustify => {
	return mdAndUp.value ? 'center' : 'end';
});
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});
const name_of_device = computed((): string => {
	return props.device.name_of_device;
});
const paused = computed((): boolean => {
	return props.device.paused;
});
const upperLimit = computed((): number => {
	return userModule().maxClients;
});

const error = ref(false);
const errorMessage = ref('');
const inFocus = ref(false);
const isIntersecting = ref(false);
const new_value = ref(0);

const changeInFocus = (): void => {
	inFocus.value = true;
};
const changeOutFocus = (): void => {
	inFocus.value = false;
};
const clear = (): void => {
	new_value.value= current_value.value;
	inFocus.value = false;
};
const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};
const emit = defineEmits([ 'refresh' ]);
const update_maxClients_confirm = async (authentication?: TAuthObject): Promise<void> => {
	loading.value = true;
	const response = await axios_device.maxClients_patch({ maxClients: new_value.value, name: name_of_device.value, authentication });
	loading.value = false;
	if (response) snackSuccess({ message: `${name_of_device.value}: max clients changed to ${new_value.value}`, icon: mdiContentSave });
	emit('refresh');
	changeOutFocus();
	errorMessage.value = '';
};
const updateMaxClients = (): void => {
	if (disabled.value || error.value) return;
	dialoger({
		message: `${new_value.value > current_value.value ? 'In' : 'De' }crease "${name_of_device.value}" max client connections to ${new_value.value}?`,
		buttonText: 'confirm',
		passwordrequired: false,
		title: 'Max Clients',
		timeout: 5,
		confirmMethod: update_maxClients_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: false,
	});
};

const props = defineProps({

	device: {
		type: Object as () => TDeviceInfo,
		required: true
	}
});

watch(new_value, (i) => {
	if (!upperLimit.value) return;
	const num = Number(i);
	if (!num || isNaN(num) || num <= 0 || !Number.isInteger(num)) {
		error.value = true;
		errorMessage.value = 'Invalid number';
		return;
	}
	else if (num > upperLimit.value) {
		error.value = true;
		errorMessage.value = `${upperLimit.value} upper limit`;
		return;
	}
	else {
		error.value = false;
		if (num !== current_value.value) {
			errorMessage.value = 'max clients not saved';
			return;
		}
		errorMessage.value ='';
	}
});
watch(paused, (i: boolean): void => {
	if (i) {
		new_value.value = current_value.value;
		inFocus.value = false;
		errorMessage.value = '';
	}
});
</script>