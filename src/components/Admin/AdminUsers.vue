<template>
	<AppCard
		sm='12'
		md='12'
		lg='11'
		xl='11'
		heading='users'
		heading_justify='start'
		heading_class='ml-2'
		heading_size='text-h6'
		my=''
	>
		<template v-slot:body>
			<v-row align='center' justify='space-around' class='no-gutters ma-0 pa-0' >
				<v-col cols='12' class='ma-0 pa-0'>
					total bandwidth: {{ total_monthly_bandwidth }}
				</v-col>
				<v-col cols='12' class='ma-0 pa-0' >
					<v-row align='center' class='font-weight-bold ma-0 pa-0 no-gutters' justify='space-between'>

						<v-col :cols='item==="email"? "2":"1"' class='ma-0 pa-0 unselectable' v-for='(item, index) in headers' :key='index' :class='index===0?"text-left":"text-right"'>
							{{ item }}
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-divider />
			<v-row align='center' justify='center' class='ma-0 pa-0 mb-2' >
				<v-col
					v-for='(item,index) in users'
					:key='index'
					cols='12'
					class='ma-0 pa-0'
				>
					<AdminUserRowVue :user='item.user' :sessions='item.sessions' @update='emit("update")' />
					<v-divider class='' v-if='(index!== users.length -1)'/>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import AdminUserRowVue from './AdminUserRow.vue';
import AppCard from '@/components/Card/AppCard.vue';
import type { TAdminUserAndSessions } from '@/types';

const total_monthly_bandwidth = computed((): string => {
	let bw = 0;
	for (const i of props.users) {
		bw += Number(i.user.client_bytes_month_out) + Number(i.user.pi_bytes_month_out);
	}
	const total = convert_bytes(bw);
	return `${total.total} ${total.unit}`;
});

const headers = [
	'active',
	'id',
	'name',
	'email',
	'user_level',
	'bandwidth',
	'# devices',
	'two_factor',
	'password_reset',
	'# attempts',
	'# session'
];

const emit = defineEmits([ 'update' ]);

const props = defineProps({
	users: {
		type: Object as () => Array<TAdminUserAndSessions>,
		required: true
	}
});
</script>
