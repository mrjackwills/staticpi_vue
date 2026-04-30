<template>
	<v-dialog
		v-model='visible'
		eager
		:max-width='maxWidth'
		persistent
		scroll-strategy='none'
		width='100%'
	>
		<v-card v-intersect='onIntersect'>
			<v-progress-linear
				absolute
				:active='loading'
				color='primary'
				:indeterminate='loading'
				width='100%'
			/>

			<v-card-title class='pa-0 ma-0 px-4 py-2 text-pi' :class='titleSize'>{{ title }}</v-card-title>
			<v-card-text class='px-4 py-2' :class='messageSize'>{{ message }}</v-card-text>

			<section v-if='passwordRequired || twoFA_always_required'>
				<v-row class='align-center ma-0 pa-0 mt-2 justify-center'>
					<v-col class='ma-0 pa-0' cols='11' md='9'>
						<v-form
							autocomplete='off'
							@submit.prevent
						>
							<template v-if='passwordRequired'>
								<v-text-field
									v-for='item in textFields'
									:key='item.model'
									v-model='user[item.model]'
									:append-inner-icon='item.appendIcon'
									:autocomplete='item.autocomplete'
									class='mb-n3'
									color='primary'
									:density
									:disabled='loading'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									required
									:type='item.type'
									variant='outlined'
									@click:append-inner='passwordVisible = !passwordVisible'
									@focus='focusMethod(item.model)'
									@keydown.enter='click'
								/>
							</template>

							<template v-if='passwordRequired && twoFA_always_required'>
								<v-text-field
									v-for='item in tokenFields'
									:key='item.model'
									v-model='user[item.model]'
									color='primary'
									:density
									:error-messages='tokenError'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									required
									variant='outlined'
									@focus='focusMethod(item.model)'
									@keyup.enter='click'
								/>
							</template>
						</v-form>
					</v-col>
				</v-row>
			</section>

			<v-card-actions v-if='message' class='ma-0 pa-0 py-3'>
				<v-row class='align-center ma-0 pa-0 mt-2 justify-center'>
					<v-col class='ma-0 pa-0' cols='11' lg='6' md='9'>
						<v-row class='px-0 mx-0 justify-space-between'>
							<v-col class='px-0 mx-0' cols='12' md='auto' :order='smAndDown? "2" : "1"'>
								<div class='text-center'>
									<ActionButton
										:block='true'
										color='pi'
										:disabled='loading'
										:icon='mdiClose'
										:icon-first='true'
										:override-disabled='true'
										text='cancel'
										@click='cancel'
									/>
								</div>
							</v-col>

							<v-col class='px-0 mx-0' cols='12' md='auto' :order='smAndDown? "1" : "2"'>
								<div class='text-center'>
									<ActionButton
										:block='true'
										color='primary'
										:disabled
										:icon='timeout_icon'
										:monospace
										:override-disabled='logout'
										:text='timeout_text'
										@click='click'
									/>
								</div>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang='ts'>
import { mdiCellphoneInformation, mdiCheck, mdiClose, mdiEye, mdiEyeOff, mdiLock, mdiTimerOutline } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { token_regex } from '@/vanillaTS/globalConst'

const { lgAndUp, mdAndUp, smAndDown } = useDisplay()

const [dialogStore, twoFAStore] = [dialogModule(), twoFAModule()]
onBeforeUnmount(() => {
	clearTimeouts()
})

onMounted(() => {
	mountedTimeout()
})

const density = computed(() => smAndDown.value ? 'compact' : 'default')

const confirmMethod = computed(() => dialogStore.confirmMethod)

const confirmButton = computed(() => dialogStore.confirmButton ?? 'confirm')

const disabled = computed(() => loading.value
  || timeout.value
  || tokenError.value
  || (passwordRequired.value && !user.value.password)
  || (passwordRequired.value && twoFA_always_required.value && !user.value.token)
  || (twoFA_always_required.value && passwordRequired.value && tokenLength.value < 6)
	? true
	: false)
const icon = computed(() => dialogStore.icon)

const logout = computed(() => title.value.toLowerCase() === 'logout')
const maxWidth = computed(() => lgAndUp.value ? '40vw' : '80vw')
const message = computed(() => dialogStore.message)
const messageSize = computed(() => mdAndUp.value ? 'text-headline-medium' : 'text-body-large')
const monospace = computed(() => timeout.value > 0 ? true : false)
const passwordRequired = computed(() => dialogStore.passwordRequired)
const textFields = computed(() => [
	{
		appendIcon: passwordVisible.value ? mdiEyeOff : mdiEye,
		autocomplete: 'password',
		icon: mdiLock,
		label: 'user password',
		model: 'password' as const,
		type: passwordVisible.value ? 'text' : 'password',
	},
])

const timeout = computed({
	get (): number {
		return dialogStore.timeout
	},
	set (n: number): void {
		dialogStore.set_timeout(n)
	},
})

const timeout_text = computed(() => {
	if (timeout.value) return `${String(timeout.value).padStart(2, '0')}`
	if (passwordRequired.value && !user.value.password) {
		return 'password required'
	}
	if ((passwordRequired.value && twoFA_always_required.value && !user.value.token) || (passwordRequired.value && twoFA_always_required.value && tokenError.value)) {
		return 'token required'
	}
	return confirmButton.value
})

const timeout_icon = computed(() => {
	if (timeout.value) return mdiTimerOutline
	if ((passwordRequired.value && !user.value.password)) {
		return mdiLock
	}
	if ((passwordRequired.value && twoFA_always_required.value && !user.value.token) || (passwordRequired.value && twoFA_always_required.value && tokenError.value)) {
		return mdiCellphoneInformation
	}
	if (icon.value) {
		return icon.value
	}
	return mdiCheck
})

const title = computed(() => dialogStore.title ?? 'warning')
const titleSize = computed(() => mdAndUp.value ? 'text-headline-large' : 'text-headline-small')
const tokenLength = computed(() => user.value.token ? user.value.token.length : 0)
const twoFA_always_required = computed(() => twoFAStore.always_required || (dialogStore.twoFARequired && twoFAStore.active))

const visible = computed({
	get (): boolean {
		return dialogStore.visible
	},
	set (b: boolean): void {
		dialogStore.set_visible(b)
	},
})

const isIntersecting = ref(false)
const loading = ref(false)
const localDisabled = ref(false)
const passwordVisible = ref(false)
const timeoutInterval = ref(0)
const tokenError = ref('')
const tokenFields = [
	{
		clearable: true,
		icon: mdiCellphoneInformation,
		label: '2FA code',
		model: 'token' as const,
	},
]
const user = ref({
	password: '',
	token: undefined as string | undefined,
})

function cancel (): void {
	visible.value = false
}

function clearTimeouts (): void {
	clearInterval(timeoutInterval.value)
	localDisabled.value = false
	timeout.value = 0
}

async function click (): Promise<void> {
	if ((passwordRequired.value && !user.value.password) || timeout.value > 0 || disabled.value || !confirmMethod.value) return
	passwordVisible.value = false
	visible.value = false
	await confirmMethod.value({
		password: user.value.password,
		...user.value.token ? { token: user.value.token } : {},
	})
	dialogStore.$reset()
}

/**
 ** set the this.focus to the currently in focus text field
 ** If the in focus field ISN't the password field, then set passwordVisible to false
 * @param {String} model - current model/textfield name
 */
function focusMethod (model: string): void {
	if (model !== 'password') passwordVisible.value = false
}

/**
 ** When visible, set a timeout for the button, if params are met
 */
function mountedTimeout (): void {
	if (!isIntersecting.value) return
	if (!timeout.value) return
	timeoutInterval.value = window.setInterval(() => {
		timeout.value = timeout.value > 0 ? timeout.value -= 1 : timeout.value
		if (timeout.value < 1) clearInterval(timeoutInterval.value)
	}, 1000)
}

/**
 ** update isIntersecting when visible & not
 */
function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}

watch(isIntersecting, (i: boolean): void => {
	if (i) return mountedTimeout()
	user.value.password = ''
	user.value.token = undefined
	tokenError.value = ''
	clearTimeouts()
	dialogStore.$reset()
})

watch(() => user.value.token, i => {
	if (i) {
		if (token_regex.test(i.replace(/\s/g, ''))) {
			tokenError.value = ''
		} else {
			tokenError.value = 'invalid token'
			return
		}
	}
})
</script>
