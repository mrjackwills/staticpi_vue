<template>
	<v-alert
		id='offline_alert'
		class='ma-0 pa-0'
		color='secondary'
		density='compact'
		height='40px'
		tile
		width='100%'
	>
		<v-row class='ma-0 pa-0 align-center justify-center' density='compact'>
			<v-col v-if='!mobile && authenticated' class='ma-0 pa-0' cols='auto'>
				<div :class='spacerClass' />
			</v-col>

			<v-col class='ma-0 pa-0' cols='auto'>
				<v-row class='align-center ma-0 pa-0 pulse justify-center'>
					<v-col class='ma-0 pa-0 mr-2 ' cols='auto'>
						<v-icon
							color='backgroundColor'
							:icon='mdiWifiOff'
							size='small'
						/>
					</v-col>

					<v-col class='ma-0 pa-0 cl' cols='auto'>
						<div class='text-backgroundColor text-center' :class='messageSize'>offline</div>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-alert>
</template>

<script setup lang='ts'>
import { mdiWifiOff } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { fetch_authenticatedUser, fetch_incognito } from '@/services/fetch'

const { mdAndUp, mobile } = useDisplay()

onBeforeUnmount(() => {
	clearInterval(reconnectInterval.value)
	browserModule().set_force_refresh(true)
})

const authenticated = computed(() => userModule().authenticated)
const messageSize = computed(() => mdAndUp.value ? 'text-headline-small' : 'text-body-large')
const spacerClass = computed(() => navDrawerModule().mini ? 'nav-spacer-mini' : 'nav-spacer')

const reconnectInterval = ref(0)

async function reconnect (): Promise<void> {
	await fetch_incognito.online_get()
	await fetch_authenticatedUser.user_get()
}

onMounted(() => {
	reconnectInterval.value = setInterval(reconnect, 10_000)
})
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
