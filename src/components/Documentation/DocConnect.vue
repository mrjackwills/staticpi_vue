<template>

	<DocumentationCard heading='Connect'>
		<template #doc-body>

			<v-row class='align-center ma-0 pa-0 justify-space-around'>
				<v-col class='align-center ma-0 pa-0' cols='12' md='5'>
					<DocAddressRow
						v-for='(item, index) in authAddressRow'
						:key='index'
						:address='item.address'
						:hover-message='item.hoverMessage'
						:name='item.name'
						:to-copy='item.toCopy'
						:tooltip-message='item.tooltipMessage'
					/>
				</v-col>
				<v-col class='align-center ma-0 pa-0' cols='12' md='5'>
					<DocAddressRow
						v-for='(item, index) in wssAddressRow'
						:key='index'
						:address='item.address'
						:hover-message='item.hoverMessage'
						:name='item.name'
						:to-copy='item.toCopy'
						:tooltip-message='item.tooltipMessage'
					/>
				</v-col>
			</v-row>

			<v-divider class='my-1' />
			<br>
			<v-row class='align-center justify-center'>
				<v-col cols='12' md='6'>
					<AppCard
						class=''
						heading='device connection'
						heading-size='text-headline-small'
						lg='12'
						md='12'
						my=''
						sm='12'
						xl='12'
					>
						<template #body>
							<v-img contain :eager='true' src='@/assets/svg/diagram_o.svg' />
						</template>
					</AppCard>
				</v-col>
			</v-row>

			To establish a websocket connection to
			<StaticPi />
			<br>
			<br>
			<ol class='ml-8'>
				<li>Request an access token</li>
				<li>Prepend the WebSocket address with the access token</li>
				<li>You are now connected.</li>
			</ol>
			<br>
			Every device is restricted to a single Pi connection, and Pro members can have as many as 100 client
			connections, while
			free members are limited to just 1 client connection.
			<br>
			<br>
			Access tokens are valid for 20 seconds, limited to the IP address of the requester, and are destroyed as
			soon as they
			has been used to open a websocket connection.
			<br>
			<br>
			In order to keep connections alive, the
			<StaticPi /> servers send a <span class='font-weight-bold'>PING</span>
			message every 30 seconds, these are not counted against your monthly bandwidth allowance.
			<br>
			If a <span class='font-weight-bold'>PONG</span> message is not sent back within 40 seconds of receiving a
			<span class='font-weight-bold'>PING</span> message,
			the connection will be closed. This should be automatically handled by whichever WebSocket library that you
			use.
			<br><br>
			<CodeBlock
				:key='`client_a${componentKey}`'
				class='my-3'
				:code='code_basic_connect_client'
				filename='connect_client.js'
			/>
			If using node, the <a href='https://www.npmjs.com/package/ws' rel='noopener noreferrer' target='_blank'>ws
				package</a>
			is recommended.
			<CodeBlock
				:key='`pi_a${componentKey}`'
				class='my-3'
				:code='code_basic_connect_pi'
				filename='connect_pi.js'
			/>
		</template>

	</DocumentationCard>

</template>

<script setup lang='ts'>
import type { TAddressRow } from '@/types'

const code_basic_connect_client = computed(() => `const token_body = {
	 key: "${props.apiKey}"
};

const token_request = await fetch('${props.addressToken}/client', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(token_body)
});
const { response } = await token_request.json();

const websocket_connection = new WebSocket(\`${props.addressWssClient}/\${response}\` );
	
websocket_connection.addEventListener('open', (event) => {
	console.log('client connected');
});

websocket_connection.addEventListener('message', (event) => {
	console.log(\`message received on client: \${event.data}\`);
});`)

const code_basic_connect_pi = computed(() => `const WebSocket = require('ws');
const axios = require('axios')

const token_body = {
	 key: "${props.apiKey}"
};

const { data } = await axios.post('${props.addressToken}/pi', token_body)
const websocket_connection = new WebSocket(\`${props.addressWssPi}/\${data.response}\`);

websocket_connection.on('open', function open() {
	console.log('pi connected');
	websocket_connection.send('Hello world');
});

websocket_connection.on('message', function message(data) {
	console.log(\`message received on pi: \${data}\`);
});`)

const authAddressRow = computed((): Array<TAddressRow> => {
	const output = []
	for (const i of ['pi', 'client']) output.push({
		name: `${i} token address:`,
		address: i === 'client' ? `${props.addressToken}/client` : `${props.addressToken}/pi`,
		toCopy: i === 'client' ? `${props.addressToken}/client` : `${props.addressToken}/pi`,
		tooltipMessage: `${i} token address copied`,
		hoverMessage: `copy ${i} token address`,
	})
	return output
})

const wssAddressRow = computed((): Array<TAddressRow> => {
	const output = []
	for (const i of ['pi', 'client']) output.push({
		name: `${i} websocket address:`,
		address: i === 'client' ? props.addressWssClient : props.addressWssPi,
		toCopy: i === 'client' ? props.addressWssClient : props.addressWssPi,
		tooltipMessage: `${i} websocket address copied`,
		hoverMessage: `copy ${i} websocket address`,
	})
	return output
})

const props = defineProps<{
	addressToken: string
	addressWssClient: string
	addressWssPi: string
	apiKey: string
	componentKey: number
	password: string
}>()

</script>
