<template>
	<ThePage class='justify-center' :fill-height='true'>
		<template #body>
			<v-row
				class='pa-0 ma-0 align-center justify-center'
				:class='mdAndUp ? "md-section-height" : "sm-section-height"'
				density='compact'
			>
				<v-col class='ma-0 pa-0' cols='12'>
					<v-row class='align-center ma-0 pa-0 justify-center'>
						<v-img
							contain
							:eager='true'
							:height='"50vh"'
							:max-width='mdAndUp ? "55vw" : "95vw"'
							src='@/assets/svg/network.svg'
						/>
					</v-row>

					<v-row class='align-center mt-8 ma-0 pa-0 justify-center' density='compact'>
						<v-col class='pa-0 ma-0' :class='`text-${text_size}`' cols='auto'>
							<StaticPi color='pi' />
						</v-col>

						<v-col class='text-pi text-center ma-0 pa-0' cols='12'>
							<span class='font-weight-black text-pi text-headline-medium lh'>
								The easiest way to communicate with your Raspberry Pi or single-board computer
							</span>
						</v-col>
					</v-row>

					<v-row class='align-center pa-0 ma-0 justify-center'>
						<v-col class='pa-0 ma-0' cols='auto'>
							<router-link :to='`${FrontEndRoutes.BASE}#about`'>

								<v-btn
									class='align-self-end elevation-0 cl fab-fix'
									color='primary'
									icon
									:medium='mdAndUp'
									:small='smAndDown'
								>
									<v-icon
										color='white'
										:icon='mdiChevronDoubleDown'
										:large='mdAndUp'
										:medium='smAndDown'
									/>
								</v-btn>
							</router-link>
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row
				id='about'
				class='ma-0 pa-0 text-headline-medium mb-14 align-center justify-center'
				density='compact'
				style='height:90vh'
			>
				<AppCard
					:has-button='false'
					heading='about'
					lg='11'
					sm='12'
					xl='11'
				>
					<template #body>

						<v-row class='align-center mt-3 mx-1 ma-0 pa-0 justify-center'>

							<v-col class='text-body-large' cols='12'>
								Introducing
								<StaticPi />, our new service that allows you to connect multiple clients to a single
								device via websockets.
								<br><br>
								With our service, you can easily manage and communicate with multiple devices at once.
								Whether you're a business or organization looking to manage a fleet of devices,
								a developer looking for an easy way to connect multiple clients to a single device, or a
								home tinkerer looking to control and monitor your smart home devices,
								we have you covered.
								<br><br>
								Our service is perfect for Internet of Things (IoT) applications, automation, and any
								other scenario where multiple clients need to connect to a single device.
								With
								<StaticPi />, you can send commands and receive data from all of your connected devices
								in real-time,
								streamlining your operations and increasing efficiency.
								<br><br>
								Our user-friendly interface makes it easy to set up and manage your connected devices,
								even if you have little to no technical experience,
								making it a great tool for home tinkerers as well.
							</v-col>
						</v-row>

						<v-row class='align-center ma-0 my-2 pa-0 justify-space-around'>
							<v-col class='py-0 text-body-large' cols='11' md='auto'>
								<ul>
									<li>Easy to set up</li>
									<li>Safe and secure network</li>
									<li>Works on all raspberry pi's, single board computers, and in browser</li>
								</ul>
							</v-col>

							<v-col class='py-0 text-body-large' cols='11' md='auto'>
								<ul>
									<li>Send simple messages or binary data</li>
									<li>Code examples in multiple languages</li>
									<li>Continual development and improvement</li>
								</ul>
							</v-col>
						</v-row>

						<v-row class='align-center text-body-large mt-3 mx-1 ma-0 pa-0 justify-center'>

							<v-col class='text-center' cols='12'>
								fully open source
							</v-col>

							<v-col cols='auto'>
								<a
									class='text-primary font-weight-bold'
									href='https://www.github.com/mrjackwills/staticpi_vue'
									rel='noopener noreferrer'
									target='_blank'
								>website source
									code</a>
							</v-col>

							<v-col cols='auto'>
								<a
									class='text-primary font-weight-bold'
									href='https://www.github.com/mrjackwills/staticpi_backend'
									rel='noopener noreferrer'
									target='_blank'
								>backend source
									code</a>
							</v-col>
						</v-row>

						<v-row class='align-center  mt-3 mx-1 ma-0 pa-0 font-weight-bold justify-center'>

							<v-col cols='auto'>
								sign up for
								<StaticPi /> today and take control of all your connected devices
							</v-col>
						</v-row>

						<v-row class='pa-0 ma-0 my-4 justify-center'>
							<v-col class='ma-0 pa-0' cols='12'>
								<ActionButton
									:block='true'
									:icon='mdiAccountPlus'
									:router-link='FrontEndRoutes.REGISTER'
									text='create account'
								/>
							</v-col>
						</v-row>
					</template>
				</AppCard>
			</v-row>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { mdiAccountPlus, mdiChevronDoubleDown } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { FrontEndRoutes } from '@/types/const_routes'

const { mdAndUp, smAndDown } = useDisplay()

// FIX ME
const text_size = computed(() => mdAndUp.value ? 'display-large' : 'display-medium')

const browserStore = browserModule()
onMounted(() => {
	browserStore.set_description(`staticPi`)
	browserStore.set_title(``)
})
</script>

<style scoped>
.lh {
	line-height: 0% !important;
}
</style>
