<template>
	<ThePage
		:justify='"center"'
		:fillHeight='true'
	>
		<template v-slot:body>
			<AppCard
				:heading='pageTitle'
				heading_class='mt-3'
				xl='11'
				lg='11'
				md='11'
				sm='11'
			>
				<template v-slot:body>
					<!-- DESKTOP VIEW -->
					<section v-if='mdAndUp'>
						<v-row class='ma-0 pa-0' align='center' justify='center'>
							<v-col cols='12' class='ma-0 pa-0'>
								<v-row class='ma-0 pa-0 no-gutters'>
									<v-col cols='3' md='2' class='ma-0 pa-0'>
									</v-col>
									<v-col cols='9' md='10' class='ma-0 pa-0'>
										<v-row class='ma-0 pa-0' justify='start'>
											<v-col
												v-for='(item, index) in [`free`, `pro`]'
												:key='index'
												cols=''
											>
												<v-row justify='space-around' align='center' class='pa-0' dense>
													<v-col cols='auto' class='pa-0 ma-0'>
														<div class='text-center text-pi font-weight-bold' :class='headingSize'>{{ item }}</div>
													</v-col>
												</v-row>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
								<v-row
									v-for='(item, index) in planData'
									:key='index'
									:style='index % 2 === 0 ? "background-color:rgba(0,0,0,.075)" : "background-color:rgba(0,0,0,0)"'
									class='ma-0 pa-0 pa-3 no-gutters'
								>
									<v-col cols='3' md='2' class=' ma-0 pa-0'>
										<v-icon small class='mr-3' color='secondary' v-if='smAndUp' :icon='mdiInformation' />
										<span class='font-weight-bold unselectable'>{{ item.feature }}</span>
										<v-tooltip activator='parent' location='top center' class='tooltip-z'>
											<span>{{ item.tooltip }}</span>
										</v-tooltip>
									</v-col>
									<v-col cols='9' md='10' class='ma-0 pa-0'>
										<v-row class='ma-0 pa-0'>
											<v-col
												v-for='(level, index) in item.level'
												:key='index'
												class='ma-0 pa-0'
												cols='12'
												md='6'
											>
												<UserPlanCell
													:detail='level.detail'
													:freePlan='level.freePlan'
												/>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
								<v-row class='ma-0 pa-0' align='center'>
									<v-col cols='3' md='2' class='ma-0 pa-0'>
									</v-col>

									<v-col cols='9' md='10' class='ma-0 pa-0'>
										<v-row class='ma-0 pa-0' align='center' justify='start'>
											<v-col v-for='(item, index) in plans' :key='index' cols='12' md='6' class='ma-0 pa-0'>
												<v-row justify='space-around' align='center' class='ma-0 pa-0' dense>
													<v-col cols='auto' class='ma-0 pa-0'>
														<div class='text-black font-weight-bold' :class='priceSize' >
															${{ item.price }}
														</div>
													</v-col>
												</v-row>
												<v-row justify='space-around' align='center' class='ma-0 pa-0 mt-n6' dense>
													<v-col cols='auto' class='ma-0 pa-0'>
														<div class='text-black font-weight-bold' :class='priceSize' >
															<span class='text-overline' :class='{"ml-2" : smAndDown}'>
																<span v-if='item.price===`0`'>forever</span>
																<span v-else>per month</span>
															</span>
														</div>
													</v-col>
												</v-row>
											</v-col>
										</v-row>
									</v-col>

								</v-row>

								<v-row justify='center' class='my-3 ma-0 pa-0 no-gutters'>
									<v-col class='ma-0 pa-0' cols='auto'>
										<ActionButton
											text='create account'
											:icon='mdiAccountPlus'
											:routerLink='FrontEndRoutes.REGISTER'
										/>
									</v-col>
								</v-row>

							</v-col>
						</v-row>
					</section>
					<!-- MOBILE VIEW -->
					<!-- TODO refactor mobile mode and desktop mode together -->
			
					<section v-if='mobile'>
						
						<v-row align='center' justify='center'  v-for='(mobileLevel, index) in mobileLevels' :key='index'>
							<v-col cols='12' >
								<v-divider class='my-1' />
								<v-row justify='center' align='center' class='no-gutters' >
									<v-col cols='auto' class='my-1'>
										<div class='text-center text-pi font-weight-bold' :class='headingSize'>{{ mobileLevel.name }}</div>
									</v-col>
								</v-row>
								<v-row
									v-for='(item, index) in planData'
									:key='index'
									:style='index % 2 === 0 ? "background-color:rgba(0,0,0,.075)" : "background-color:rgba(0,0,0,0)"'
									class='ma-0 pa-0 pa-3 no-gutters'
								>
									<v-col cols='5' md='2' class=' ma-0 pa-0'>

										<v-tooltip activator='parent' location='top center' class='tooltip-z'>
											<span>{{ item.tooltip }}</span>
										</v-tooltip>

										<v-icon  size='small' class='mr-3' color='secondary' :icon='mdiInformation' />
										<span class='text-caption font-weight-bold'>{{ item.feature }}</span>
									</v-col>
									<v-col cols='7' md='10' class='ma-0 pa-0'>
										<v-row class='ma-0 pa-0'>
											<v-col class='ma-0 pa-0' cols='12' >

												<UserPlanCell
													:detail='item.level[mobileLevel.level].detail'
													:freePlan='item.level[mobileLevel.level].freePlan'
												/>

											</v-col>
										</v-row>
									</v-col>
								</v-row>
								<v-row class='ma-0 pa-0' align='center' justify='center'>
									<v-col v-for='(item, index) in [{name: `free`, price: `0`}]' :key='index' cols='auto' class='ma-0 pa-0'>
										<div class='text-black font-weight-bold' :class='priceSize' >
											${{ mobileLevel.price }}
											<span class='text-overline' :class='{"ml-2" : smAndDown}'>
												<span v-if='mobileLevel.price===`0`'>forever</span>
												<span v-else>per month</span>
											</span>
										</div>
									</v-col>
								</v-row>
								<v-row justify='center' class='ma-0 pa-0'>
									<v-col class='' cols='12' md='auto'>
										<ActionButton
											:routerLink='FrontEndRoutes.REGISTER'
											:block='true'
											:icon='mdiAccountPlus'
											text='create account'
										/>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</section>
				
				</template>
			</AppCard>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { FrontEndRoutes } from '@/types/enum_routes';
import { mdiAccountPlus, mdiInformation } from '@mdi/js';
import { useDisplay } from 'vuetify';
import ActionButton from '@/components/Buttons/ActionButton.vue';
import AppCard from '@/components/Card/AppCard.vue';
import ThePage from '@/components/ThePage.vue';
import UserPlanCell from '@/components/Plans/PlanUserCell.vue';

const { mdAndUp, smAndUp, smAndDown, mobile } = useDisplay();

onMounted(() => {
	browserModule().set_description(`staticPi plans page - view our current plan offerings`);
	browserModule().set_title(pageTitle);
});

const headingSize = computed((): string => {
	return mdAndUp.value ? 'text-h5' : 'text-h6';
});

const priceSize = computed((): string => {
	return mdAndUp.value ? 'text-h3' : 'text-h5';
});
const plans = [
	{ name: `free`, price: `0` },
	{ name: `pro`, price: `tbc` }
];
const mobileLevels = [
	{
		name: `free`,
		price: `0`,
		level: 0
	},
	{
		name: `pro`,
		price: `tbc`,
		level: 1
	}
] as const;
const pageTitle = 'plans';
const planData = [
	{
		feature: 'security',
		tooltip: 'Security is our number one priority',
		level: [
			{
				detail: 'Two-Factor logins, 100% TLS, no user tracking',
				freePlan: false,
			},
			{
				detail: 'Two-Factor logins, 100% TLS, no user tracking',
				freePlan: false,
			},
		]
	},

	{
		feature: 'rate limits',
		tooltip: 'Number of messages, per devices, that can be sent',
		level: [
			{
				detail: '15 per minute',
				freePlan: true,
			},
			{
				detail: '300 per minute',
				freePlan: false,
			},
		],
	},
		
	{
		feature: 'device names',
		tooltip: 'Easily identify different devices',
		level: [
			{
				detail: 'randomly assigned',
				freePlan: true,
			},
			{
				detail: 'customisable',
				freePlan: false,
			},
		],
	},
		
	{
		feature: 'device password',
		tooltip: 'Add a password check before being able to connect',
		level: [
			{
				detail: 'not available',
				freePlan: true,
			},
			{
				detail: 'Pi and Clients can either share or have separate passwords',
				freePlan: false,
			},
		],
	},
	{
		feature: 'message size',
		tooltip: 'The maximum message size, to be sent, or received, by either the client or the device',
		level: [
			{
				detail: '10kB',
				freePlan: true,
			},
			{
				detail: '5MB',
				freePlan: false,
			},
		],
	},
	{
		feature: 'bandwidth',
		tooltip: 'Combined total of data sent to device, and to all connected clients',
		level: [
			{
				detail: '5MB / month',
				freePlan: true,
			},
			{
				detail: '10GB / month',
				freePlan: false,
			},
		],
	},
	{
		feature: 'number of devices',
		tooltip: 'Total number of devices available per account',
		level: [
			{
				detail: '1',
				freePlan: true,
			},
			{
				detail: '20',
				freePlan: false,
			}
		],
	},
	{
		feature: 'clients per device',
		tooltip: 'Total number of clients available to connect to each device',
		level: [
			{
				detail: '1',
				freePlan: true,
			},
			{
				detail: '100',
				freePlan: false,
			},
		],
	},
	{
		feature: 'support',
		tooltip: 'How to get assistance',
		level: [
			{
				detail: 'web-based documentation',
				freePlan: true,
			},
			{
				detail: 'priority email based assistance',
				freePlan: false,
			},
		],
	},
	{
		feature: 'cache',
		tooltip: 'Cache messages, accessible by clients even if a device is offline',
		level: [
			{
				detail: 'none',
				freePlan: true,
			},
			{
				detail: 'optional device message cache',
				freePlan: false,
			},
		],
	},
		
] as const ;
</script>

<style scoped>
.v-data-table tbody tr.v-data-table__expanded__content{
	box-shadow: none!important;
}

.v-data-table td {
	padding: 2px
}

</style>
