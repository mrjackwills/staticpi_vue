
<template>
	<v-table>
		<template v-slot:default>
			<thead>
				<tr>
					<th class='px-1 px-md-4 text-left'>server</th>
					<th class='px-1 px-md-4 text-right'>status</th>
					<th class='px-1 px-md-4 text-right'>uptime</th>
					<th class='px-1 px-md-4 text-right'>version</th>
					<th class='px-1 px-md-4 text-right'>last checked</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for='(item, index) in servers' :key='index'>
					<td class='text-left font-weight-bold px-1 px-md-4' :class='[item.status? "text-primary" : "text-error", text_size]'>
						{{ item.address }}
					</td>
					<td class='px-1 px-md-4 text-right'>
						<v-progress-circular v-if='item.loading' :indeterminate='true' :size='20' color='primary' />
						<v-icon v-else :color='item.status ? "primary" : "error"' :size='smAndDown?"x-small":"default"' :icon='item.status? mdiCheckCircle: mdiCloseCircle' />
					</td>
					<td class='px-1 px-md-4 text-right'>
						<span class='text-right font-weight-bold' :class='[item.status? "text-primary" : "text-error", text_size]'>
							<span v-if='item.uptime'>{{ item.uptime }}</span>
						</span>
					</td>
					<td class='px-1 px-md-4 text-right'>
						<span class=' font-weight-bold' :class='[item.status? "text-primary" : "text-error", text_size]'>{{ item.api_version }}</span>
					</td>
					<td class='px-1 px-md-4 text-right'>
						<span v-if='!item.loading' class='text-right font-weight-bold' :class='[item.status? "text-primary" : "text-error", text_size]'>{{ item.updateTime }}</span>
					</td>
				</tr>
			</tbody>
		</template>
	</v-table>
</template>

<script setup lang='ts'>
import { axios_incognito, axios_ws, axios_site_status } from '@/services/axios';
import { env } from '@/vanillaTS/env';
import { mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import { parse } from 'secure-json-parse';
import { secondsToDays } from '@/vanillaTS/convert_seconds';
import { useDisplay } from 'vuetify';
const { smAndDown } = useDisplay();

onBeforeMount(async () => {
	await checkAll();

});

const text_size = computed((): string => {
	return smAndDown.value ? 'small-text' : '';
});

const servers = ref([
	{
		description: 'website' as const,
		address: env.domain_www,
		status: false,
		updateTime: '',
		loading: false,
		api_version: '',
		uptime: ''
	},
	{
		description: 'api' as const,
		address: env.domain_api,
		status: false,
		updateTime: '',
		loading: false,
		api_version: '',
		uptime: ''
	},
	{
		description: 'token' as const,
		address: env.domain_auth,
		status: false,
		updateTime: '',
		loading: false,
		api_version: '',
		uptime: ''
	},
	{
		description: 'wss' as const,
		address: env.domain_wss,
		status: false,
		updateTime: '',
		loading: false,
		api_version: '',
		uptime: ''
	}

]);

const checkAll = async (): Promise<void> => {
	updateServerStatus('token');
	updateServerStatus('api');
	updateServerStatus('website');
	checkWssServer();
};

const convertTime = (data: string): string => {
	return secondsToDays(Number(data) * 1000);
};

const wsParser = (input: string): void => {
	try {
		const parsed = parse(input);
		const serverIndex = servers.value.findIndex((i) => i.description === 'wss');
		const serverEntry = servers.value[serverIndex];
		if (!serverEntry) return;
		serverEntry.api_version = parsed.api_version;
		serverEntry.uptime = convertTime(parsed.uptime);
	} catch (_e) {
		return;
	}
};

const updateServerStatus = async (server: 'api' | 'token' | 'website'): Promise<void> => {
	const serverIndex = servers.value.findIndex((i) => i.description === server);
	const serverEntry = servers.value[serverIndex];
	if (!serverEntry) return;
	serverEntry.loading = true;
	switch (server) {
		case 'api':
		case 'token': {
			const response = server === 'api' ? await axios_incognito.online_get() : await axios_ws.online();
			if (response) {
				serverEntry.api_version = response.api_version;
				serverEntry.status = true;
				serverEntry.uptime = convertTime(response.uptime);
			}
			break;
		}
		case 'website' : {
			const response = await axios_site_status.manifest_online();
			if (response) {
				serverEntry.api_version = response;
				serverEntry.status = true;
			}
			break;
		}
	}
	serverEntry.loading = false;
	serverEntry.updateTime = new Date().toLocaleString();
		
};

const checkWssServer = (): void => {
	const serverIndex = servers.value.findIndex((i) => i.description === 'wss');
	const serverEntry = servers.value[serverIndex];
	if (!serverEntry) return;
	serverEntry.loading = true;
	const checkSocket = new WebSocket(`${env.domain_wss}/online`);
	checkSocket.addEventListener('error', (_event) => {
		serverEntry.status = false;
		serverEntry.loading = false;
		serverEntry.updateTime = new Date().toLocaleString();
		checkSocket.close();
	});
	checkSocket.addEventListener('message', (event) => {
		wsParser(event.data);
		serverEntry.status = true;
		serverEntry.loading = false;
		serverEntry.updateTime = new Date().toLocaleString();
		checkSocket.close();
	});

};

</script>