<template>
	<AppCard
		heading='memory'
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
					<v-row class='align-center justify-space-around' density='compact'>
						<v-col
							v-for='(item,index) in data'
							:key='index'
							class='ma-0 pa-0 my-1'
							cols='12'
							md='auto'
						>
							<v-row class='align-center ma-0 pa-0 justify-space-between'>
								<v-col class='ma-0 pa-0' cols='auto'>
									<span class='text-pi mr-2 text-body-small font-weight-bold'>
										{{ item.name }} :

									</span>
								</v-col>
								<v-col class='ma-0 pa-0 text-body-small' cols='auto'>
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
import type { TAdminMemory } from '@/types'
import { convert_bytes } from '@/vanillaTS/convert_bytes'
import { secondsToDays } from '@/vanillaTS/convert_seconds'

const data = computed(() => {
	const rss = convert_bytes(props.memory.rss)
	const virt = convert_bytes(props.memory.virt)
	return [
		{
			name: 'rss',
			data: `${rss.total}${rss.unit}`,
		},
		{
			name: 'virtual',
			data: `${virt.total}${virt.unit}`,
		},
		{
			name: 'server uptime',
			data: secondsToDays(props.memory.uptime * 1000),
		},
		{
			name: 'app uptime',
			data: secondsToDays(props.memory.uptime_app * 1000),
		},
	]
})

const props = defineProps<{ memory: TAdminMemory }>()
</script>
