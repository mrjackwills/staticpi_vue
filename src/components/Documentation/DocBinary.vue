
<template>

	<DocumentationCard heading='Binary Data'>
		<template v-slot:doc-body>
			If a device has structured data enabled, binary data received will result in a invalid message
			<v-row justify='center' class='ma-0 pa-0 my-2'>
				<v-col cols='12' class='ma-0 pa-0'>
					<CodeBlock :titleBar='false' :code='json_structured_invalid' />
				</v-col>
			</v-row>
			Sending a message in this scenario requires converting the binary data to Base 64, which will result in an increase of approximately 30% in the size of the data.
			<v-row justify='center' class='ma-0 pa-0 mt-2'>
				<v-col cols='12' class='ma-0 pa-0'>
					<CodeBlock filename='node_send_base64.js' :code='code_structured_data_json' />
				</v-col>
			</v-row>

			This could then be displayed in a browser using this approach

			<v-row justify='center' class='ma-0 pa-0 mt-2'>
				<v-col cols='12' class='ma-0 pa-0'>
					<CodeBlock filename='photo_handler.js' :code='b64_received' />
				</v-col>
			</v-row>
		</template>

	</DocumentationCard>

</template>

<script setup lang='ts'>
import CodeBlock from '@/components/CodeBlock.vue';
import DocumentationCard from '@/components/Card/DocumentationCard.vue';

const json_structured_invalid = `{ "error": { "message" : "Received data is invalid structure", "code": 400 } }`;

const code_structured_data_json = computed((): string => {
	return `import { readFile } from 'fs/promises'

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

const photo_as_b64 = await readFile('./keyboard_cat.jpg', {encoding: 'base64'});
const binary_structured_message = JSON.stringify({ data : {name: "cat_photo", photo: photo_as_b64 });
websocket_connection.send(binary_structured_message);
});`;
});

const b64_received = computed((): string => {
	return `websocket_connection.addEventListener('message', (event) => {
		let message = JSON.parse(event.data);
		if (message.data?.name === "cat_photo") {
			document.getElementById("cat_photo").src = \`data:image/jpeg;base64,\${message.data.photo}\`
		}
});`;
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
