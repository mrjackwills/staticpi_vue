<template>
	<ThePage :heading='pageTitle' :justify='"center"'>
		<template #body>

			<AppCard
				v-if='authenticated'
				class='mb-1'
				lg='11'
				md='12'
				my=''
				sm='12'
				xl='11'
			>
				<template #body>
					<v-row class='ma-0 pa-0 align-center justify-center' :class='smallText' density='compact'>
						<v-col class='pa-0 my-1' cols='12'>
							<v-row class='align-center  justify-center' density='compact'>
								<v-col class='ma-0 pa-0 mr-4' cols='auto'>
									use API key from:
								</v-col>

								<v-col class=' ' cols='6' md='3'>
									<v-select
										v-model='deviceSelected'
										density='compact'
										:disabled='device_name.length === 0'
										:hide-details='true'
										:items='device_name'
										:label='deviceSelected ? "" : device_name.length === 0 ? "no devices" : "select device"'
										:prepend-inner-icon='mdiRouterWirelessSettings'
									/>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</template>
			</AppCard>

			<AppCard
				lg='11'
				md='12'
				my=''
				sm='12'
				xl='11'
			>
				<template #body>
					<v-row class='py-2 align-center justify-center' :class='smallText' density='compact'>
						<v-col class='' cols='12'>
							<v-row class='align-center justify-space-around' density='compact'>
								<v-col
									v-for='(item, index) in links'
									:key='index'
									class=''
									cols='5'
									md='auto'
								>
									<router-link class='text-primary' :to='createLink(item.id)'>{{ item.display
									}}</router-link>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</template>
			</AppCard>

			<DocConnect
				:address-token
				:address-wss-client
				:address-wss-pi
				:api-key
				:component-key
				:password
			/>

			<DocConnectWithPassword
				:address-token
				:address-wss-client
				:address-wss-pi
				:api-key
				:component-key
				:password
			/>

			<DocRateLimits :address-token :address-wss-client :address-wss-pi />

			<DocStructuredData
				:address-token
				:address-wss-client
				:address-wss-pi
				:api-key
				:component-key
				:password
			/>

			<DocBinary
				:address-token
				:address-wss-client
				:address-wss-pi
				:api-key
				:component-key
				:password
			/>

			<DocExamples />
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { mdiRouterWirelessSettings } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { fetch_device } from '@/services/fetch'
import { FrontEndRoutes } from '@/types/const_routes'

const { mobile } = useDisplay()
const deviceStore = deviceModule()

onMounted(() => {
	browserModule().set_description(`staticPi documentation page - full documentation for the staticPi service`)
	browserModule().set_title(pageTitle)
})

onBeforeMount(async () => {
	if (authenticated.value) await fetch_device.deviceAll_get()
})

const authenticated = computed((): boolean => userModule().authenticated)

const apiKey = computed((): string => {
	const data = deviceStore.get_api_key(deviceSelected.value)
	if (data) {
		return data
	}
	return 'EXAMPLE_API_KEY'
})
const device_name = computed((): Array<string> => deviceStore.device_names)
const smallText = computed(() => mobile.value ? 'small-text' : '')

const addressToken = 'https://token.staticpi.com'
const addressWssClient = 'wss://wss.staticpi.com/client'
const addressWssPi = 'wss://wss.staticpi.com/pi'
const pageTitle = 'Documentation'
const password = 'YOUR_SECURE_PASSWORD'

const componentKey = ref(0)
const deviceSelected = ref('')
const links = [
	{
		id: 'connect',
		display: 'connect',
	},
	{
		id: 'connect-with-password',
		display: 'connect with password',
	},
	{
		id: 'rate-limits',
		display: 'rate limits',
	},
	{
		id: 'structured-data',
		display: 'structured data',
	},
	{
		id: 'binary-data',
		display: 'binary data',
	},
	{
		id: 'examples',
		display: 'examples',
	},
] as const

const createLink = (section: 'connect' | 'connect-with-password' | 'rate-limits' | 'structured-data' | 'binary-data' | 'examples'): string => `${FrontEndRoutes.DOCUMENTATION}#${section}`

// Hacky way to re-compute the code boxes with a computed api key
watch(deviceSelected, (): void => {
	componentKey.value++
})

</script>
