<template>
	<AppCard
		sm='12'
		md='12'
		lg='11'
		xl='11'
		heading='invites'
		heading_justify='start'
		heading_class='ml-2'
		heading_size='text-h6'
		my=''
	>
		<template v-slot:body>
			<v-row align='center' justify='center' class='no-gutters py-2' :class='text_class' >
				<v-col cols='12' >
					<v-row align='center' class='font-weight-bold' justify='space-between'>
						<v-col cols='6' class=''>
							<span class=''>
								invite code
							</span>
						</v-col>
						<v-col cols='6' class='text-right'>
							<span class=''>
								count
							</span>
						</v-col>
					</v-row>
					<v-divider />
					<v-row align='center' justify='center' class='no-gutters ma-0 pa-0' >
						<v-col
							v-for='(item,index) in inviteCodes'
							:key='index'
							cols='12'
							class=' ma-0 pa-0 my-1'
						>
							<v-row align='center' justify='space-between'>
								<v-col cols='6' class='text-primary'>
									<v-row align='center' justify='start'>
										<v-col cols='auto'>
											<CopyButton
												:hoverMessage='`copy invite`'
												:toCopy='`${item.invite}`'
												:tooltipMessage='"invite copied!"'
												color='secondary'
												:small='true'
											/>
										</v-col>
										<v-col cols='auto' class='unselectable'>
											{{ item.invite }}
										</v-col>
									</v-row>
								
								</v-col>
								<v-col cols='6' class='text-right'>
									{{ item.count }}
									<span class='ml-3'>
										<v-icon @click='remove_invite(item.invite)' color='pi' :icon='mdiCloseCircle' size='small' />
									</span>
								</v-col>
							</v-row>
							<v-divider class='' v-if='(index!== inviteCodes.length -1)'/>
						</v-col>
						<v-col cols='auto' v-if='inviteCodes.length === 0' class='text-pi'>
							No invite codes
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-divider />
			<v-row align='center' justify='space-around' class='my-3'>
				<v-col cols='12'>

					<v-form v-on:submit.prevent>
						<v-row align='center' justify='center'>

							<v-col cols='3' class='ma-0 pa-0 mr-3'  v-for='(item, index) in textFieldRows' :key='index'>
								<v-text-field
									v-model='model[item.model]'
									:error='item.invalid'
									:label='item.label'
									color='primary'
									density='compact'
									variant='outlined'
									clearable
									require
								/>
							</v-col>
							<v-col cols='auto' class='ma-0 pa-0 mt-n5'>
								<ActionButton
									@click='addInvite'
									:block='true'
									:disabled='disabled'
									:icon='mdiPlus '
									:small='true'
									color='primary'
									text='create'
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
import { axios_admin } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { integer, minLength, minValue, required } from '@vuelidate/validators';
import { mdiCloseCircle, mdiPlus } from '@mdi/js';
import { useDisplay } from 'vuetify';
import type { TAdminInvite, TAuthObject } from '@/types';
import useVuelidate from '@vuelidate/core';

const { mdAndDown } = useDisplay();

const text_class = computed(() => mdAndDown.value ? 'small-text' : '');

const model = ref({
	invite: '',
	count: undefined as undefined | number
});

const textFieldRows = computed(() => [
	{
		model: 'invite' as const,
		label: 'invite',
		invalid: v$.value.invite.$invalid && model.value.invite?.length > 0
	},
	{
		model: 'count' as const,
		label: 'count',
		invalid: v$.value.count.$invalid && !!model.value.count
	}
]);

const rules = {
	invite: {
		required,
		minLength: minLength(12)
	},
	count: {
		required,
		integer,
		minValue: minValue(1)
	}
};

const disabled = computed(() =>v$.value.$invalid);

const v$ = useVuelidate(rules, model);

const addInvite = (): void => {
	if (v$.value.$invalid) return;
	dialoger({
		message: `Authentication required to add new invite`,
		icon: mdiPlus,
		buttonText: 'add',
		title: 'Add invite',
		confirmMethod: addInvite_confirm,
		passwordrequired: true,
		twoFABackup: false,
		twoFARequired: false
	});
};

const remove_invite = async (invite: string): Promise<void>=> {
	loadingModule().loading = true;
	await axios_admin.invite_delete(invite);
	loadingModule().loading = false;
	emit('update');
};

const emit = defineEmits([ 'update' ]);

const addInvite_confirm = async (auth: TAuthObject): Promise<void> => {
	if (v$.value.$invalid) return;
	loadingModule().loading = true;
	await axios_admin.invite_post({
		...auth,
		count: Number(model.value.count),
		invite: model.value.invite 
	});
	loadingModule().loading = false;
	 
	model.value.count = undefined;
	 
	model.value.invite = '';
	emit('update');

};

defineProps<{ inviteCodes: Array<TAdminInvite> }>();

</script>