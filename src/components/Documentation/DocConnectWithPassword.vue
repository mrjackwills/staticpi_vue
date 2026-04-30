<template>

	<DocumentationCard heading='Connect with password' :pro='true'>
		<template #doc-body>
			<p>
				If you have enabled password protection for the device, the the token request body requires both the
				<span class='font-weight-bold'>key</span> and <span class='font-weight-bold'>password</span> fields
				<br>
				When setting a device password, you can choose to set identical or separate password for Pi and Client.
			</p>

			<CodeBlock
				:key='`c_${componentKey}`'
				class='my-3'
				:code='code_password_connect_client'
				filename='connect_client_with_password.js'
			/>

			<CodeBlock
				:key='`d_${componentKey}`'
				class='my-3'
				:code='code_password_connect_pi'
				filename='connect_pi_with_password.js'
			/>
		</template>
	</DocumentationCard>

</template>

<script setup lang='ts'>

const code_password_connect_client = computed(() => `const token_body = {
	 key: "${props.apiKey}",
	 password: "your_secret_client_password"
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

const code_password_connect_pi = computed(() => `const token_body = {
	 key: "${props.apiKey}",
	 password: "your_secret_pi_password"
};

const { data } = await axios.get('${props.addressToken}/pi', token_body)
const websocket_connection = new WebSocket(\`${props.addressWssPi}/\${data.response}\` );
	
websocket_connection.addEventListener('open', (event) => {
	console.log('pi connected');
});

websocket_connection.addEventListener('message', (event) => {
	console.log(\`message received on pi: \${event.data}\`);
});`)

const props = defineProps<{
	addressToken: string
	addressWssClient: string
	addressWssPi: string
	apiKey: string
	componentKey: number
	password: string
}>()
</script>
