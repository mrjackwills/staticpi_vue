<template>
	<ThePage
		:fill-height='true'
		justify='center'
	>
		<template #body>
			<AppCard
				:heading='pageTitle'
				heading-class='my-3'
				lg='12'
				md='12'
				sm='12'
				xl='11'
			>
				<template #body>

					<v-row
						v-for='(item, index) of tableComponents'
						:key='index'
						class='ma-0 pa-0 align-center justify-center'
					>
						<v-col class='ma-0 pa-0 mb-3' cols='12'>
							<AppCard
								heading=''
								lg='11'
								my=''
								sm='11'
								xl='11'
							>
								<template #body>
									<v-row class='align-center ma-0 pa-0 mt-3 justify-center'>

										<v-col class='ma-0 pa-0 mr-1' cols='auto'>
											<v-icon color='pi' :icon='item.icon' />
										</v-col>

										<v-col class='ma-0 pa-0'>
											<SubHeading
												class='unselectable'
												:heading='item.heading'
												justify='start'
											/>
										</v-col>
									</v-row>

									<v-row class='mb-3 ma-0 pa-0 justify-center'>
										<v-col class='ma-0 pa-0' cols='12' md='9'>
											<component :is='item.component' />
										</v-col>
									</v-row>

								</template>
							</AppCard>
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>

	</ThePage>
</template>

<script setup lang='ts'>
import {
	mdiCalendarText,
	mdiServerNetwork,
	mdiSwapVerticalBold,
} from '@mdi/js'
import NetBandwidth from '@/components/NetworkStatus/NetBandwidth.vue'
import NetLog from '@/components/NetworkStatus/NetLog.vue'
import NetServerStats from '@/components/NetworkStatus/NetServerStats.vue'

const pageTitle = 'network status'
onMounted(() => {
	const browserStore = browserModule()
	browserStore.set_title(pageTitle)
	browserStore.set_description('staticPi networks status - current status of staticPi and associated service')
})

const tableComponents = [
	{
		icon: mdiServerNetwork,
		heading: 'servers',
		component: NetServerStats,
	},
	{
		icon: mdiSwapVerticalBold,
		heading: 'message bandwidth',
		component: NetBandwidth,
	},
	{
		icon: mdiCalendarText,
		heading: 'log',
		component: NetLog,
	},
] as const

</script>
