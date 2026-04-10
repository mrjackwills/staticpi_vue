<template>
	<v-row class='align-center ma-0 pa-0 justify-center'>
		<v-col class='ma-0 pa-0' cols='12' md='6'>
			<v-text-field
				:key='textField.model'
				v-model='maxClients'
				:autocomplete='textField.autocomplete'
				color='primary'
				density='compact'
				:disabled='isFreeUser'
				:error-messages='errorMessage'
				:prepend-inner-icon='textField.icon'
				required
				:type='textField.type'
				variant='outlined'
				@click:append='passwordVisible = !passwordVisible'
				@update:model-value='textField_method'
			/>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { mdiLanConnect } from '@mdi/js'

const userStore = userModule()

const isFreeUser = computed(() => userStore.isFreeUser)
const upperLimit = computed(() => userStore.maxClients)
const defaultClients = computed(() => String(Math.ceil(upperLimit.value / 2)))

const errorMessage = ref('')
const maxClients = ref(1)
const passwordVisible = ref(false)

const textField = ref({
	autocomplete: 'one-time-code',
	icon: mdiLanConnect,
	label: 'max clients',
	model: 'maxClients' as const,
	type: 'text',
})

const emit = defineEmits(['input'])

function textField_method (): void {
	const num = Number(maxClients.value)
	if (!num || Number.isNaN(num) || num <= 0 || !Number.isInteger(num)) {
		errorMessage.value = 'Invalid number'
	} else if (num > upperLimit.value) {
		errorMessage.value = 'Too many clients'
	} else {
		errorMessage.value = ''
	}
	emit('input', Number(maxClients.value))
}

onMounted(() => {
	maxClients.value = Number(defaultClients.value)
})
</script>
