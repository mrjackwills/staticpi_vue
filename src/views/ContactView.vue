<template>
	<ThePage :fill-height='true' :justify='"center"'>
		<template #body>
			<AppCard :has-button='true' :heading='pageTitle' heading-class='my-3' :loading='localLoading'>
				<template #start>
					<v-row align='center' class='pa-0 ma-0 mb-3' justify='center'>
						<v-col class='ma-0 pa-0' cols='12'>
							<div class='text-center text-body-1'>
								We'll endeavour to respond to your message as soon as possible
							</div>
						</v-col>
					</v-row>
				</template>
				<template #body>

					<v-form @submit.prevent>
						<template v-for='(item, index) in textFieldRows' :key='index'>
							<v-text-field
								v-model='message_data[item.model]'
								:append-inner-icon='item.appendIcon'
								:autocomplete='item.autocomplete'
								:clearable='item.clearable'
								color='primary'
								:dense='smAndDown'
								:disabled='complete || localLoading || authenticated'
								:error-messages='errorMessages[item.model]'
								:label='item.label'
								:prepend-inner-icon='item.icon'
								required
								:type='item.type'
								validate-on-blur
								variant='outlined'
								@keydown.enter='submit'
								@update:model-value='v$[item.model]?.$touch()'
							/>

						</template>
						<template v-for='(item, index) in textAreaRows' :key='index'>
							<v-textarea
								v-model='message_data[item.model]'
								:append-inner-icon='item.appendIcon'
								:autocomplete='item.autocomplete'
								color='primary'
								counter='1024'
								:dense='smAndDown'
								:disabled='complete || localLoading'
								:error-messages='errorMessages[item.model]'
								:label='item.label'
								persistent-counter
								:prepend-inner-icon='item.icon'
								required
								:rows='item.rows'
								:type='item.type'
								validate-on-blur
								variant='outlined'
								@keydown.enter='submit'
								@update:model-value='v$[item.model]?.$touch()'
							/>

						</template>
					</v-form>
				</template>
				<template #button>
					<v-row align='center' class='ma-0 pa-0 mb-2' justify='space-around'>
						<v-col class='ma-0 pa-0' cols='6'>
							<BackButton />

						</v-col>
						<v-col class='ma-0 pa-0' cols='6'>

							<ActionButton
								:block='true'
								:disabled
								:icon='mdiEmailFastOutline'
								:text='complete ? "sent" : "send"'
								@click='submit'
							/>
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>

import { mdiEmail, mdiEmailFastOutline, mdiMessageTextOutline } from '@mdi/js'
import useVuelidate from '@vuelidate/core'
import { email, maxLength, minLength, required } from '@vuelidate/validators'
import { useDisplay } from 'vuetify'
import { axios_incognito } from '@/services/axios'
import { snackSuccess } from '@/services/snack'

const { smAndDown } = useDisplay()

onMounted(() => {
	browserModule().set_description(`staticPi contact page`)
	browserModule().set_title(pageTitle)
	if (authenticated.value) {
		message_data.value.email = userModule().email
	}
})

const authenticated = computed(() => userModule().authenticated)

const disabled = computed(() => v$.value.$invalid || complete.value || localLoading.value ? true : false)

const textFieldRows = computed(() => [
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiEmail,
		label: 'email address',
		model: 'email' as const,
		type: 'email',
	},
])

const textAreaRows = computed(() => [
	{
		appendIcon: '',
		autocomplete: '',
		clearable: true,
		icon: mdiMessageTextOutline,
		label: 'message',
		model: 'message' as const,
		type: 'text',
		rows: 10,
	},
])

const complete = ref(false)
const errorMessages = ref({
	email: '',
	message: '',
})

const localLoading = ref(false)
const pageTitle = 'contact us'

const message_data = ref({
	email: '',
	message: '',
})

async function submit (): Promise<void> {
	if (disabled.value) return
	message_data.value.message = message_data.value.message.trimEnd()
	await v$.value.$validate()
	if (v$.value.$error) return
	localLoading.value = true
	const response = await axios_incognito.contact_post(message_data.value)
	localLoading.value = false
	complete.value = true
	if (response) {
		snackSuccess({
			message: 'Your message has been sent',
			closable: false,
			type: 'success',
		})
	}
}

const rules = {
	email: {
		email,
		required,
	},
	message: {
		required,
		max: maxLength(1024),
		min: minLength(64),
	},
}

const v$ = useVuelidate(rules, message_data)

watch(() => message_data.value.email, () => {
	message_data.value.email = message_data.value.email ? message_data.value.email.toLowerCase().trim() : ''
	if (!v$.value?.email?.$invalid) {
		errorMessages.value.email = ''
		return
	}
	if (!v$.value.email.$dirty) return
	if (!v$.value.email.required) errorMessages.value.email = 'email required'
	errorMessages.value.email = 'email invalid'
})

watch(() => message_data.value.message, i => {
	if (!v$.value?.message?.$invalid) {
		errorMessages.value.message = ''
		return
	}

	if (!i) {
		errorMessages.value.message = ''
		return
	}
	if (!v$.value.message.$dirty) return
	if (v$.value.message.min) errorMessages.value.message = `message too short`
	else if (v$.value.message.max) errorMessages.value.message = `message too long`
	else if (!v$.value.message.required) errorMessages.value.message = 'message required'
})

</script>
