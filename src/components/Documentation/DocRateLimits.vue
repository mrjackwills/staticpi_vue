<template>

	<DocumentationCard heading='Rate limits'>
		<template #doc-body>
			<p>
				<span class='font-weight-bold text-pi text-headline-small'>Messaging rate limits</span>
				<br>
				To ensure fair usage for all users, rate limits are applied to messages received by the
				<StaticPi /> websocket servers.
				Each device, and all it's connections, share the same unique rate limit pool. The limits are as follows:
				<v-row class='align-center ma-0 pa-0 justify-center'>
					<v-col class='ma-0 pa-0 font-weight-bold' cols='auto'>

						<v-table>
							<template #default>
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
									<tr v-for='item in limit_ws' :key='item.name' :class='item.class'>
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
				If the limit is exceeded by a factor of 4, a five-minute block on sending, receiving, and connecting is
				imposed, and the
				offending connection will be terminated.
				<v-divider class='my-2' color='secondary' thickness='2' />
				<v-row class='ma-0 pa-0 justify-start'>
					<v-col class='ma-0 pa-0' cols='auto'>
						<ProUserChip class='mb-2' />
					</v-col>
				</v-row>
				If <router-link class='font-weight-bold text-primary' :to='structured_link()'>structured
					data</router-link> is enabled,
				when rate limited,
				a connected <span class='font-weight-bold'>pi</span> or <span class='font-weight-bold'>client</span>
				will be unable to
				send
				any new messages, and instead will receive a similar message to:
				<v-row class='ma-0 pa-0 justify-center'>
					<v-col class='ma-0 pa-0' cols='12'>
						<CodeBlock
							code=' { "error": { "message" : "rate limited for 51 seconds", "code": 429 } } }'
							:title-bar='false'
						/>
					</v-col>
				</v-row>

				<v-divider class='my-2' color='secondary' thickness='2' />

				<span class='font-weight-bold text-pi text-headline-small '>Connecting limits</span>
				<br>
				When opening a new websocket connection with
				<StaticPi />,
				rate limits are applied based on the API key used, the IP address of the connection, and whether the
				connection is from
				a Pi or a client.
				<br>
				<br>
				<span class='font-weight-bold'>{{ addressToken }}</span> calculate rate limit on both the API key and
				the IP address of
				the requester.
				If the limit is exceeded, the request will result in an response with a status code of 429, and a string
				indicating the
				length of the block

				<v-row class='ma-0 pa-0 justify-center'>
					<v-col class='ma-0 pa-0' cols='12'>
						<CodeBlock code='{ "response": "rate limited for 51 seconds" }' :title-bar='false' />
					</v-col>
				</v-row>

				<br>
				<span class='font-weight-bold'>{{ addressWssClient }}</span> and
				<span class='font-weight-bold'>{{ addressWssPi }}</span>
				calculate the connecting rate limit on both the API key and the IP address of the requester. If the
				limits are exceeded,
				a new websocket connection will not be able to be established.

				<v-divider class='my-2' color='secondary' thickness='2' />

				<span class='font-weight-bold text-pi text-headline-small '>Back pressure</span>
				<br>
				The websocket servers will allow up to eight queued messages. If the recipient can't process messages
				fast enough, any
				further messages sent will be ignored.
				This guarantees smooth operation even in high-traffic or slow-connection situations.
			</p>
		</template>
	</DocumentationCard>
</template>

<script setup lang='ts'>
import { FrontEndRoutes } from '@/types/const_routes'

const structured_link = (): string => `${FrontEndRoutes.DOCUMENTATION}#structured-data`

const limit_ws = [
	{
		name: 'free',
		value: 15,
		class: 'text-pi',
	},
	{
		name: 'pro',
		value: 300,
		class: 'text-primary',
	},
]

defineProps<{
	addressToken: string
	addressWssClient: string
	addressWssPi: string
}>()

</script>
