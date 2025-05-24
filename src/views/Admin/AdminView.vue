<template>
	<ThePage :heading='pageTitle' :pageReady='pageReady' :heading-justify='"start"'>
		<template v-slot:body>
			<v-row align='center' justify='center'>
				<v-col cols='12'>
					<v-row align='center' justify='center' >
						<AdminMemory v-if='memory' :memory='memory'/>

					</v-row>

					<v-row align='center' justify='center' >
						<AdminConnectedCount v-if='connectedCount' :connectedCount='connectedCount'/>
					</v-row>

					<v-row align='center' justify='center' >
						<AdminInvites :inviteCodes='inviteCodes' @update='update'/>
					</v-row>

					<v-row align='center' justify='center' >
						<AdminEmails v-if='emails' :emails='emails' @update='update'/>
					</v-row>

					<v-row align='center' justify='center' >
						<AdminLimits v-if='limits.length > 0' :limits='limits' @update='update'/>
					</v-row>

					<v-row align='center' justify='center' >
						<AdminUsers v-if='users.length > 0' :users='users' @update='update'/>
					</v-row>

					<v-row align='center' justify='center' >
						<AdminContact v-if='emails' :contact_messages='contact_messages' @update='update'/>
					</v-row>

					<v-col cols='12' class='ma-0 pa-0 mt-4'>
						<v-row align='center' justify='center' class='ma-0 pa-0'>
							<v-col cols='12' class='ma-0 pa-0'>
								<ActionButton
									@click='update'
									:block='true'
									:icon='mdiRefresh '
									:iconFirst='true'
									:overrideDisabled='true'
									color='primary'
									text='update all data'
								/>
							</v-col>
						</v-row>
					</v-col>
				</v-col>
			</v-row>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { axios_admin } from '@/services/axios';
import { mdiRefresh } from '@mdi/js';
import type { TAdminMemory, TAdminLimit, TAdminConnectedCount, TAdminUserAndSessions, TAdminInvite, TAdminEmailCount, TAdminContactMessage, u } from '@/types';

const pageTitle = 'admin';
const pageReady = ref(false);

const memory: Ref<u<TAdminMemory>> = ref(undefined);
const emails: Ref<u<TAdminEmailCount>> = ref(undefined);
const connectedCount: Ref<u<TAdminConnectedCount>> = ref(undefined);

const contact_messages: Ref<Array<TAdminContactMessage>> = ref([]);
const limits: Ref<Array<TAdminLimit>> = ref([]);
const inviteCodes: Ref<Array<TAdminInvite>> = ref([]);
const users: Ref<Array<TAdminUserAndSessions>> = ref([]);

const update = async (): Promise<void> => {
	loadingModule().set_loading(true);
	[
		memory.value,
		users.value,
		connectedCount.value,
		inviteCodes.value,
		emails.value,
		contact_messages.value
	] = await Promise.all([
		axios_admin.memory_get(),
		axios_admin.all_users_get(),
		axios_admin.connections_get(),
		axios_admin.invite_get(),
		axios_admin.email_log_get(),
		axios_admin.contact_get()
	]);
	limits.value = await axios_admin.limit_get();
	loadingModule().set_loading(false);
};

const update_interval = ref(0);

onBeforeUnmount(() => {
	clearInterval(update_interval.value);
});

onBeforeMount(async () => {
	loadingModule().set_loading(true);
	const browserStore = browserModule();
	browserStore.set_title(pageTitle);
	browserStore.set_description('staticPi admin');
	await update();
	loadingModule().set_loading(false);
	pageReady.value = true;

	update_interval.value = setInterval(async () => {
		await update();
	}, 15_000);

});

</script>
