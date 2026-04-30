<template>
	<AppCard
		heading='connections'
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
			<v-row class='py-2 align-center justify-center' density='compact'>
				<v-col class='' cols='11'>
					<v-row class='text-body-small align-center justify-space-around' density='compact'>
						<v-col
							v-for='(item,index) in data'
							:key='index'
							class='ma-0 pa-0 my-1'
							cols='12'
							md='auto'
						>
							<v-row class='align-center ma-0 pa-0 justify-space-evenly'>
								<v-col class='ma-0 pa-0' cols='auto'>
									<span class='text-pi mr-2 font-weight-bold'>
										{{ item.name }} :
									</span>
								</v-col>

								<v-col class='ma-0 pa-0' cols='auto'>
									<span class=''>
										{{ item.data }}
									</span>
								</v-col>
							</v-row>

							<v-divider v-if='(index!== data.length -1)' class='hidden-md-and-up' />
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import type { TAdminConnectedCount } from '@/types'

const data = computed(() => [
	{
		name: 'pi',
		data: props.connectedCount.pi,
	},
	{
		name: 'clients',
		data: props.connectedCount.client,
	},

	{
		name: 'total',
		data: props.connectedCount.client + props.connectedCount.pi,
	},
])

const props = defineProps<{ connectedCount: TAdminConnectedCount }>()

</script>
