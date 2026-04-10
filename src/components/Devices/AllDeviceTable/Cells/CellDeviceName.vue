<template>
	<section>
		<v-expand-transition>
			<v-row v-if='local_ttl > 0' class='align-center ma-0 pa-0 mb-n3 bg-pi justify-center'>
				<v-col class='px-3 error ma-0 pa-0 text-white font-weight-medium text-center text-body-small' cols='12'>
					rate-limited for {{ secondsToDays(local_ttl * 1000) }}
				</v-col>
			</v-row>
		</v-expand-transition>
		<v-row class='align-center pt-1' :class='justify' density='compact'>
			<v-col class='ma-0 pa-0' cols='12'>
				<v-text-field
					v-model='newName'
					:append-inner-icon='isFreeUser ? `` : mdiPencilOutline'
					class='mb-n2'
					color='primary'
					:counter='inFocus ? true : undefined'
					density='compact'
					:disabled='paused || isFreeUser'
					:error-messages='errorMessage'
					maxlength='64'
					:prepend-inner-icon='mdiDevices'
					single-line
					validate-on-blur
					@focus='changeInFocus'
					@keydown.enter='renameDevice'
				/>
				<v-tooltip
					v-if='show_tooltip && isFreeUser'
					activator='parent'
					content-class='tooltip'
					location='top center'
				>
					<span>Free users cannot customise device name</span>
				</v-tooltip>
			</v-col>
		</v-row>
		<v-expand-transition>
			<v-row
				v-if='inFocus && !paused'
				v-intersect='onIntersect'
				class='ma-0 pa-0 align-center justify-center'
			>
				<v-col v-for='(item, index) in buttons' :key='index' class='ma-0 pa-0 pb-2 px-2' cols='auto'>
					<v-btn
						class='fab-fix'
						:class='item.class'
						:disabled='item.disabled??false'
						icon
						size='x-small'
						variant='text'
						@click='item.click'
					>
						<v-icon :color='item.color' :icon='item.icon' />
					</v-btn>
				</v-col>
			</v-row>
		</v-expand-transition>
	</section>
</template>
<script setup lang='ts'>
import type { TAuthObject, TDeviceInfo, TDeviceTableFields } from '@/types'
import { mdiClose, mdiContentSave, mdiDevices, mdiPencilOutline } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_device } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'
import { secondsToDays } from '@/vanillaTS/convert_seconds'

const { mdAndUp, mobile } = useDisplay()

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && mobile.value))

const buttons = computed((): Array<TDeviceTableFields> => [
	{
		click: clear,
		color: 'pi',
		icon: mdiClose,
	},
	{
		class: disabled.value ? '' : 'heartbeat',
		click: renameDevice,
		color: 'primary',
		disabled: disabled.value,
		icon: mdiContentSave,
	},
])

const disabled = computed(() => !newName.value || errorMessage.value != 'new name not saved' || loading.value || newName.value === name_of_device.value)
const isFreeUser = computed(() => userModule().isFreeUser)
const justify = computed(() => mdAndUp.value ? 'justify-center' : 'justify-end')
const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})
const name_of_device = computed(() => props.device.name_of_device)
const paused = computed(() => props.device.paused)

const ttl = computed(() => deviceModule().get_ttl(name_of_device.value))

onBeforeMount(() => {
	newName.value = name_of_device.value
})

onMounted(() => {
	ttl_interval()
})

const errorMessage = ref('')
const inFocus = ref(false)
const isIntersecting = ref(false)
const newName = ref('')
const ttl_timeout = ref(0)
const local_ttl = ref(0)

function changeInFocus (): void {
	inFocus.value = true
}
function clear (): void {
	newName.value = name_of_device.value
	inFocus.value = false
}
function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}
const emit = defineEmits(['refresh'])
async function renameDevice_confirm (authentication?: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_device.rename_patch({
		new_name: newName.value,
		name: name_of_device.value,
		...authentication ? { authentication } : {},
	})
	loading.value = false
	if (response) {
		snackSuccess({
			message: `${name_of_device.value}: renamed "${newName.value}"`,
			icon: mdiContentSave,
		})
		emit('refresh')
		inFocus.value = false
		errorMessage.value = ''
	}
}
function renameDevice (): void {
	if (disabled.value) return
	dialoger({
		message: `Confirm you want to rename "${name_of_device.value}" to "${newName.value}"`,
		passwordrequired: false,
		timeout: 5,
		buttonText: 'confirm',
		title: 'Rename',
		confirmMethod: renameDevice_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: false,
	})
}

async function clear_ttl (): Promise<void> {
	clearInterval(ttl_timeout.value)
	local_ttl.value = 0
	await axios_device.deviceAll_get()
}

async function ttl_interval (): Promise<void> {
	if (ttl.value > 0) {
		local_ttl.value = ttl.value
		ttl_timeout.value = setInterval(() => {
			local_ttl.value -= 1
			if (local_ttl.value < 1) {
				clear_ttl()
			}
		}, 1000)
	}
}

const props = defineProps<{ device: TDeviceInfo }>()

watch(newName, async (i: string): Promise<void> => {
	if (i === name_of_device.value) {
		errorMessage.value = ''
		return
	}
	newName.value = newName.value.toLowerCase()
	const nameExists = deviceModule().name_exists(i)
	if (nameExists) {
		errorMessage.value = 'device name already in use'
		return
	}
	if (newName.value !== name_of_device.value) {
		errorMessage.value = 'new name not saved'
		return
	}
	errorMessage.value = ''
})

watch(paused, (i: boolean): void => {
	if (i) {
		inFocus.value = false
		errorMessage.value = ''
	}
})
watch(ttl, (i: number): void => {
	if (i > 0 && i > local_ttl.value) {
		local_ttl.value = i
		ttl_interval()
	}
})
</script>
