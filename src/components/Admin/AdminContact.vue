<template>
	<AppCard
		heading='contact messages'
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
			<v-row class='align-center justify-center' density='compact'>
				<v-col class='my-1' cols='12'>
					<v-row class='align-center justify-space-around' density='compact'>
						<v-col
							v-for='(item,index) in props.contactMessages'
							:key='index'
							class='ma-1 pa-1'
							cols='12'
						>
							<v-row class='align-center ma-0 pa-0 justify-space-around'>
								<v-col class='ma-0 pa-0' cols='1'>
									<span class='text-pi'>
										<v-icon :color='item.registered_user_id?"primary":"pi"' :icon='mdiAccountCircle' size='small' />
									</span>
								</v-col>

								<v-col class='ma-0 pa-0' cols='1'>
									<span class='small-text' :class='text_color(item.registered_user_id)'>
										{{ item.email }}

									</span>
								</v-col>

								<v-col class='ma-0 pa-0' cols='1'>
									<span class='small-text' :class='text_color(item.registered_user_id)'>
										{{ item.timestamp }}

									</span>
								</v-col>

								<v-col class='ma-0 pa-0 small-text' :class='text_color(item.registered_user_id)' cols='8' style='max-width: 950px;'>
									{{ item.message }}
								</v-col>

								<v-col class='ma-0 pa-0 text-right' cols='1'>
									<span class='text-pi cl'>
										<v-icon :icon='mdiCloseCircle' @click='delete_message(item.contact_message_id)' />
									</span>
								</v-col>
							</v-row>

							<v-divider v-if='(index!== props.contactMessages.length -1)' />
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import type { TAdminContactMessage } from '@/types'
import { mdiAccountCircle, mdiCloseCircle } from '@mdi/js'
import { fetch_admin } from '@/services/fetch'

const emit = defineEmits(['update'])

const text_color = (x: number | null): string => x ? 'text-primary' : 'text-pi'

async function delete_message (contact_id: number): Promise<void> {
	loadingModule().set_loading(true)
	await fetch_admin.contact_delete(contact_id)
	loadingModule().set_loading(false)
	emit('update')
}

const props = defineProps<{ contactMessages: Array<TAdminContactMessage> }>()

</script>
