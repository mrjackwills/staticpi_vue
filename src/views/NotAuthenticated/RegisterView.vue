<template>
	<ThePage
		:fill-height='true'
		:justify='"center"'
	>
		<template #body>
			<AppCard
				:has-button='true'
				:heading='pageTitle'
				heading-class='my-3'
				:loading='localLoading'
			>
				<template #body>
					<v-alert
						class='mb-3'
						color='secondary'
						density='compact'
					>
						<v-row
							class='ma-0 pa-0 align-center justify-center'
							density='compact'
						>
							<v-col class='pa-0 ma-0 text-center' cols='auto'>
								<v-icon v-if='smAndUp' color='cardColor' :icon='mdiAlertCircleOutline' :size='smAndDown?"x-small":"small"' />
								<span class='text-cardColor'> accounts are currently by invitation only</span>
							</v-col>
						</v-row>
					</v-alert>
					<v-form @submit.prevent>
						<template v-for='(item, index) in textFieldRows' :key='index'>
							<v-text-field
								v-model='user[item.model]'
								::density='smAndDown?"compact":"default"'
								:append-inner-icon='item.appendIcon'
								:autocomplete='item.autocomplete'
								:clearable='item.clearable'
								color='primary'
								:disabled='complete|| localLoading'
								:error-messages='errorMessages[item.model]'
								:hide-details='item.label === "password" && passwordCompromised'
								:label='item.label'
								:prepend-inner-icon='item.icon'
								required
								:type='item.type'
								validate-on-blur
								variant='outlined'
								@blur='hibpCheck(item.model)'
								@click:append-inner='appendClick'
								@keydown.enter='register'
								@update:model-value='v$[item.model]?.$touch()'
							/>
							<section v-if='item.label === "password"' :key='`hibp_${index}`'>
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
										<HibpMessage
											v-if='passwordCompromised'
											mt='mt-1'
										/>
									</v-expand-transition>
								</v-expand-transition>
							</section>
						</template>
						<v-row class='align-center ma-0 pa-0 mt-n4 justify-center'>
							<v-col class='ma-0 pa-0 my-n4' cols='12'>
								<v-checkbox v-model='user.age' class='ma-0 pa-0' color='primary' label='I am aged 18 years or older' />
							</v-col>
							<v-spacer />
							<v-col class='ma-0 pa-0 mt-n10' cols='12'>
								<v-checkbox v-model='user.agree' class='ma-0 pa-0' color='primary'>
									<template #label>
										<v-row class='ma-0 pa-0'>
											<v-col class='ma-0 pa-0' cols='auto'>
												I agree to the
											</v-col>
											<v-col class='ma-0 pa-0' cols='auto'>
												<router-link class='ml-1 text-primary' target='_blank' :to='FrontEndRoutes.PRIVACY'>terms & conditions, and privacy policy</router-link>
											</v-col>
										</v-row>
									</template>
								</v-checkbox>
							</v-col>
						</v-row>
					</v-form>
				</template>
				<template #button>
					<v-row class='align-center ma-0 pa-0 mb-2 justify-space-around'>
						<v-col class='ma-0 pa-0' cols='6'>
							<BackButton />

						</v-col>
						<v-col class='ma-0 pa-0' cols='6'>

							<ActionButton
								v-if='!complete'
								:block='true'
								:disabled
								:icon='mdiAccountCheck'
								@click='register'
							/>
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>

import type { TRegisterModels, TRegisterTextField } from '@/types'
import { mdiAccountCheck, mdiAccountOutline, mdiAlertCircleOutline, mdiEmail, mdiEye, mdiEyeOff, mdiHelpCircleOutline, mdiLock } from '@mdi/js'
import useVuelidate from '@vuelidate/core'
import { email, minLength, required } from '@vuelidate/validators'
import { useDisplay } from 'vuetify'
import { axios_incognito } from '@/services/axios'
import { snackSuccess } from '@/services/snack'
import { FrontEndRoutes } from '@/types/const_routes'
import { minPassLength } from '@/vanillaTS/globalConst'
import { passwordCheck } from '@/vanillaTS/hibp'

const { smAndUp, smAndDown } = useDisplay()

onMounted(() => {
	browserModule().set_description(`staticPi register page - register for a new user account of staticPi.com`)
	browserModule().set_title(pageTitle)
})

const disabled = computed(() => v$.value.$invalid || passwordCompromised.value || errorMessages.value.password || complete.value || localLoading.value || !user.value.age || !user.value.agree
	? true
	: false)

const textFieldRows = computed((): Array<TRegisterTextField> => [
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiAccountOutline,
		label: 'full name',
		model: 'full_name' as const,
		type: 'text',
	},
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiEmail,
		label: 'email address',
		model: 'email' as const,
		type: 'email',
	},
	{
		appendIcon: user.value.password ? (passwordVisible.value ? mdiEyeOff : mdiEye) : '',
		autocomplete: 'password',
		clearable: false,
		icon: mdiLock,
		label: 'password',
		model: 'password' as const,
		type: passwordVisible.value ? 'text' : 'password',
	},
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiHelpCircleOutline,
		label: 'invite code',
		model: 'invite' as const,
		type: 'text',
	},
])

const complete = ref(false)
const errorMessages = ref({
	email: '',
	full_name: '',
	password: '',
	invite: '',
})

const localLoading = ref(false)
const pageTitle = 'register'
const passwordCompromised = ref(false)
const passwordVisible = ref(false)
const user = ref({
	email: '',
	invite: '',
	full_name: '',
	password: '',
	agree: false,
	age: false,
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
 ** Run hibp check, and set passwordCompromised if breach found
 * @param {String} model - current model/textfield name
 */
async function hibpCheck (model: TRegisterModels): Promise<void> {
	if (model !== 'password' || !user.value.password || passwordCompromised.value || v$?.value.password?.$invalid) return

	passwordCompromised.value = await passwordCheck(user.value.password)
	if (passwordCompromised.value) errorMessages.value.password = 'unsafe password'
}
async function register (): Promise<void> {
	if (disabled.value) return
	localLoading.value = true
	passwordVisible.value = false
	user.value.full_name.trim()
	const registerResponse = await axios_incognito.register_post(user.value)
	localLoading.value = false
	if (registerResponse) {
		complete.value = true
		snackSuccess({
			message: registerResponse,
			timeout: 20_000,
			closable: false,
			type: 'success',
		})
		v$.value.$reset()
	}
}

const rules = {
	email: {
		email,
		required,
	},
	full_name: { required },
	invite: { required },
	password: {
		required,
		min: minLength(minPassLength),
	},
}

const v$ = useVuelidate(rules, user)

watch(() => user.value.email, () => {
	user.value.email = user.value.email ? user.value.email.toLowerCase().trim() : ''
	if (!v$.value?.email?.$invalid) {
		errorMessages.value.email = ''
		return
	}
	if (!v$.value.email.$dirty) return
	if (!v$.value.email.required) errorMessages.value.email = 'email required'
	errorMessages.value.email = 'email invalid'
})

watch(() => user.value.full_name, () => {
	if (!v$.value?.full_name?.$invalid) {
		errorMessages.value.full_name = ''
		return
	}
	if (!v$.value.full_name.$dirty) return
	if (!v$.value.full_name.required) errorMessages.value.full_name = 'name required'
})

watch(() => user.value.invite, () => {
	user.value.invite = user.value.invite ? user.value.invite.trim() : ''
	if (!v$.value?.invite?.$invalid) {
		errorMessages.value.invite = ''
		return
	}
	if (!v$.value.invite.$dirty) return
	if (!v$.value.invite.required) errorMessages.value.invite = 'invite required'
})

watch(() => user.value.password, () => {
	passwordCompromised.value = false
	errorMessages.value.password = ''
	if (!user.value.password) passwordVisible.value = false
	if (user.value.email && user.value.password?.toLowerCase().includes(user.value.email.toLowerCase().trim())) {
		errorMessages.value.password = 'password cannot contain email'
		return
	}
	if (user.value.email && user.value.password?.toLowerCase().includes(user.value.email.toLowerCase().trim())) {
		errorMessages.value.password = 'password cannot contain email'
		return
	}
	if (!v$.value?.password?.$invalid && !passwordCompromised.value) {
		errorMessages.value.password = ''
		return
	}
	if (!v$.value?.password?.$dirty) return
	if (!v$.value?.password?.required) {
		errorMessages.value.password = 'a password is required'
		return
	}
	if (!v$.value.password.minLen) {
		errorMessages.value.password = `${minPassLength} characters minimum`
		return
	}
})

</script>
