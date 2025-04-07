<template>
	<AppCard
		sm='12'
		md='12'
		lg='11'
		xl='11'
		heading='contact messages'
		heading_justify='start'
		heading_class='ml-2'
		heading_size='text-h6'
		my=''
	>
		<template v-slot:body>
			<v-row align='center' justify='center' class='no-gutters '>
				<v-col cols='12' class='my-1'>
					<v-row align='center' justify='space-around' class='no-gutters' >
						<v-col
							v-for='(item,index) in props.contact_messages'
							:key='index'
							cols='12'
							class='ma-1 pa-1'
						>
							<v-row align='center' justify='space-around' class='ma-0 pa-0'>
								<v-col cols='1' class='ma-0 pa-0'>
									<span class='text-pi'>
										<v-icon :icon='mdiAccountCircle' :color='item.registered_user_id?"primary":"pi"' size='small'/>
									</span>
								</v-col>

								<v-col cols='1' class='ma-0 pa-0'>
									<span class='small-text' :class='text_color(item.registered_user_id)'>
										{{ item.email }}
								
									</span>
								</v-col>

								<v-col cols='1' class='ma-0 pa-0'>
									<span class='small-text' :class='text_color(item.registered_user_id)'>
										{{ item.timestamp }}
								
									</span>
								</v-col>
								
								<v-col cols='8' class='ma-0 pa-0 small-text' style='max-width: 950px;' :class='text_color(item.registered_user_id)'>
									{{ item.message }}
								</v-col>
								
								<v-col cols='1' class='ma-0 pa-0 text-right'>
									<span class='text-pi cl'>
										<v-icon :icon='mdiCloseCircle' @click='delete_message(item.contact_message_id)'/>
									</span>
								</v-col>
							</v-row>
							<v-divider v-if='(index!== props.contact_messages.length -1)'/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import { axios_admin } from '@/services/axios';
import { mdiAccountCircle, mdiCloseCircle } from '@mdi/js';
import type { TAdminContactMessage } from '@/types';

const emit = defineEmits([ 'update' ]);

const text_color = (x: number | null): string => x ? 'text-primary' : 'text-pi';

const delete_message = async (contact_id: number): Promise<void> => {
	loadingModule().set_loading(true);
	await axios_admin.contact_delete(contact_id);
	loadingModule().set_loading(false);
	emit('update');
};

const props = defineProps<{ contact_messages: Array<TAdminContactMessage> }>();

</script>