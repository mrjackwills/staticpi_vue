<template>
	<ThePage :heading='pageTitle' :heading-justify='"start"' :page-ready>
		<template #body>
			<v-row class='align-center justify-center'>
				<v-col cols='12'>
					<v-row class='align-center justify-center'>
						<AdminMemory v-if='memory' :memory />

					</v-row>

					<v-row class='align-center justify-center'>
						<AdminConnectedCount v-if='connectedCount' :connected-count />
					</v-row>

					<v-row class='align-center justify-center'>
						<AdminInvites :invite-codes @update='update' />
					</v-row>

					<v-row class='align-center justify-center'>
						<AdminEmails v-if='emails' :emails @update='update' />
					</v-row>

					<v-row class='align-center justify-center'>
						<AdminLimits v-if='limits.length > 0' :limits @update='update' />
					</v-row>

					<v-row class='align-center justify-center'>
						<AdminUsers v-if='users.length > 0' :users @update='update' />
					</v-row>

					<v-row class='align-center justify-center'>
						<AdminContact v-if='emails' :contact-messages @update='update' />
					</v-row>

					<v-col class='ma-0 pa-0 my-4' cols='12'>
						<v-row class='align-center ma-0 pa-0  justify-center'>
							<v-col class='ma-0 pa-0' cols='12'>
								<ActionButton
									:block='true'
									color='primary'
									:icon='mdiRefresh '
									:icon-first='true'
									:override-disabled='true'
									text='update all data'
									@click='update'
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
import type { TAdminConnectedCount, TAdminContactMessage, TAdminEmailCount, TAdminInvite, TAdminLimit, TAdminMemory, TAdminUserAndSessions, u } from '@/types'
import { mdiRefresh } from '@mdi/js'
import { fetch_admin } from '@/services/fetch'

const pageTitle = 'admin'
const pageReady = ref(false)

const memory: Ref<u<TAdminMemory>> = ref(undefined)
const emails: Ref<u<TAdminEmailCount>> = ref(undefined)
const connectedCount: Ref<u<TAdminConnectedCount>> = ref(undefined)

const contactMessages: Ref<Array<TAdminContactMessage>> = ref([])
const limits: Ref<Array<TAdminLimit>> = ref([])
const inviteCodes: Ref<Array<TAdminInvite>> = ref([])
const users: Ref<Array<TAdminUserAndSessions>> = ref([])

async function update (): Promise<void> {
	loadingModule().set_loading(true);
	[
		memory.value,
		users.value,
		connectedCount.value,
		inviteCodes.value,
		emails.value,
		contactMessages.value,
	] = await Promise.all([
		fetch_admin.memory_get(),
		fetch_admin.all_users_get(),
		fetch_admin.connections_get(),
		fetch_admin.invite_get(),
		fetch_admin.email_log_get(),
		fetch_admin.contact_get(),
	])
	limits.value = await fetch_admin.limit_get()
	loadingModule().set_loading(false)
}

const update_interval = ref(0)

onBeforeUnmount(() => {
	clearInterval(update_interval.value)
})

onBeforeMount(async () => {
	loadingModule().set_loading(true)
	const browserStore = browserModule()
	browserStore.set_title(pageTitle)
	browserStore.set_description('staticPi admin')
	await update()
	loadingModule().set_loading(false)
	pageReady.value = true

	update_interval.value = setInterval(async () => {
		await update()
	}, 15_000)
})

</script>
