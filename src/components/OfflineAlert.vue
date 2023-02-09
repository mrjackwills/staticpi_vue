<template>
	<v-alert color='secondary' tile class='ma-0 pa-0 no-gutters' id='offline_alert' width='100%' height='40px'>
		<v-row align='center' justify='center' class='no-gutters ma-0 pa-0'>
			<v-col cols='auto' class='ma-0 pa-0' v-if='!mobile && authenticated' >
				<div :class='spacerClass'></div>
			</v-col>
			<v-col cols='auto' class='ma-0 pa-0' >
				<v-row justify='center' align='center' class='ma-0 pa-0 pulse'>
					<v-col cols='auto' class='ma-0 pa-0 mr-2 '  >
						<v-icon
							color='backgroundColor'
							size='small'
							:icon='mdiWifiOff'
						/>
					</v-col>
					<v-col cols='auto' class='ma-0 pa-0 cl'>
						<div class='text-backgroundColor text-center' :class='messageSize'>offline</div>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-alert>
</template>

<script setup lang='ts'>
import { axios_authenticatedUser, axios_incognito } from '@/services/axios';
import { browserModule, navDrawerModule, userModule } from '@/store';
import { mdiWifiOff } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mdAndUp, mobile } = useDisplay();

onBeforeUnmount(() => {
	clearInterval(reconnectInterval.value);
	browserModule().set_force_refresh(true);
});

const authenticated = computed((): boolean => {
	return userModule().authenticated;
});
const messageSize = computed((): string => {
	return mdAndUp.value ? 'text-h6' : 'text-subtitle-1';
});
const spacerClass = computed((): string => {
	return navDrawerModule().mini? 'nav-spacer-mini' : 'nav-spacer';
});

const reconnectInterval = ref(0);

const reconnect = async (): Promise<void> => {
	await axios_incognito.online_get();
	await axios_authenticatedUser.user_get();
};
	
onMounted(() => {
	reconnectInterval.value = setInterval(() => {
		reconnect();
	}, 10000);
});
</script>

<style>
.nav-spacer-mini {
	width: 56px;
}
.nav-spacer {
	width: 180px;
}

#offline_alert{
	border-radius: 0
}
</style>