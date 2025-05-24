<template>
	<section>
		<v-expand-transition>
			<v-row align='center' justify='center' class='ma-0 pa-0 mb-n3 bg-pi' v-if='local_ttl > 0'>
				<v-col cols='12' class='px-3 error ma-0 pa-0 text-white font-weight-medium text-center text-caption'>
					rate-limited for {{ secondsToDays(local_ttl * 1000) }}
				</v-col>
			</v-row>
		</v-expand-transition>
		<v-row align='center' :justify='justify' no-gutters class='pt-1'>
			<v-col cols='12' class='ma-0 pa-0'>
				<v-text-field class='mb-n2' v-model='newName' @focus='changeInFocus' @keydown.enter='renameDevice'
					:append-inner-icon='isFreeUser ? `` : mdiPencilOutline' :counter='inFocus ? true : undefined'
					:disabled='paused || isFreeUser' :error-messages='errorMessage' :prepend-inner-icon='mdiDevices'
					maxlength='64' color='primary' density='compact' single-line validate-on-blur />
				<v-tooltip v-if='show_tooltip && isFreeUser' activator='parent' location='top center'
					content-class='tooltip'>
					<span>Free users cannot customise device name</span>
				</v-tooltip>
			</v-col>
		</v-row>
		<v-expand-transition>
			<v-row align='center' justify='center' class='ma-0 pa-0' v-if='inFocus && !paused'
				v-intersect='onIntersect'>
				<v-col v-for='(item, index) in buttons' :key='index' cols='auto' class='ma-0 pa-0 pb-2 px-2'>
					<v-btn @click='item.click' :class='item.class' :disabled='item.disabled' class='fab-fix'
						variant='text' size='x-small' icon>
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
import { mdiClose, mdiContentSave, mdiDevices, mdiPencilOutline } from '@mdi/js';
import { secondsToDays } from '@/vanillaTS/convert_seconds';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import type { TAuthObject, TDeviceTableFields, TDeviceInfo } from '@/types';

const { mdAndUp, mobile } = useDisplay();

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value));

const buttons = computed((): Array<TDeviceTableFields> => [
	{
		click: clear,
		color: 'pi',
		icon: mdiClose
	},
	{
		class: disabled.value ? '' : 'heartbeat',
		click: renameDevice,
		color: 'primary',
		disabled: disabled.value,
		icon: mdiContentSave
	}
]);

const disabled = computed(() => !newName.value || errorMessage.value != 'new name not saved' || loading.value || newName.value === name_of_device.value);
const isFreeUser = computed(() => userModule().isFreeUser);
const justify = computed(() => mdAndUp.value ? 'center' : 'end');
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});
const name_of_device = computed(() => props.device.name_of_device);
const paused = computed(() => props.device.paused);

const ttl = computed(() => deviceModule().get_ttl(name_of_device.value));

onBeforeMount(() => {
	newName.value = name_of_device.value;
});

onMounted(() => {
	ttl_interval();
});

const errorMessage = ref('');
const inFocus = ref(false);
const isIntersecting = ref(false);
const newName = ref('');
const ttl_timeout = ref(0);
const local_ttl = ref(0);

const changeInFocus = (): void => {
	inFocus.value = true;
};
const clear = (): void => {
	newName.value = name_of_device.value;
	inFocus.value = false;
};
const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};
const emit = defineEmits(['refresh']);
const renameDevice_confirm = async (authentication?: TAuthObject): Promise<void> => {
	loading.value = true;
	const response = await axios_device.rename_patch({
		new_name: newName.value,
		name: name_of_device.value,
		authentication
	});
	loading.value = false;
	if (response) {
		snackSuccess({
			message: `${name_of_device.value}: renamed "${newName.value}"`,
			icon: mdiContentSave
		});
		emit('refresh');
		inFocus.value = false;
		errorMessage.value = '';
	}
};
const renameDevice = (): void => {
	if (disabled.value) return;
	dialoger({
		message: `Confirm you want to rename "${name_of_device.value}" to "${newName.value}"`,
		passwordrequired: false,
		timeout: 5,
		buttonText: 'confirm',
		title: 'Rename',
		confirmMethod: renameDevice_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: false
	});
};

const clear_ttl = async (): Promise<void> => {
	clearInterval(ttl_timeout.value);
	local_ttl.value = 0;
	await axios_device.deviceAll_get();
};

const ttl_interval = async (): Promise<void> => {
	if (ttl.value > 0) {
		local_ttl.value = ttl.value;
		ttl_timeout.value = setInterval(() => {
			local_ttl.value -= 1;
			if (local_ttl.value < 1) {
				clear_ttl();
			}
		}, 1000);
	}
};

const props = defineProps<{ device: TDeviceInfo }>();

watch(newName, async (i: string): Promise<void> => {
	if (i === name_of_device.value) {
		errorMessage.value = '';
		return;
	}
	newName.value = newName.value.toLowerCase();
	const nameExists = deviceModule().name_exists(i);
	if (nameExists) {
		errorMessage.value = 'device name already in use';
		return;
	}
	if (newName.value !== name_of_device.value) {
		errorMessage.value = 'new name not saved';
		return;
	}
	errorMessage.value = '';
});

watch(paused, (i: boolean): void => {
	if (i) {
		inFocus.value = false;
		errorMessage.value = '';
	}
});
watch(ttl, (i: number): void => {
	if (i > 0 && i > local_ttl.value) {
		local_ttl.value = i;
		ttl_interval();
	}
});
</script>
