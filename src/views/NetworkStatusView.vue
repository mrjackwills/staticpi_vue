
<template>
	<ThePage
		justify='center'
		:fillHeight='true'
	>
		<template v-slot:body>
			<AppCard
				:heading='pageTitle'
				md='12'
				sm='12'
				lg='12'
				xl='11'
				heading_class='my-3'
			>
				<template v-slot:body>

					<v-row justify='center' align='center' class='ma-0 pa-0' v-for='(item, index) of tableComponents' :key='index'>
						<v-col cols='12' class='ma-0 pa-0' :class='{"mb-12": index+1===tableComponents.length}'>
							<AppCard
								heading=''
								my=''
								xl='11'
								lg='11'
								sm='11'
							>
								<template v-slot:body >
									<v-row justify='center' align='center' class='ma-0 pa-0 mt-3'>

										<v-col cols='auto' class='ma-0 pa-0 mr-1'>
											<v-icon color='pi' :icon='item.icon' />
										</v-col>
										<v-col class='ma-0 pa-0'>
											<SubHeading
												:heading='item.heading'
												justify='start'
												class='unselectable'
											/>
										</v-col>
									</v-row>

									<v-row justify='center' class='mb-3 ma-0 pa-0'>
										<v-col cols='12' md='9' class='ma-0 pa-0'>
											<component :is='item.component' />
										</v-col>
									</v-row>

								</template>
							</AppCard>
						</v-col>
					</v-row>
				</template>
			</AppCard>
		</template>template>
		
	</ThePage>
</template>

<script setup lang='ts'>
import NetBandwidth from '@/components/NetworkStatus/NetBandwidth.vue';
import NetLog from '@/components/NetworkStatus/NetLog.vue';
import NetServerStats from '@/components/NetworkStatus/NetServerStats.vue';
import {
	mdiCalendarText,
	mdiServerNetwork,
	mdiSwapVerticalBold,
} from '@mdi/js';

const pageTitle = 'network status';
onMounted(() => {
	const browserStore = browserModule();
	browserStore.set_title(pageTitle);
	browserStore.set_description('staticPi networks status - current status of staticPi and associated service');
});

const tableComponents = [
	{
		icon: mdiServerNetwork,
		heading: 'servers',
		component: NetServerStats
	},
	{
		icon: mdiSwapVerticalBold,
		heading: 'message bandwidth',
		component: NetBandwidth
	},
	{
		icon: mdiCalendarText,
		heading: 'log',
		component: NetLog
	}
] as const;

</script>