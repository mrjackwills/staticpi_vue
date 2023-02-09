
<template>

	<DocumentationCard heading='Structured Data' :pro='true' >
		<template v-slot:doc-body>
			<p>
				By using structured data, metadata can be included with each message.
				This feature requires messages to conform to a stringent stringified JSON format,
				the three accepted key names are:
				<br>
				• <router-link :to='structured_id("data")'>"data"</router-link>
				<br>
				• <router-link :to='structured_id("cache")'>"cache"</router-link>
				<br>
				• <router-link :to='structured_id("unique")'>"unique"</router-link>
				<br>
				<br>
				<router-link :to='structured_id("error")'>"error"</router-link> is reserved exclusively for use by the servers of staticPi.

				<v-divider color='secondary' class='my-2' thickness='2' />
				<span class='text-h6 font-weight-bold text-pi' :id='structured_key_id("data")'>
					data
				</span>
				<br>
				The data property contains the message to be sent.
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='componentKey' :code='code_structured_data_json' filename='structured_data.js' />
					</v-col>
				</v-row>

				If a device has structured data enabled, but does not send correctly formatted message, an error will be received, <router-link :to='structured_id("error")'>as seen here</router-link>

				<v-divider color='secondary' class='my-2' thickness='2' />
				<span class='text-h6 font-weight-bold text-pi' :id='structured_key_id("cache")'>
					cache
				</span>
				<br>
				Pi connections are able to store a single message in <StaticPi /> cache. This cached message will be received by any client if, and when, there is no pi connection
				<br>
				To set a message in cache, the pi simply needs to send a structured message with a "cache: true" key/value
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :titleBar='false' code='{ data: "This message will be cached", cache: true }' />
					</v-col>
				</v-row>
				To remove the cache, the pi simply needs to send a structured message with a "cache: false" key/value
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :titleBar='false' code='{ data: "Remove any cached messages", cache: false }' />
					</v-col>
				</v-row>

				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='componentKey' :code='code_structured_data_set_cache' filename='pi_send_cache.js' />
					</v-col>
				</v-row>
				If the pi is offline, and a cache is set, clients structured data will include a cache key
				
				<v-row justify='center' class='ma-0 pa-0'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock  :titleBar='false' :code='json_structured_cache' />
					</v-col>
				</v-row>
				Cached messages take priority over unique messages, and will remove the unique key from the structured data.

				<v-divider color='secondary' class='my-2' thickness='2' />

				<span class='text-h6 font-weight-bold text-pi' :id='structured_key_id("unique")'>
					unique
				</span>
				<br>
				By default, all message sent out from a connected pi are delivered to all connected clients.
				<br>
				In cases where you wish for a message to be sent to a unique connected client, the unique key name is used.
				<br>
				Clients can only send unique set to either true or false This is converted, during transit, into a unique id.
				The unique id's are created at each client connection, and are valid for the lifetime of the clients websocket connection.
				<br>
				When the pi sends a structured message with a valid unique id,
				the message will only be delivered to the connected client which correlated to the unique id.
				<br>
				On receipt of a unique message, the client structured message will contain a unique: true value.

				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='componentKey' :code='code_structured_data_unique_client' filename='unique_client.js' />
					</v-col>
				</v-row>

				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='componentKey' :code='code_structured_data_unique_pi' filename='unique_pi.js' />
					</v-col>
				</v-row>

				<v-divider color='secondary' class='my-2' thickness='2' />

				<span class='text-h6 font-weight-bold text-pi' :id='structured_key_id("error")'>
					error
				</span>
				<br>
				The error key can only be set by <StaticPi /> servers, and code uses <a :href='error_codes_href' rel='noopener noreferrer' target='_blank'>standard http error codes</a>.
				<br>
				If a device has structured data enabled, and an invalid formatted message is sent, the sender of the invalid message will receive the following error message
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='componentKey' :titleBar='false' :code='json_structured_invalid' />
					</v-col>
				</v-row>
				Upon reaching the rate limit, an error websocket message will be received, indicating the duration of the block, in seconds, and a status code of 429.
				<v-row justify='center' class='ma-0 pa-0 mt-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='componentKey' :titleBar='false' :code='json_structured_rate_limited' />
					</v-col>
				</v-row>
			</p>
					
		</template>
	</DocumentationCard>

</template>

<script setup lang='ts'>
import { generateRandomHex } from '@/vanillaTS/generateHex';
import CodeBlock from '@/components/CodeBlock.vue';
import DocumentationCard from '@/components/Card/DocumentationCard.vue';
import StaticPi from '@/components/StaticPi.vue';
import type { TStructuredKey } from '@/types';

const code_structured_data_json = computed((): string => {
	return `const api_key = '${props.apiKey}';
const token_request = await fetch('${props.address_token}/pi', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(token_body)
});
const { response } = await token_request.json();
const websocket_connection = new WebSocket(\`${props.address_wss_pi}/\${response}\` );

websocket_connection.addEventListener('open', (event) => {
	const message_to_send = JSON.stringify({ data: { anything: "I_want_here", another_value: true } })
	websocket_connection.send(message_to_send);

	const second_message_to_send = JSON.stringify({ data : "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
	websocket_connection.send(second_message_to_send);
});`;
});
const code_structured_data_unique_client = computed((): string => {
	return `const api_key = '${props.apiKey}';
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
	const message_to_send = JSON.stringify({ data: "only I want to receive this", unique: true });
	websocket_connection.send(message_to_send);
});

websocket_connection.addEventListener('message', (event) => {
	console.log(event.data);
	// { data: "some response", unique: true }
});`;
}) ;
const code_structured_data_unique_pi = computed((): string => {
	return `import WebSocket from 'ws';

const api_key = '${props.apiKey}';
const token_request = await fetch('${props.address_token}/pi', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(token_body)
});
const { response } = await token_request.json();
const websocket_connection = new WebSocket(\`${props.address_wss_pi}/\${response}\` );
			
websocket_connection.on('message', (message) => {
	const parsed_message = JSON.parse(message);
	console.log(parsed_message);
	// { data: "only I want to receive this", unique: "${generateRandomHex(32)}" }
	const unique_response = JSON.stringify({ data: "some response", unique: parsed_message.unique });
	websocket_connection.send(unique_response);
});`;
});

const code_structured_data_set_cache = computed((): string => {
	return `import WebSocket from 'ws';

const api_key = '${props.apiKey}';
const token_request = await fetch('${props.address_token}/pi', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(token_body)
});
const { response } = await token_request.json();
const websocket_connection = new WebSocket(\`${props.address_wss_pi}/\${response}\` );
			
const message_with_cache = JSON.stringify({ data: "please cache this message", cache: true });
websocket_connection.send(message_with_cache);

const message_clear_cache = JSON.stringify({ data: "no longer need to cache anything", cache: false });
websocket_connection.send(message_clear_cache);
});`;
});

const json_structured_rate_limited = `{ "error" : { "message" : "120", "code": 429 } }`;
const json_structured_invalid = `{ "error": { "message" : "Received data is invalid structure", "code": 400 } }`;
const json_structured_cache = `{ "data": "the pi is offline, this is cached this message", "cache": true }`;
const error_codes_href = `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status`;

const structured_key_id = (short: TStructuredKey): string => {
	return `key-${short}`;
};
const route = useRoute();
const structured_id = (short: TStructuredKey): string => {
	return `${route.path}#${structured_key_id(short)}`;
};

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