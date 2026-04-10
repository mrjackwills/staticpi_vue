<template>
	<ThePage :fill-height='true' :justify='"center"'>
		<template #body>
			<AppCard
				:heading='pageTitle'
				heading-class='mt-3'
				lg='11'
				md='11'
				sm='11'
				xl='11'
			>
				<template #body>
					<!-- DESKTOP VIEW -->
					<section v-if='!mobile'>
						<v-row class='align-center ma-0 pa-0 justify-center'>
							<v-col class='ma-0 pa-0' cols='12'>
								<v-row class='ma-0 pa-0 ' density='compact'>
									<v-col class='ma-0 pa-0' cols='3' md='2' />
									<v-col class='ma-0 pa-0' cols='9' md='10'>
										<v-row class='ma-0 pa-0 justify-start'>
											<v-col v-for='(item, index) in [`free`, `pro`]' :key='index' cols=''>
												<v-row class='align-center pa-0 justify-space-around' density='compact'>
													<v-col class='pa-0 ma-0' cols='auto'>
														<div
															class='text-center text-pi font-weight-bold'
															:class='headingSize'
														>{{ item }}</div>
													</v-col>
												</v-row>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
								<v-row
									v-for='(item, index) in planData'
									:key='index'
									class='ma-0 pa-0 pa-3 '
									density='compact'
									:style='index % 2 === 0 ? "background-color:rgba(0,0,0,.075)" : "background-color:rgba(0,0,0,0)"'
								>
									<v-col class=' ma-0 pa-0' cols='3' md='2'>
										<v-icon
											v-if='smAndUp'
											class='mr-3'
											color='secondary'
											:icon='mdiInformation'
											small
										/>
										<span class='font-weight-bold unselectable'>{{ item.feature }}</span>
										<v-tooltip
											v-if='show_tooltip'
											activator='parent'
											content-class='tooltip'
											location='top center'
										>
											<span>{{ item.tooltip }}</span>
										</v-tooltip>
									</v-col>
									<v-col class='ma-0 pa-0' cols='9' md='10'>
										<v-row class='ma-0 pa-0'>
											<v-col
												v-for='(level, level_index) in item.level'
												:key='level_index'
												class='ma-0 pa-0'
												cols='12'
												md='6'
											>
												<PlanUserCell :detail='level.detail' :free-plan='level.freePlan' />
											</v-col>
										</v-row>
									</v-col>
								</v-row>
								<v-row class='align-center ma-0 pa-0'>
									<v-col class='ma-0 pa-0' cols='3' md='2' />

									<v-col class='ma-0 pa-0' cols='9' md='10'>
										<v-row class='align-center ma-0 pa-0 justify-start'>
											<v-col
												v-for='(item, index) in plans'
												:key='index'
												class='ma-0 pa-0'
												cols='12'
												md='6'
											>
												<v-row class='align-center ma-0 pa- justify-space-around' density='compact'>
													<v-col class='ma-0 pa-0' cols='auto'>
														<div class='text-black font-weight-bold' :class='priceSize'>
															${{ item.price }}
														</div>
													</v-col>
												</v-row>
												<v-row
													class='ma-0 pa-0 mt-n6 align-center justify-space-around'
													density='compact'
												>
													<v-col class='ma-0 pa-0' cols='auto'>
														<div class='text-black font-weight-bold' :class='priceSize'>
															<span class='text-label-small' :class='{ "ml-2": smAndDown }'>
																<span v-if='item.price === `0`'>forever</span>
																<span v-else>per month</span>
															</span>
														</div>
													</v-col>
												</v-row>
											</v-col>
										</v-row>
									</v-col>

								</v-row>

								<v-row class='my-3 ma-0 pa-0  justify-center' density='compact'>
									<v-col class='ma-0 pa-0' cols='auto'>
										<ActionButton
											:icon='mdiAccountPlus'
											:router-link='FrontEndRoutes.REGISTER'
											text='create account'
										/>
									</v-col>
								</v-row>

							</v-col>
						</v-row>
					</section>
					<!-- MOBILE VIEW -->
					<!-- TODO refactor mobile mode and desktop mode together -->

					<section v-else>

						<v-row
							v-for='(mobileLevel, index) in mobileLevels'
							:key='index'
							class='align-center justify-center'
						>
							<v-col cols='12'>
								<v-divider class='my-1' />
								<v-row class='align-center justify-center' density='compact'>
									<v-col class='my-1' cols='auto'>
										<div class='text-center text-pi font-weight-bold' :class='headingSize'>{{
											mobileLevel.name }}</div>
									</v-col>
								</v-row>
								<v-row
									v-for='(item, plan_index) in planData'
									:key='plan_index'
									class='ma-0 pa-0 pa-3 '
									density='compact'
									:style='index % 2 === 0 ? "background-color:rgba(0,0,0,.075)" : "background-color:rgba(0,0,0,0)"'
								>
									<v-col class=' ma-0 pa-0' cols='5' md='2'>

										<v-tooltip
											v-if='show_tooltip'
											activator='parent'
											content-class='tooltip'
											location='top center'
										>
											<span>{{ item.tooltip }}</span>
										</v-tooltip>

										<v-icon class='mr-3' color='secondary' :icon='mdiInformation' size='small' />
										<span class='text-body-small font-weight-bold'>{{ item.feature }}</span>
									</v-col>
									<v-col class='ma-0 pa-0' cols='7' md='10'>
										<v-row class='ma-0 pa-0'>
											<v-col class='ma-0 pa-0' cols='12'>

												<PlanUserCell
													:detail='item.level[mobileLevel.level].detail'
													:free-plan='item.level[mobileLevel.level].freePlan'
												/>

											</v-col>
										</v-row>
									</v-col>
								</v-row>
								<v-row class='align-center ma-0 pa-0 justify-center'>
									<v-col
										v-for='(item, free_index) in [{ name: `free`, price: `0` }]'
										:key='free_index'
										class='ma-0 pa-0'
										cols='auto'
									>
										<div class='text-black font-weight-bold' :class='priceSize'>
											${{ mobileLevel.price }}
											<span class='text-label-small' :class='{ "ml-2": smAndDown }'>
												<span v-if='mobileLevel.price === `0`'>forever</span>
												<span v-else>per month</span>
											</span>
										</div>
									</v-col>
								</v-row>
								<v-row class='ma-0 pa-0 justify-center'>
									<v-col class='' cols='12' md='auto'>
										<ActionButton
											:block='true'
											:icon='mdiAccountPlus'
											:router-link='FrontEndRoutes.REGISTER'
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
import { mdiAccountPlus, mdiInformation } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { FrontEndRoutes } from '@/types/const_routes'

const { mdAndUp, smAndUp, smAndDown, mobile } = useDisplay()

onMounted(() => {
	browserModule().set_description(`staticPi plans page - view our current plan offerings`)
	browserModule().set_title(pageTitle)
})

// / Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

const headingSize = computed(() => mdAndUp.value ? 'text-headline-medium' : 'text-headline-small')

const priceSize = computed(() => mdAndUp.value ? 'text-display-small' : 'text-headline-medium')
const plans = [
	{
		name: `free`,
		price: `0`,
	},
	{
		name: `pro`,
		price: `tbc`,
	},
]
const mobileLevels = [
	{
		name: `free`,
		price: `0`,
		level: 0,
	},
	{
		name: `pro`,
		price: `tbc`,
		level: 1,
	},
] as const
const pageTitle = 'plans'
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
		],
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
			},
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

] as const
</script>

<style scoped>
.v-data-table tbody tr.v-data-table__expanded__content {
	box-shadow: none !important;
}

.v-data-table td {
	padding: 2px
}
</style>
