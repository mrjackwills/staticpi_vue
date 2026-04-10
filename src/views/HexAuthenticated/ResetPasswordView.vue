<template>
	<ThePage class='justify-center' :fill-height='true'>
		<template #body>
			<AppCard :has-button='true' :heading='pageTitle' heading-class='mb-3' :loading='localLoading'>
				<template #start>
					<v-row class='align-center ma-0 pa-0 mb-4 justify-center'>
						<v-col class='pa-0 ma-0 text-body-large' cols='12'>
							<PasswordDescription />
						</v-col>
					</v-row>
				</template>
				<template #body>
					<v-form @submit.prevent>
						<v-text-field
							v-for='(item, index) in textFields'
							:key='index'
							v-model='user[item.model]'
							:append-inner-icon='item.appendIcon'
							:autocomplete='item.autocomplete'
							:class='{ "mb-n6": passwordCompromised }'
							color='primary'
							:density='smAndDown ? "compact" : "default"'
							:disabled='localLoading'
							:error-messages='errorMessages[item.model]'
							:label='item.label'
							:prepend-inner-icon='item.icon'
							required
							:type='item.type'
							variant='outlined'
							@click:append-inner='appendClick'
							@keydown.enter='submit'
							@update:model-value='v$[item.model]?.$touch()'
						/>
						<v-expand-transition>
							<PasswordStrength
								v-if='!passwordCompromised && user.password'
								v-model:error-message='errorMessages.password'
								v-model:password-compromised='passwordCompromised'
								:password='user.password'
							/>
						</v-expand-transition>
						<v-expand-transition>
							<v-expand-transition>
								<HibpMessage v-if='passwordCompromised' mt=' ' />
							</v-expand-transition>
						</v-expand-transition>
						<section v-if='two_fa_enabled'>
							<v-text-field
								v-for='item in tokenFields'
								:key='item.model'
								v-model='user[item.model]'
								::density='smAndDown?"compact":"default"'
								color='primary'
								:disabled='localLoading'
								:error-messages='errorMessages[item.model]'
								:label='item.label'
								:prepend-inner-icon='item.icon'
								required
								variant='outlined'
								@keyup.enter='submit'
							/>
						</section>
					</v-form>
				</template>
				<template #button>
					<ActionButton
						:block='true'
						class='mb-2'
						:disabled
						:icon='mdiSend'
						text='reset'
						@click='submit'
					/>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import type { TResetFields } from '@/types'
import { mdiCellphoneInformation, mdiEye, mdiEyeOff, mdiLock, mdiSend } from '@mdi/js'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import { useDisplay } from 'vuetify'
import { axios_incognito } from '@/services/axios'
import { snackSuccess } from '@/services/snack'
import { FrontEndRoutes } from '@/types/const_routes'
import { minPassLength } from '@/vanillaTS/globalConst'
import { passwordCheck } from '@/vanillaTS/hibp'

const { smAndDown } = useDisplay()

onBeforeUnmount(() => {
	resetId.value = ''
})

onMounted(() => {
	browserModule().set_description(`staticPi reset password page - reset the password for your staticPi user account`)
	browserModule().set_title(pageTitle)
})

const disabled = computed(() => v$.value.$invalid || errorMessages.value.password || passwordCompromised.value || tokenDisabled.value || localLoading.value ? true : false)
const tokenDisabled = computed(() => two_fa_enabled.value ? two_fa_enabled.value && !user.value.token : false)
const resetId = computed({
	get (): string {
		return resetPasswordModule().id
	},
	set (i: string): void {
		resetPasswordModule().set_id(i)
	},
})
const textFields = computed((): Array<TResetFields> => [
	{
		autocomplete: 'new-password',
		icon: mdiLock,
		label: 'password',
		model: 'password' as const,
		type: passwordVisible.value ? 'text' : 'password',
		appendIcon: user.value.password ? (passwordVisible.value ? mdiEyeOff : mdiEye) : '',
	},
])
const two_fa_enabled = computed(() => resetPasswordModule().two_fa_enabled)

const pageTitle = 'reset password'

const errorMessages = ref({
	password: '',
	token: '',
})
const localLoading = ref(false)
const passwordCompromised = ref(false)
const passwordVisible = ref(false)
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
	token: undefined,
})

/**
 ** Set the password visible
 *
 */
function appendClick (): void {
	passwordVisible.value = !passwordVisible.value
}

/**
 ** Run hibp check, and set passwordCompromised if breach found
 * @param {String} model - current model/textfield name
 */
async function hibpCheck (): Promise<boolean | null> {
	if (!user.value.password || passwordCompromised.value || v$.value.password.$invalid) return null
	passwordCompromised.value = await passwordCheck(user.value.password)
	if (passwordCompromised.value) errorMessages.value.password = 'unsafe password'
	return passwordCompromised.value ? true : false
}

const router = useRouter()

async function submit (): Promise<void> {
	if (v$.value.$invalid || !resetId.value || tokenDisabled.value) return
	localLoading.value = true
	passwordVisible.value = false
	const compromisedPassword = await hibpCheck()
	if (compromisedPassword) {
		localLoading.value = false
		return
	}
	const response = await axios_incognito.reset_patch({
		resetId: resetId.value,
		password: user.value.password,
		token: user.value.token ?? undefined,
	})
	localLoading.value = false
	if (response) {
		router.push(FrontEndRoutes.BASE)
		snackSuccess({
			message: 'Password changed - please log in to continue',
			timeout: 20_000,
		})
	} else {
		if (two_fa_enabled.value) {
			const m = 'Invalid password or token'
			errorMessages.value.token = m
			errorMessages.value.password = m
		} else {
			errorMessages.value.password = 'Invalid password'
		}
	}
}

const rules = {
	password: {
		required,
		min: minLength(minPassLength),
	},
}
const v$ = useVuelidate(rules, user)

watch(passwordCompromised, (i: boolean): void => {
	if (i) errorMessages.value.password = ''
})
watch(() => user.value.token, (): void => {
	errorMessages.value.token = ''
})
watch(() => user.value.password, () => {
	passwordCompromised.value = false
	errorMessages.value.password = ''
	if (user.value.password) passwordVisible.value = false
	if (!v$.value.$invalid && !passwordCompromised.value) {
		errorMessages.value.password = ''
		return
	}
	if (!v$.value.$dirty) return
	if (!v$.value.$invalid) {
		errorMessages.value.password = 'invalid password'
		return
	}

	if (!v$.value.minLen) {
		errorMessages.value.password = `${minPassLength} characters minimum`
		return
	}
	if (!v$.value.required) {
		errorMessages.value.password = 'a password is required'
		return
	}
})
</script>
