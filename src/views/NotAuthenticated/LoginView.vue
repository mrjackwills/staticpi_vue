<template>
	<ThePage :fill-height='true' :justify='"center"'>
		<template #body>
			<AppCard :has-button='true' :heading='pageTitle' heading-class='my-3' :loading='localLoading'>
				<template #body>
					<v-form @submit.prevent>
						<v-expand-transition>
							<section v-if='!twoFATokenRequired'>
								<v-text-field
									v-for='(item, index) in textFields'
									:key='index'
									v-model='user[item.model]'
									::density='smAndDown?"compact":"default"'
									:append-inner-icon='item.appendIcon'
									:autocomplete='item.autocomplete'
									color='primary'
									:disabled='localLoading'
									:error-messages='errorMessages[item.model]'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									required
									:type='item.type'
									variant='outlined'
									@click:append-inner='appendClick()'
									@focus='focusMethod(item.model)'
									@keyup.enter='login'
								/>
							</section>
						</v-expand-transition>

						<v-expand-transition>
							<template v-if='twoFATokenRequired'>

								<!-- 2FA text input  -->
								<v-text-field
									v-for='(item, index) in tokenFields'
									:key='index'
									v-model='user[item.model]'
									::density='smAndDown?"compact":"default"'
									autocomplete='one-time-code'
									:autofocus='true'
									color='primary'
									:disabled='localLoading'
									:error-messages='errorMessages[item.model]'
									:label='item.label'
									:prepend-inner-icon='item.icon'
									required
									variant='outlined'
									@focus='focusMethod(item.model)'
									@keyup.enter='login'
								/>
							</template>
						</v-expand-transition>

					</v-form>

					<v-row class='align-center pa-0 ma-0 justify-center' wrap>
						<v-col class='pa-0 ma-0' cols='12' md='auto' :order='mdAndUp ? 1 : 2'>
							<v-row
								class='pa-0 ma-0 align-center justify-center'
								density='compact'
							>
								<v-col v-if='!twoFATokenRequired' class='ma-0 pa-0 mb-n6' cols='auto'>
									<v-checkbox
										v-model='user.remember'
										class='ma-0 pa-0 mt-n4'
										color='primary'
										:disabled='localLoading'
									>
										<template #label>
											<span class='ml-0'>remember me</span>
										</template>
									</v-checkbox>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</template>

				<template #button>
					<v-row class='align-center mb-3' :justify='twoFATokenRequired ? "space-around" : "center"'>
						<v-col v-if='twoFATokenRequired' cols='6'>
							<ActionButton
								:block='true'
								color='pi'
								:disabled='localLoading'
								:icon='mdiClose'
								:icon-first='true'
								text='cancel'
								@click='cancel'
							/>

						</v-col>

						<v-col cols='6'>
							<ActionButton
								:block='true'
								:disabled
								:icon='mdiSend'
								text='login'
								@click='login'
							/>

						</v-col>
					</v-row>

				</template>

				<template #end>

					<v-row v-if='!twoFATokenRequired' class='align-center my-2 ma-0 pa-0 justify-space-between'>
						<v-col class='ma-0 pa-0' cols='auto'>
							<router-link class='text-primary' :to='FrontEndRoutes.REGISTER'>create account</router-link>
						</v-col>

						<v-col class='ma-0 pa-0' cols='auto'>
							<router-link class='text-primary' :to='FrontEndRoutes.FORGOTPASSWORD'>forgotten
								password?</router-link>
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import type { TLoginFields, TLoginModel } from '@/types'
import { mdiCellphoneInformation, mdiClose, mdiEmail, mdiEye, mdiEyeOff, mdiLock, mdiSend } from '@mdi/js'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { RouterLink } from 'vue-router'
import { useDisplay } from 'vuetify'
import { fetch_authenticatedUser, fetch_incognito } from '@/services/fetch'
import { FrontEndRoutes } from '@/types/const_routes'
import { token_regex } from '@/vanillaTS/globalConst'

const { mdAndUp, smAndDown } = useDisplay()

onMounted(() => {
	browserModule().set_description(`staticPi login page - log in to staticPi`)
	browserModule().set_title(pageTitle)
})

onBeforeUnmount(() => {
	cancel()
})

const disabled = computed(() => localLoading.value || v$.value.$invalid || (twoFATokenRequired.value && !!errorMessages.value.token) || (twoFATokenRequired.value && !user.value.token))
const redirect = computed({
	get (): string {
		return browserModule().redirect
	},
	set (s: string): void {
		browserModule().set_redirect(s)
	},
})
const textFields = computed((): Array<TLoginFields> => [
	{
		appendIcon: '',
		autocomplete: '',
		icon: mdiEmail,
		label: 'email address',
		model: 'email' as const,
		type: 'email',
	},
	{
		appendIcon: user.value.password ? (passwordVisible.value ? mdiEyeOff : mdiEye) : '',
		autocomplete: 'password',
		icon: mdiLock,
		label: 'password',
		model: 'password' as const,
		type: passwordVisible.value ? 'text' : 'password',
	},
])

const authed = ref(false)
const errorMessages = ref({
	email: '',
	password: '',
	token: '',
})
const focus = ref('')
const localLoading = ref(false)
const pageTitle = 'login'
const passwordVisible = ref(false)
const tokenFields = [
	{
		clearable: true,
		icon: mdiCellphoneInformation,
		label: '2FA code',
		model: 'token' as const,
	},
]
const twoFATokenRequired = ref(false)
const twoFABackupEnabled = ref(false)
const user = ref({
	password: '',
	email: '',
	remember: false,
	token: '',
})

/**
 ** Set the password visible
 *
 */
function appendClick (): void {
	if (localLoading.value) return
	passwordVisible.value = !passwordVisible.value
}

/**
 ** set the this.focus to the currently in focus text field
 ** If the in focus field ISN't the password field, then set passwordVisible to false
 * @param {String} model - current model/textfield name
 */
function focusMethod (model: TLoginModel): void {
	focus.value = model
	if (model !== 'password') passwordVisible.value = false
}

function cancel (): void {
	user.value = {
		password: '',
		email: '',
		remember: false,
		token: '',
	}
	twoFATokenRequired.value = false
	twoFABackupEnabled.value = false
	passwordVisible.value = false
}

function clearErrorMessages (): void {
	errorMessages.value = {
		email: '',
		password: '',
		token: '',
	}
}

const router = useRouter()

async function login (): Promise<void> {
	if (v$.value.$invalid) return
	clearErrorMessages()
	localLoading.value = true
	passwordVisible.value = false
	const authObject = {
		email: user.value.email.toLowerCase(),
		password: user.value.password,
		remember: user.value.remember,
		// TODO test me
		...user.value.token ? { token: user.value.token.replace(/\s/g, '') } : {},
	}
	const loginRequest = await fetch_incognito.signin_post(authObject)
	localLoading.value = false

	if (loginRequest?.status === 200) {
		authed.value = true
		clearErrorMessages()
		userModule().set_email(user.value.email)
		userModule().set_authenticated(true)
		user.value.email = ''
		user.value.password = ''
		user.value.token = ''
		await fetch_authenticatedUser.user_get()
		snackbarModule().$reset()
		if (redirect.value) {
			router.push(redirect.value)
		} else {
			router.push(FrontEndRoutes.USER_DEVICES)
		}
		redirect.value = ''
	} else if (loginRequest?.status === 202) {
		snackbarModule().$reset()
		twoFATokenRequired.value = true
		twoFABackupEnabled.value = loginRequest.response.two_fa_backup
	} else if (twoFATokenRequired.value) {
		errorMessages.value.token = 'invalid token'
	} else {
		errorMessages.value.email = 'invalid email and/or password'
		errorMessages.value.password = 'invalid email and/or password'
	}
}

const rules = {
	email: {
		email,
		required,
	},
	password: { required },
}
const v$ = useVuelidate(rules, user)
watch(() => user.value.email, () => {
	user.value.email = user.value.email ? user.value.email.trim().toLowerCase() : ''
	errorMessages.value.email = v$.value.email.email ? '' : 'email invalid'
})

watch(() => user.value.token, i => {
	if (i) {
		if (token_regex.test(i.replace(/\s/g, ''))) {
			errorMessages.value.token = ''
		} else {
			errorMessages.value.token = 'invalid token'
			return
		}
	} else {
		errorMessages.value.token = ''
	}
})

</script>
