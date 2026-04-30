<template>
	<AppCard
		heading='users'
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
			<v-row class='ma-0 pa-0 align-center justify-space-around' density='compact'>
				<v-col class='ma-0 pa-0' cols='12'>
					total bandwidth: <span class='font-weight-bold'>{{ total_monthly_bandwidth }}</span>
				</v-col>

				<v-col class='ma-0 pa-0' cols='12'>
					<v-row class='align-center font-weight-bold ma-0 pa-0 justify-space-between' density='compact'>

						<v-col
							v-for='(item, index) in headers'
							:key='index'
							class='ma-0 pa-0 font-weight-bold unselectable text-body-small'
							:class='index===0?"text-left":"text-right"'
							:cols='item==="email"? "2":"1"'
						>
							{{ item }}
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-divider />

			<v-row class='align-center ma-0 pa-0 mb-2 justify-center'>
				<v-col
					v-for='(item,index) in users'
					:key='index'
					class='ma-0 pa-0'
					cols='12'
				>
					<AdminUserRow :sessions='item.sessions' :user='item.user' @update='emit("update")' />
					<v-divider v-if='(index!== users.length -1)' class='' />
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import type { TAdminUserAndSessions } from '@/types'
import { convert_bytes } from '@/vanillaTS/convert_bytes'

const total_monthly_bandwidth = computed((): string => {
	let bw = 0
	for (const i of props.users) {
		bw += Number(i.user.client_bytes_month_out) + Number(i.user.pi_bytes_month_out)
	}
	const total = convert_bytes(bw)
	return `${total.total} ${total.unit}`
})

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
	'# session',
]

const emit = defineEmits(['update'])
const props = defineProps<{ users: Array<TAdminUserAndSessions> }>()

</script>
