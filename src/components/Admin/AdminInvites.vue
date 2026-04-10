<template>
	<AppCard
		heading='invites'
		heading-class='ml-2'
		heading-justify='start'
		heading-size='text-headline-small'
		lg='11'
		md='12'
		my=''
		sm='12'
		xl='11'
	>
		<template #body>
			<v-row class='py-2 align-center justify-center' :class='text_class' density='compact'>
				<v-col cols='12'>
					<v-row class='align-center font-weight-bold text-body-small justify-space-between'>
						<v-col class='' cols='6'>
							<span class=''>
								invite code
							</span>
						</v-col>
						<v-col class='text-right' cols='6'>
							<span class=''>
								count
							</span>
						</v-col>
					</v-row>
					<v-divider />
					<v-row class='ma-0 pa-0 align-center justify-center' density='compact'>
						<v-col
							v-for='(item,index) in inviteCodes'
							:key='index'
							class=' ma-0 pa-0 my-1'
							cols='12'
						>
							<v-row class='align-center justify-space-between'>
								<v-col class='text-primary' cols='6'>
									<v-row class='align-center justify-start'>
										<v-col cols='auto'>
											<CopyButton
												color='secondary'
												:hover-message='`copy invite`'
												:small='true'
												:to-copy='`${item.invite}`'
												:tooltip-message='"invite copied!"'
											/>
										</v-col>
										<v-col class='unselectable' cols='auto'>
											{{ item.invite }}
										</v-col>
									</v-row>

								</v-col>
								<v-col class='text-right' cols='6'>
									{{ item.count }}
									<span class='ml-3'>
										<v-icon color='pi' :icon='mdiCloseCircle' size='small' @click='remove_invite(item.invite)' />
									</span>
								</v-col>
							</v-row>
							<v-divider v-if='(index!== inviteCodes.length -1)' class='' />
						</v-col>
						<v-col v-if='inviteCodes.length === 0' class='text-pi text-body-small font-weight-bold' cols='auto'>
							No invite codes
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-divider />
			<v-row class='align-center my-3 justify-space-around'>
				<v-col cols='12'>

					<v-form @submit.prevent>
						<v-row class='align-center justify-center'>

							<v-col v-for='(item, index) in textFieldRows' :key='index' class='ma-0 pa-0 mr-3' cols='3'>
								<v-text-field
									v-model='model[item.model]'
									clearable
									color='primary'
									density='compact'
									:error='item.invalid'
									:label='item.label'
									require
									variant='outlined'
								/>
							</v-col>
							<v-col class='ma-0 pa-0 mt-n5' cols='auto'>
								<ActionButton
									:block='true'
									color='primary'
									:disabled
									:icon='mdiPlus '
									:small='true'
									text='create'
									@click='addInvite'
								/>
							</v-col>
						</v-row>
					</v-form>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import type { TAdminInvite, TAuthObject } from '@/types'
import { mdiCloseCircle, mdiPlus } from '@mdi/js'
import useVuelidate from '@vuelidate/core'
import { integer, minLength, minValue, required } from '@vuelidate/validators'
import { useDisplay } from 'vuetify'
import { axios_admin } from '@/services/axios'
import { dialoger } from '@/services/dialog'

const { mdAndDown } = useDisplay()

const text_class = computed(() => mdAndDown.value ? 'small-text' : '')

const model = ref({
	invite: '',
	count: undefined as undefined | number,
})

const textFieldRows = computed(() => [
	{
		model: 'invite' as const,
		label: 'invite',
		invalid: v$.value.invite.$invalid && model.value.invite?.length > 0,
	},
	{
		model: 'count' as const,
		label: 'count',
		invalid: v$.value.count.$invalid && !!model.value.count,
	},
])

const rules = {
	invite: {
		required,
		minLength: minLength(12),
	},
	count: {
		required,
		integer,
		minValue: minValue(1),
	},
}

const disabled = computed(() => v$.value.$invalid)

const v$ = useVuelidate(rules, model)

function addInvite (): void {
	if (v$.value.$invalid) return
	dialoger({
		message: `Authentication required to add new invite`,
		icon: mdiPlus,
		buttonText: 'add',
		title: 'Add invite',
		confirmMethod: addInvite_confirm,
		passwordrequired: true,
		twoFABackup: false,
		twoFARequired: false,
	})
}

async function remove_invite (invite: string): Promise<void> {
	loadingModule().loading = true
	await axios_admin.invite_delete(invite)
	loadingModule().loading = false
	emit('update')
}

const emit = defineEmits(['update'])

async function addInvite_confirm (auth: TAuthObject): Promise<void> {
	if (v$.value.$invalid) return
	loadingModule().loading = true
	await axios_admin.invite_post({
		...auth,
		count: Number(model.value.count),
		invite: model.value.invite,
	})
	loadingModule().loading = false
	model.value.count = undefined
	model.value.invite = ''
	emit('update')
}

defineProps<{ inviteCodes: Array<TAdminInvite> }>()

</script>
