
<template>

	<DocumentationCard heading='Structured Data' :pro='true' >
		<template v-slot:doc-body>
			<p>
				By using structured data, metadata can be included with each message.
				This feature requires messages to conform to a stringent stringified JSON format,
				the three accepted key names are:
				<br>
				<br>
				• <router-link :to='structured_id("data")' class='font-weight-bold text-primary'>"data"</router-link>
				<br>
				• <router-link :to='structured_id("cache")' class='font-weight-bold text-primary'>"cache"</router-link>
				<br>
				• <router-link :to='structured_id("unique")' class='font-weight-bold text-primary'>"unique"</router-link>
				<br>
				<br>
				• <router-link :to='structured_id("error")' class='font-weight-bold text-primary'>"error"</router-link> is reserved exclusively for use by the servers of staticPi.

				<v-divider color='secondary' class='my-2' thickness='2' />
				<span class='text-h6 font-weight-bold text-pi' :id='structured_key_id("data")'>
					data
				</span>
				<br>
				The data property contains the message to be sent.
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='`e_${componentKey}`' :code='code_structured_data_json' filename='structured_data.js' />
					</v-col>
				</v-row>
				When structure datad is enabled, the message received needs to be parsed into JSON
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='`f_${componentKey}`' :code='code_structured_data_parse' filename='client_parse.js' />
					</v-col>
				</v-row>

				If a device has structured data enabled, but does not send correctly formatted message, an error will be received,
				<router-link :to='structured_id("error")' class='text-primary'>as seen here</router-link>

				<v-divider color='secondary' class='my-2' thickness='2' />
				<span class='text-h6 font-weight-bold text-pi' :id='structured_key_id("cache")'>
					cache
				</span>
				<br>
				Pi connections are able to store a single message in <StaticPi /> cache. This cached message will be received by any client if, and when, there is no pi connection
				<br>
				To set a message in cache, the pi simply needs to send a structured message with <span class='font-weight-bold'>"cache: true" </span>
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :titleBar='false' code='{ "data": { "any": "message allowed here" } }, "cache": true }' />
					</v-col>
				</v-row>
				To remove the cache, the pi simply needs to send a structured message with <span class='font-weight-bold'>"cache: false" </span>
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :titleBar='false' code='{ "data": { "any": "message allowed here" } }, "cache": false }' />
					</v-col>
				</v-row>

				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='`g_${componentKey}`' :code='code_structured_data_set_cache' filename='pi_send_cache.js' />
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
				By default, all message sent out from a connected <span class='font-weight-bold'>pi</span> are delivered to all connected <span class='font-weight-bold'>clients</span>, but
				if you want to be able to send a message to a single connected
				<span class='font-weight-bold'>client</span>, the <span class='font-weight-bold text-primary'>unique</span> key name can be used.
				<br>
				<span class='font-weight-bold'>Clients</span>
				can only send a message where <span class='font-weight-bold text-primary'>unique</span> is set to <span class='font-weight-bold'>true</span>.
				This is transformed, by <StaticPi /> into a unique string. The unique strings are created at each <span class='font-weight-bold'>client</span> connection,
				are available for the lifetime of the <span class='font-weight-bold '>clients</span> websocket connection, and are valid
				<a href='https://github.com/ulid/spec' target='_blank' rel='noopener noreferrer' class='text-primary font-weight-bold'>ULID</a>
				<br>
				<br>
				When the <span class='font-weight-bold'>pi</span> sends a structured message with a valid unique string,
				the message will only be delivered to the connected <span class='font-weight-bold'>client</span> which correlates to that unique string.
				<br>
				<br>
				On receipt of a unique message, the <span class='font-weight-bold'>client</span> structured message will contain a <span class='font-weight-bold'>unique: true</span> value.

				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='`h_${componentKey}`' :code='code_structured_data_unique_client' filename='unique_client.js' />
					</v-col>
				</v-row>

				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='`i_${componentKey}`' :code='code_structured_data_unique_pi' filename='unique_pi.js' />
					</v-col>
				</v-row>

				<v-divider color='secondary' class='my-2' thickness='2' />

				<span class='text-h6 font-weight-bold text-pi' :id='structured_key_id("error")'>
					error
				</span>
				<br>
				The error key can only be set by <StaticPi /> servers, and code uses
				<a :href='error_codes_href' rel='noopener noreferrer' target='_blank' class='text-primary'>standard http error codes</a>.
				<br>
				If a device has structured data enabled, and an invalid formatted message is sent, the sender of the invalid message will receive the following error message
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='`j_${componentKey}`' :titleBar='false' :code='json_structured_invalid' />
					</v-col>
				</v-row>
				Upon reaching the rate limit, an error websocket message will be received, indicating the duration of the block, in seconds, and code 429.
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='`k_${componentKey}`' :titleBar='false' :code='json_structured_rate_limited' />
					</v-col>
				</v-row>

				If a message is sent that is too large, an error with code 413 will be received
				<v-row justify='center' class='ma-0 pa-0 my-2'>
					<v-col cols='12' class='ma-0 pa-0'>
						<CodeBlock :key='`l_${componentKey}`' :titleBar='false' :code='json_structured_size' />
					</v-col>
				</v-row>
			</p>
					
		</template>
	</DocumentationCard>

</template>

<script setup lang='ts'>
import { generateRandomHex } from '@/vanillaTS/generateHex';
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

const code_structured_data_parse = computed((): string => {
	return `websocket_connection.addEventListener('message', (event) => {
	const message = JSON.parse(event.data);
	console.log(message?.data?.anything)
	// "I_want_here"
	}
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
});
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
	// { data: "only I want to receive this", unique: "${generateRandomHex(26).toUpperCase()}" }
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
});`;
});

const json_structured_rate_limited = `{ "error" : { "message" : "rate limited for 51 seconds", "code": 429 } }`;
const json_structured_invalid = `{ "error": { "message" : "received data is invalid structure", "code": 400 } }`;
const json_structured_size = `{ "error": { "message" : "message size too large", "code": 413 } }`;
const json_structured_cache = `{ "data": "please cache this message", "cache": true }`;
const error_codes_href = `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status`;

const structured_key_id = (short: TStructuredKey): string => {
	return `key-${short}`;
};
const route = useRoute();
const structured_id = (short: TStructuredKey): string => {
	return `${route.path}#${structured_key_id(short)}`;
};

const props = defineProps<{
	address_token: string;
	address_wss_client: string;
	address_wss_pi: string;
	apiKey: string;
	componentKey: number;
	password: string;
}>();
</script>