
<template>

	<DocumentationCard heading='Connect'>
		<template v-slot:doc-body>

			<v-row class='ma-0 pa-0' justify='space-around' align='center'>
				<v-col cols='12' md='5' class='ma-0 pa-0' align='center'>
					<AddressRow v-for='(item, index) in authAddressRow' :key='index'
						:name='item.name'
						:address='item.address'
						:toCopy='item.toCopy'
						:tooltipMessage='item.tooltipMessage'
						:hoverMessage='item.hoverMessage'
					/>
				</v-col>
				<v-col cols='12' md='5' class='ma-0 pa-0' align='center'>
					<AddressRow v-for='(item, index) in wssAddressRow' :key='index'
						:name='item.name'
						:address='item.address'
						:toCopy='item.toCopy'
						:tooltipMessage='item.tooltipMessage'
						:hoverMessage='item.hoverMessage'
					/>
				</v-col>
			</v-row>

			<v-divider class='my-1'/>
			<br>
			To establish a websocket connection to <StaticPi />
			<br>
			<br>
			<ol class='ml-8'>
				<li>Request an access token</li>
				<li>Prepend the WebSocket address with the access token</li>
				<li>You are now connected.</li>
			</ol>
			<br>
			Every device is restricted to a single Pi connection, and Pro members can have as many as 100 client connections, while free members are limited to just 1 client connection.
			<br>
			<br>
			Access tokens are valid for 20 seconds, limited to the IP address of the requestor, and are destroyed as soon as they has been used to open a websocket connection.
			<br>
			<br>
			In order to keep connections alive, the <StaticPi /> servers send a <span class='font-weight-bold'>PING</span> message every 30 seconds, these are not counted against your monthly bandwidth allowance.
			<br>
			If a <span class='font-weight-bold'>PONG</span> message is not sent back within 40 seconds of receiving a <span class='font-weight-bold'>PING</span> message,
			the connection will be closed. This should be automatically handled by whichever WebSocket library that you use.
			<br><br>
			<CodeBlock :key='`client_a${componentKey}`' :code='code_basic_connect_client' filename='connect_client.js' class='my-3' />
			If using node, the <a href='https://www.npmjs.com/package/ws' target='_blank' rel='noopener noreferrer'>ws package</a> is recommended.
			<CodeBlock :key='`pi_a${componentKey}`' :code='code_basic_connect_pi' filename='connect_pi.js' class='my-3' />
		</template>

	</DocumentationCard>

</template>

<script setup lang='ts'>
import AddressRow from '@/components/Documentation/DocAddressRow.vue';
import CodeBlock from '@/components/CodeBlock.vue';
import DocumentationCard from '@/components/Card/DocumentationCard.vue';
import StaticPi from '@/components/StaticPi.vue';
import type { TAddressRow } from '@/types';
		
const code_basic_connect_client = computed((): string => {
	return `const token_body = {
	 key: "${props.apiKey}"
};

const connect_client = async () => {
	const token_request = await fetch('${props.address_token}/client', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(token_body)
	});
	const { response } = await token_request.json();
	const websocket_connection = new WebSocket(\`${props.address_wss_client}/\${response}\` );
	
	websocket_connection.addEventListener('open', (event) => {
		console.log('client connected');
	});

	websocket_connection.addEventListener('message', (event) => {
		console.log(\`message received on client: \${event.data}\`);
	});
	
}`;
});

const code_basic_connect_pi = computed((): string => {
	return `const WebSocket = require('ws');
const axios = require('axios')

const token_body = {
	 key: "${props.apiKey}"
};

const connect_pi = async () => {
	const { data } = await axios.post('${props.address_token}/pi', token_body)
	const websocket_connection = new WebSocket(\`${props.address_wss_pi}/\${data.response}\`);

	websocket_connection.on('open', function open() {
		console.log('pi connected');
		websocket_connection.send('Hello world');
	});

	websocket_connection.on('message', function message(data) {
		console.log(\`message received on pi: \${data}\`);
	});

}`;

});

const authAddressRow = computed((): Array<TAddressRow> => {
	const output = [];
	for (const i of [ 'pi', 'client' ]) output.push(
		{
			name: `${i} token address:`,
			address: i === 'client' ? `${props.address_token}/client` : `${props.address_token}/pi`,
			toCopy: i === 'client' ? `${props.address_token}/client` : `${props.address_token}/pi`,
			tooltipMessage: `${i} token address copied`,
			hoverMessage: `copy ${i} token address`
		});
	return output;
});

const wssAddressRow = computed((): Array<TAddressRow> => {
	const output = [];
	for (const i of [ 'pi', 'client' ]) output.push(
		{
			name: `${i} websocket address:`,
			address: i === 'client' ? props.address_wss_client : props.address_wss_pi,
			toCopy: i === 'client' ? props.address_wss_client : props.address_wss_pi,
			tooltipMessage: `${i} websocket address copied`,
			hoverMessage: `copy ${i} websocket address`
		});
	return output;
});

const props = defineProps({
	address_token: {
		type: String,
		required: true,
	},
	address_wss_client: {
		type: String,
		required: true,
	},
	address_wss_pi: {
		type: String,
		required: true,
	},
	apiKey: {
		type: String,
		required: true
	},
	componentKey: {
		type: Number,
		required: true
	},
	password: {
		type: String,
		required: true,
	},
});

</script>
