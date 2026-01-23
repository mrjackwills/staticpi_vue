<template>
	<section>
		<v-row align='center' class='pt-1' :justify no-gutters>
			<v-col class='pa-0 ma-0' cols='6'>
				<v-tooltip
					v-if='show_tooltip'
					activator='parent'
					content-class='tooltip'
					:disabled='!freeUser'
					location='top center'
				>
					<span>Free users are limited to 1 client</span>
				</v-tooltip>

				<v-text-field
					v-model='new_value'
					:append-inner-icon='freeUser ? `` : mdiPencilOutline'
					class='mb-n2'
					color='primary'
					density='compact'
					:disabled='isDisabled'
					:error-messages='errorMessage'
					:prepend-inner-icon='mdiLanConnect'
					single-line
					validate-on-blur
					@focus='changeInFocus'
					@keydown.enter='updateMaxClients'
				/>
			</v-col>
		</v-row>
		<v-expand-transition>
			<v-row
				v-if='inFocus'
				v-intersect='onIntersect'
				align='center'
				class='ma-0 pa-0 no-gutters'
				justify='center'
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
import type { VRow } from 'vuetify/components/VGrid'
import type { TAuthObject, TDeviceInfo, TDeviceTableFields } from '@/types'
import { mdiClose, mdiContentSave, mdiLanConnect, mdiPencilOutline } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_device } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { snackSuccess } from '@/services/snack'

const { mdAndUp } = useDisplay()

onBeforeMount(() => {
	new_value.value = current_value.value
})

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

const buttons = computed((): Array<TDeviceTableFields> => [
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
])

const current_value = computed(() => props.device.max_clients)
const disabled = computed(() => !new_value.value || error.value || loading.value || new_value.value === current_value.value || freeUser.value)
const freeUser = computed(() => userModule().isFreeUser)
const isDisabled = computed(() => freeUser.value || paused.value)
const justify = computed(() => mdAndUp.value ? 'center' : 'end')
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
const upperLimit = computed(() => userModule().maxClients)

const error = ref(false)
const errorMessage = ref('')
const inFocus = ref(false)
const isIntersecting = ref(false)
const new_value = ref(0)

function changeInFocus (): void {
	inFocus.value = true
}
function changeOutFocus (): void {
	inFocus.value = false
}
function clear (): void {
	new_value.value = current_value.value
	inFocus.value = false
}
function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}
const emit = defineEmits(['refresh'])
async function update_maxClients_confirm (authentication?: TAuthObject): Promise<void> {
	loading.value = true
	const response = await axios_device.maxClients_patch({
		maxClients: new_value.value,
		name: name_of_device.value,
		...authentication ? { authentication } : {},
	})
	loading.value = false
	if (response) snackSuccess({
		message: `${name_of_device.value}: max clients changed to ${new_value.value}`,
		icon: mdiContentSave,
	})
	emit('refresh')
	changeOutFocus()
	errorMessage.value = ''
}
function updateMaxClients (): void {
	if (disabled.value || error.value) return
	dialoger({
		message: `${new_value.value > current_value.value ? 'In' : 'De'}crease "${name_of_device.value}" max client connections to ${new_value.value}?`,
		buttonText: 'confirm',
		passwordrequired: false,
		title: 'Max Clients',
		timeout: 5,
		confirmMethod: update_maxClients_confirm,
		icon: '',
		twoFABackup: false,
		twoFARequired: false,
	})
}

const props = defineProps<{ device: TDeviceInfo }>()

watch(new_value, i => {
	if (!upperLimit.value) return
	const num = Number(i)
	if (!num || Number.isNaN(num) || num <= 0 || !Number.isInteger(num)) {
		error.value = true
		errorMessage.value = 'Invalid number'
		return
	} else if (num > upperLimit.value) {
		error.value = true
		errorMessage.value = `${upperLimit.value} upper limit`
		return
	} else {
		error.value = false
		if (num !== current_value.value) {
			errorMessage.value = 'max clients not saved'
			return
		}
		errorMessage.value = ''
	}
})
watch(paused, (i: boolean): void => {
	if (i) {
		new_value.value = current_value.value
		inFocus.value = false
		errorMessage.value = ''
	}
})
</script>
