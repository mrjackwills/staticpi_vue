<template>
	<SettingSection :disabled='componentDisabled'>
		<template  v-slot:titleIcon>
			<v-icon color='pi' class='mr-2' :size='smAndDown?"small":"default"' :icon='mdiAccount' />
		</template>

		<template v-slot:title>
			Name
		</template>

		<template v-slot:text_description>
			Your personal information may change over time, and we would like to offer you the opportunity to update your current name, which is currently set as "<span class='font-weight-bold'>{{ current_name }}</span>".
			<br>
			If you would like to make any changes, please feel free to do so by submitting them here.
		</template>

		<template v-slot:action_button>
			<v-expand-transition>
				<v-row
					v-if='!showTextFields'
					align='center'
					justify='center'
					class='ma-0 pa-0'
				>
					<v-col cols='12' md='auto' class='ma-0 pa-0'>
						<ActionButton
							@click='showField'
							:block='true'
							:icon='mdiCardAccountDetailsOutline '
							small
							text='change name'
						/>
					</v-col>
				</v-row>
			</v-expand-transition>
		</template>
		
		<template v-slot:body>
			<v-expand-transition>
				<section v-if='showTextFields'>
					<v-row class='ma-0 pa-0 mt-3' align='center' justify='center'>
						<v-col cols='12' md='8' class='ma-0 pa-0'>
							<v-form v-on:submit.prevent>
								<section v-for='(item,index) in textField' :key='index'>
									<!-- @click:append='appendClick(item.model)' -->
									<!-- :append-icon='item.appendIcon' -->
									<!-- @update:model-value='@update:model-value='v$[item.model]?.$touch()'valueTouch(item.model, $event)' -->
									<v-text-field
										v-model='user[item.model]'
										@update:model-value='v$[item.model]?.$touch()'
										@keydown.enter='submit'
										:autocomplete='item.autocomplete'
										:density='smAndDown?"compact":"default"'
										:disabled='loading'
										:error-messages='errorMessages[item.model]'
										:error='errorMessages[item.model]? true : false'
										:label='item.label'
										:prepend-inner-icon='item.icon'
										color='primary'
										variant='outlined'
										required
									/>
								</section>
							</v-form>
						</v-col>
					</v-row>
				</section>
			</v-expand-transition>
		</template>

		<template v-slot:cancel_button v-if='showTextFields' >
			<ActionButton
				@click='cancel'
				:id='componentId'
				v-model:disabled='loading'
				:icon='mdiClose'
				:iconFirst='true'
				:small='true'
				:block='true'
				color='pi'
				text='cancel'
			/>
		</template>
		<template v-slot:save_button v-if='showTextFields'>
			<ActionButton
				@click='submit'
				v-model:disabled='disabled'
				:icon='mdiSend'
				:block='true'
				:small='true'
				text='change'
			/>
		</template>
	</SettingSection>
</template>

<script setup lang='ts'>
import { axios_authenticatedUser } from '@/services/axios';
import { mdiAccount, mdiAccountOutline, mdiCardAccountDetailsOutline, mdiClose, mdiSend, } from '@mdi/js';
import { required } from '@vuelidate/validators';
import { snackSuccess } from '@/services/snack';
import { useDisplay } from 'vuetify';
import { useVuelidate } from '@vuelidate/core';

const { smAndDown } = useDisplay();

const settingSectionStore = settingSectionModule();

onBeforeUnmount(() => {
	showTextFields.value = false;
});

onBeforeMount(() => {

	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'changefullname') {
		showTextFields.value = true;
		settingSectionStore.set_beforemount_open(false);
	}
});

const disabled = computed((): boolean => {
	return v$.value.$invalid
		|| errorMessages.value.full_name
		|| loading.value ? true : false;
});

const componentDisabled = computed((): boolean => {
	return settingSectionStore.current_section && settingSectionStore.current_section !== 'changefullname' ? true : false;
});

const current_name = computed(() :string => {
	return userModule().full_name;
});
	
const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const componentId = 'changefullname-setting-section';
const errorMessages = ref({
	full_name: '',
});

const showTextFields = ref(false);
const textField = [ {
	autocomplete: 'password',
	icon: mdiAccountOutline,
	label: 'full name',
	model: 'full_name' as const,
} ];
const user = ref({
	full_name: '',
});

const cancel = (): void => {
	showTextFields.value = false;
	errorMessages.value.full_name = '';
	user.value.full_name = '';
	v$.value.$reset();
	settingSectionStore.set_current_section(undefined);
};

const showField = (): void => {
	showTextFields.value = true;
	settingSectionStore.set_current_section('changefullname');
};
		
const submit = async (): Promise<void> => {
	if (v$.value.$invalid || errorMessages.value.full_name || loading.value) return;
	if (disabled.value) return;
	loading.value = true;
	const response = await axios_authenticatedUser.name_patch(user.value.full_name.trim());
	// eslint-disable-next-line require-atomic-updates
	loading.value = false;
	if (response) {
		snackSuccess({ message: 'name changed' });
		cancel();
	}
};

watch(showTextFields, (i) => {
	if (i) {
		setTimeout(() => {
			document.getElementById(componentId)?.scrollIntoView({
				behavior: 'smooth'
			});
			
		}, 210);
	}
});

const rules = {
	full_name: { required },
};
const v$ = useVuelidate(rules, user);
</script>