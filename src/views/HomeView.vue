
<template>
	<ThePage
		:fillHeight='true'
		justify='center'
	>
		<template v-slot:body>
			<v-row
				:class='mdAndUp ? "md-section-height" : "sm-section-height" '
				class='pa-0 ma-0'
				justify='center'
				align='center'
				no-gutters

			>
				<v-col cols='12' class='ma-0 pa-0'>
					<v-row align='center' justify='center' class='ma-0 pa-0'>
						<v-img
							:eager='true'
							:height='"50vh"'
							:max-width='mdAndUp ? "55vw" : "95vw"'
							src='@/assets/svg/network.svg'
							contain
						/>
					</v-row>
					<v-row
						align='center'
						class='mt-8 ma-0 pa-0'
						justify='center'
						no-gutters
					>
						<v-col cols='auto' class='pa-0 ma-0' :class='`text-${h1}`'>
							<StaticPi color='pi' />
						</v-col>
						<v-col
							class='text-pi text-center ma-0 pa-0'
							cols='12'
							tag='h1'
						>
							<span class='font-weight-black text-pi text-h5 lh' >
								The easiest way to communicate with your Raspberry Pi or single-board computer
							</span>
						</v-col>
					</v-row>
					<v-row
						justify='center'
						align='center'
						class='pa-0 ma-0'
					>
						<v-col cols='auto' class='pa-0 ma-0'>
							<router-link :to='`${FrontEndRoutes.BASE}#about`'>

								<v-btn
									:small='smAndDown'
									:medium='mdAndUp'
									class='align-self-end elevation-0 cl fab-fix'
									color='primary'
									icon
								>
									<v-icon
										color='white'
										:large='mdAndUp'
										:medium='smAndDown'
										:icon='mdiChevronDoubleDown' />
								</v-btn>
							</router-link>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			
			<v-row no-gutters align='center' justify='center' class='ma-0 pa-0 text-h5 mb-14' style='height:90vh' id='about' >
				<AppCard
					:hasButton='false'
					heading='about'
					sm='12'
					lg='11'
					xl='11'
				>
					<template v-slot:body>

						<v-row class='mt-3 mx-1 ma-0 pa-0' align='center' justify='center'>
					
							<v-col cols='12'>
								Introducing <StaticPi/>, our new service that allows you to connect multiple clients to a single device via websockets.
								<br><br>
								With our service, you can easily manage and communicate with multiple devices at once.
								Whether you're a business or organization looking to manage a fleet of devices,
								a developer looking for an easy way to connect multiple clients to a single device, or a home tinkerer looking to control and monitor your smart home devices,
								we have you covered.
								<br><br>
								Our service is perfect for Internet of Things (IoT) applications, automation, and any other scenario where multiple clients need to connect to a single device.
								With <StaticPi />, you can send commands and receive data from all of your connected devices in real-time,
								streamlining your operations and increasing efficiency.
								<br><br>
								Our user-friendly interface makes it easy to set up and manage your connected devices, even if you have little to no technical experience,
								making it a great tool for home tinkerers as well.
							</v-col>
						</v-row>
						<v-row class='ma-0 my-2 pa-0' align='center' justify='space-around'>
							<v-col cols='11' md='auto' class='py-0'>
								<ul>
									<li>Easy to set up</li>
									<li>Safe and secure network</li>
									<li>Works on all raspberry pi's, single board computers, and in browser</li>
								</ul>
							</v-col>
							<v-col cols='11' md='auto' class='py-0 '>
								<ul>
									<li>Send simple messages or binary data</li>
									<li>Code examples in multiple languages</li>
									<li>Continual development and improvement</li>
								</ul>
							</v-col>
						</v-row>

						<v-row class=' mt-3 mx-1 ma-0 pa-0' align='center' justify='center'>
					
							<v-col cols='12' class='text-center'>
								fully open source
							</v-col>
							<v-col cols='auto'>
								<a  href='https://www.github.com/mrjackwills/staticpi_vue' target='_blank' rel='noopener noreferrer' class='text-primary font-weight-bold'>website source code</a>
							</v-col>
							<v-col cols='auto'>
								<a href='https://www.github.com/mrjackwills/staticpi_backend' target='_blank' rel='noopener noreferrer' class='text-primary font-weight-bold'>backend source code</a>
							</v-col>
						</v-row>
						
						<v-row class=' mt-3 mx-1 ma-0 pa-0 font-weight-bold' align='center' justify='center'>
					
							<v-col cols='auto'>
								sign up for <StaticPi /> today and take control of all your connected devices
							</v-col>
						</v-row>
			
						<v-row justify='center' class='pa-0 ma-0 my-4'>
							<v-col cols='12' class='ma-0 pa-0'>
								<ActionButton
									text='create account'
									:block='true'
									:icon='mdiAccountPlus'
									:routerLink='FrontEndRoutes.REGISTER'
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
import { FrontEndRoutes } from '@/types/const_routes';
import { mdiAccountPlus, mdiChevronDoubleDown } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndDown } = useDisplay();

const h1 = computed((): string => {
	return mdAndUp.value ? 'h1' : 'h2';
});

const browserStore = browserModule();
onMounted(() => {
	browserStore.set_description(`staticPi`);
	browserStore.set_title(``);
});
</script>

<style scoped>
.lh{
	line-height: 0%!important;

}
</style>