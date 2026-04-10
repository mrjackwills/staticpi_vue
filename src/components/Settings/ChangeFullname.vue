<template>
	<SettingSection :disabled='componentDisabled'>
		<template #titleIcon>
			<v-icon class='mr-2' color='pi' :icon='mdiAccount' :size='smAndDown ? "small" : "default"' />
		</template>

		<template #title>
			Name
		</template>

		<template #text_description>
			Your personal information may change over time, and we would like to offer you the opportunity to update
			your current name, which is currently set as
			"<span class='font-weight-bold'>{{ current_name }}</span>".
			<br>
			If you would like to make any changes, please feel free to do so by submitting them here.
		</template>

		<template #action_button>
			<v-expand-transition>
				<v-row v-if='!showTextFields' class='align-center ma-0 pa-0 justify-center'>
					<v-col class='ma-0 pa-0' cols='12' md='auto'>
						<ActionButton
							:block='true'
							:icon='mdiCardAccountDetailsOutline'
							small
							text='change name'
							@click='showField'
						/>
					</v-col>
				</v-row>
			</v-expand-transition>
		</template>

		<template #body>
			<v-expand-transition>
				<section v-if='showTextFields'>
					<v-row class='align-center ma-0 pa-0 mt-3 justify-center'>
						<v-col class='ma-0 pa-0' cols='12' md='8'>
							<v-form @submit.prevent>
								<section v-for='(item, index) in textField' :key='index'>
									<v-text-field
										v-model='user[item.model]'
										:autocomplete='item.autocomplete'
										color='primary'
										:density='smAndDown ? "compact" : "default"'
										:disabled='loading'
										:error='errorMessages[item.model] ? true : false'
										:error-messages='errorMessages[item.model]'
										:label='item.label'
										:prepend-inner-icon='item.icon'
										required
										variant='outlined'
										@keydown.enter='submit'
										@update:model-value='v$[item.model]?.$touch()'
									/>
								</section>
							</v-form>
						</v-col>
					</v-row>
				</section>
			</v-expand-transition>
		</template>

		<template v-if='showTextFields' #cancel_button>
			<ActionButton
				:block='true'
				color='pi'
				:disabled='loading'
				:icon='mdiClose'
				:icon-first='true'
				:small='true'
				text='cancel'
				@click='cancel'
			/>
		</template>
		<template v-if='showTextFields' #save_button>
			<ActionButton
				:block='true'
				:disabled
				:icon='mdiSend'
				:small='true'
				text='change'
				@click='submit'
			/>
		</template>
	</SettingSection>
</template>

<script setup lang='ts'>
import { mdiAccount, mdiAccountOutline, mdiCardAccountDetailsOutline, mdiClose, mdiSend } from '@mdi/js'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useDisplay } from 'vuetify'
import { axios_authenticatedUser } from '@/services/axios'
import { snackSuccess } from '@/services/snack'

const { smAndDown } = useDisplay()

const settingSectionStore = settingSectionModule()

onBeforeUnmount(() => {
	showTextFields.value = false
})

onBeforeMount(() => {
	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'changefullname') {
		showTextFields.value = true
		settingSectionStore.set_beforemount_open(false)
	}
})

const disabled = computed(() => v$.value.$invalid
  || errorMessages.value.full_name
  || loading.value
	? true
	: false)

const componentDisabled = computed(() => settingSectionStore.current_section && settingSectionStore.current_section !== 'changefullname' ? true : false)

const current_name = computed(() => userModule().full_name)

const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

const errorMessages = ref({ full_name: '' })

const showTextFields = ref(false)
const textField = [
	{
		autocomplete: 'password',
		icon: mdiAccountOutline,
		label: 'full name',
		model: 'full_name' as const,
	},
]
const user = ref({ full_name: '' })

function cancel (): void {
	showTextFields.value = false
	errorMessages.value.full_name = ''
	user.value.full_name = ''
	v$.value.$reset()
	settingSectionStore.set_current_section(undefined)
}

function showField (): void {
	showTextFields.value = true
	settingSectionStore.set_current_section('changefullname')
}

async function submit (): Promise<void> {
	if (v$.value.$invalid || errorMessages.value.full_name || loading.value) return
	if (disabled.value) return
	loading.value = true
	const response = await axios_authenticatedUser.name_patch(user.value.full_name.trim())
	loading.value = false
	if (response) {
		snackSuccess({ message: 'name changed' })
		cancel()
	}
}

const rules = { full_name: { required } }
const v$ = useVuelidate(rules, user)
</script>
