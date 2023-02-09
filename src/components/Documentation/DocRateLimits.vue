
<template>

	<DocumentationCard heading='Rate limits'>
		<template v-slot:doc-body>
			<p>
				<span class='font-weight-bold text-pi'>Messaging rate limits</span>
				<br>
				To ensure fair usage for all users, rate limits are applied to messages received by the <StaticPi /> websocket servers.
				Each device, and all it's connections, share the same unique rate limit pool. The limits are as follows:
				<v-row justify='center' align='center' class='ma-0 pa-0'>
					<v-col cols='auto' class='ma-0 pa-0 font-weight-bold'>

						<v-table>
							<template v-slot:default>
								<thead>
									<tr>
										<th class='text-left font-weight-bold'>
											plan type
										</th>
										<th class='text-right font-weight-bold'>
											ws messages per minute per pool
										</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for='item in limit_ws'
										:key='item.name'
										:class='item.class'
									>
										<td>{{ item.name }}</td>
										<td class='text-right'>{{ item.value }}</td>
									</tr>
								</tbody>
							</template>
						</v-table>
					</v-col>
							
				</v-row>
				<br>
				If the rate limit is exceeded, a one-minute ban on sending and receiving messages is imposed.
				If the limit is exceeded by a factor of 4, a five-minute block on sending, receiving, and connecting is imposed, and the offending connection will be terminated.
				<br>
				<br>
				<span class='font-weight-bold text-pi'>Connection limits</span>
				<br>
				When opening a new websocket connection with <StaticPi />, rate limits are applied based on the API key used, the IP address of the connection, and whether the connection is from a Pi or a client.

				<br>
				<br>
				The <span class='font-weight-bold'>{{ address_token }}</span> has rate limits applied, taking into account both the API key and the IP address of the requester.
				If the limits are exceeded, the request will result in an empty response with a status code of 429.
				<br>
				<br>

				Both <span class='font-weight-bold'>{{ address_wss_client }}</span> and <span class='font-weight-bold'>{{ address_wss_pi }}</span>
				have rate limits applied, taking into account both the API key and the IP address of the requester. If the limits are exceeded, a new websocket connection will not be able to be established
				<br>
				<br>
				<span class='font-weight-bold text-pi'>Back pressure</span>
				<br>
				The websocket servers will allow up to eight queued messages. If the recipient can't process messages fast enough, any further messages sent will be ignored.
				This guarantees smooth operation even in high-traffic or slow-connection situations.
			</p>
		</template>
	</DocumentationCard>
</template>

<script setup lang='ts'>
import DocumentationCard from '@/components/Card/DocumentationCard.vue';
import StaticPi from '@/components/StaticPi.vue';

const limit_ws = [
	{
		name: 'free',
		value: 15,
		class: 'text-pi'
	},
	{
		name: 'pro',
		value: 300,
		class: 'text-primary'
	},
];

defineProps({
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
});

</script>