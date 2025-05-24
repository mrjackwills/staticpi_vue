<template>
	<ThePage :heading='pageTitle' :justify='"center"'>
		<template v-slot:body>

			<AppCard v-if='authenticated' class='mb-n4' sm='12' md='12' lg='11' xl='11' my=''>
				<template v-slot:body>
					<v-row align='center' justify='center' class='no-gutters ma-0 pa-0' :class='smallText'>
						<v-col cols='12' class='pa-0 my-1'>
							<v-row align='center' justify='center' class='no-gutters'>
								<v-col cols='auto' class='ma-0 pa-0 mr-4'>
									use API key from:
								</v-col>
								<v-col cols='6' md='3' class=' '>
									<v-select v-model='deviceSelected' :disabled='device_name.length === 0'
										:items='device_name' :hide-details='true' density='compact'
										:prepend-inner-icon='mdiRouterWirelessSettings'
										:label='deviceSelected ? "" : device_name.length === 0 ? "no devices" : "select device"' />
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</template>
			</AppCard>

			<AppCard sm='12' md='12' lg='11' xl='11' my='' class='mb-n5'>
				<template v-slot:body>
					<v-row align='center' justify='center' class='no-gutters py-2' :class='smallText'>
						<v-col cols='12' class=''>
							<v-row align='center' justify='space-around' class='no-gutters'>
								<v-col v-for='(item, index) in links' :key='index' cols='5' md='auto' class=''>
									<router-link class='text-primary' :to='createLink(item.id)'>{{ item.display
									}}</router-link>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</template>
			</AppCard>

			<DocConnect :address_token='address_token' :address_wss_client='address_wss_client'
				:address_wss_pi='address_wss_pi' :apiKey='apiKey' :componentKey='componentKey' :password='password' />

			<DocConnectWithPassword :address_token='address_token' :address_wss_client='address_wss_client'
				:address_wss_pi='address_wss_pi' :apiKey='apiKey' :componentKey='componentKey' :password='password' />

			<DocRateLimits :address_token='address_token' :address_wss_client='address_wss_client'
				:address_wss_pi='address_wss_pi' />

			<DocStructuredData :address_token='address_token' :address_wss_client='address_wss_client'
				:address_wss_pi='address_wss_pi' :apiKey='apiKey' :componentKey='componentKey' :password='password' />

			<DocBinary :address_token='address_token' :address_wss_client='address_wss_client'
				:address_wss_pi='address_wss_pi' :apiKey='apiKey' :componentKey='componentKey' :password='password' />

			<DocExamples />
		</template>
	</ThePage>
</template>

<script setup lang='ts'>
import { axios_device } from '@/services/axios';
import { FrontEndRoutes } from '@/types/const_routes';
import { mdiRouterWirelessSettings } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
const deviceStore = deviceModule();

onMounted(() => {
	browserModule().set_description(`staticPi documentation page - full documentation for the staticPi service`);
	browserModule().set_title(pageTitle);
});

onBeforeMount(async () => {
	if (authenticated.value) await axios_device.deviceAll_get();
});

const authenticated = computed((): boolean => userModule().authenticated);

const apiKey = computed((): string => {
	const data = deviceStore.get_api_key(deviceSelected.value);
	return data ? data : 'EXAMPLE_API_KEY';
});
const device_name = computed((): Array<string> => deviceStore.device_names);
const smallText = computed(() => mobile.value ? 'small-text' : '');

const address_token = 'https://token.staticpi.com';
const address_wss_client = 'wss://wss.staticpi.com/client';
const address_wss_pi = 'wss://wss.staticpi.com/pi';
const pageTitle = 'Documentation';
const password = 'YOUR_SECURE_PASSWORD';

const componentKey = ref(0);
const deviceSelected = ref('');
const links = [
	{
		id: 'connect',
		display: 'connect'
	},
	{
		id: 'connect-with-password',
		display: 'connect with password'
	},
	{
		id: 'rate-limits',
		display: 'rate limits'
	},
	{
		id: 'structured-data',
		display: 'structured data'
	},
	{
		id: 'binary-data',
		display: 'binary data'
	},
	{
		id: 'examples',
		display: 'examples'
	}
] as const;

const createLink = (section: 'connect' | 'connect-with-password' | 'rate-limits' | 'structured-data' | 'binary-data' | 'examples'): string => `${FrontEndRoutes.DOCUMENTATION}#${section}`;

// Hacky way to re-compute the code boxes with a computed api key
watch(deviceSelected, (_i: string): void => {
	componentKey.value++;
});

</script>
