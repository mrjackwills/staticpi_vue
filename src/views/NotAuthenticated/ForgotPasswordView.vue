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
				<template #start>
					<v-row class='align-center pa-0 ma-0 mb-3 justify-center'>
						<v-col class='ma-0 pa-0' cols='12'>
							<div
								class='text-center text-body-large'
							>
								enter your email address and we'll send you instructions on how to reset your password
							</div>
						</v-col>
					</v-row>
				</template>

				<template #body>
					<v-form @submit.prevent>
						<v-text-field
							v-model='user.email'
							clearable
							color='primary'
							:density='smAndDown?"compact":"default"'
							:disabled='localLoading || complete'
							:error-messages='emailError'
							label='email address'
							:prepend-inner-icon='mdiEmail'
							required
							type='email'
							variant='outlined'
							@keyup.enter='forgot'
						/>

					</v-form>
				</template>

				<template #button>
					<v-row class='align-center ma-0 pa-0 mb-2 justify-space-around'>
						<v-col class='ma-0 pa-0' cols='6'>
							<BackButton />
						</v-col>

						<v-col class='ma-0 pa-0' cols='6'>
							<ActionButton
								:block='true'
								:disabled
								:icon='mdiSend'
								text='send'
								@click='forgot'
							/>
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { mdiEmail, mdiSend } from '@mdi/js'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { useDisplay } from 'vuetify'
import { fetch_incognito } from '@/services/fetch'
import { snackSuccess } from '@/services/snack'

const { smAndDown } = useDisplay()

const disabled = computed(() => localLoading.value || v$.value.$invalid || complete.value ? true : false)

const pageTitle = 'forgotten password?'

const emailError = ref('')
const complete = ref(false)
const localLoading = ref(false)
const user = ref({ email: '' })

const rules = {
	email: {
		email,
		required,
	},
}
const v$ = useVuelidate(rules, user)

onMounted(() => {
	browserModule().set_title(pageTitle)
	browserModule().set_description(`staticPi forgotten password page - request a password reset links via email`)
})

/**
 ** ALWAYS sends a forgotten password fetch request, and snack success
 */
async function forgot (): Promise<void> {
	if (disabled.value) return
	localLoading.value = true
	await fetch_incognito.forgot_post(user.value.email)
	snackSuccess({ message: 'Instructions have been sent to the email address provided' })
	localLoading.value = false
	complete.value = true
}

watch(() => user.value.email, () => {
	user.value.email = user.value.email ? user.value.email.toLowerCase().trim() : ''
	if (!v$.value.email.$invalid) {
		emailError.value = ''
		return
	}
	if (!v$.value.email.$dirty) return
	if (!v$.value.email.required) emailError.value = 'email required'
	if (!v$.value.email.email) emailError.value = 'email invalid'
})
</script>
