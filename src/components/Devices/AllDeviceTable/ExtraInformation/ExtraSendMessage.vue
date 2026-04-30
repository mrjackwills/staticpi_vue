<template>
	<AppCard
		:button-justify='"center"'
		:has-button='true'
		lg='11'
		:loading='localLoading'
		md='11'
		my=''
		:pad='false'
		sm='12'
		xl='12'
	>

		<template #body>

			<v-row
				v-intersect='onIntersect'
				class='ma-0 pa-0 align-center justify-center'
				:class='{ "small-text": mobile }'
			>

				<v-col class='ma-0 pa-0 my-2 black-box py-3' cols='11' lg='9'>

					<v-row class='align-center ma-0 pa-0 no gutters justify-center'>

						<v-col class='ma-0 pa-0' cols='11'>

							<v-row class='align-center ma-0 pa-0 no gutters justify-center'>
								<v-col class='ma-0 pa-0' cols='auto'>
									<v-icon
										:class='{ "spin": localLoading }'
										:color='connectedColor'
										:icon='connectedIcon'
										:size='mobile ? "x-small" : "small"'
									/>

									<span
										class='ml-2 unselectable font-weight-bold'
										:class='`text-${connectedColor}`'
									>{{ connectedText }}</span>
								</v-col>

								<v-spacer />

								<template v-if='isConnected'>
									<v-col
										class='ma-0 pa-0 text-white unselectable text-body-small'
										:class='{ "small-text": mobile }'
										cols='auto'
									>
										send JSON as: <span class='font-weight-black'>{ "key" : "value" }</span>
									</v-col>
								</template>
							</v-row>
						</v-col>

					</v-row>

					<v-expand-transition>

						<v-row
							v-if='isConnected'
							class='ma-0 pa-0 mb-4 align-center justify-center'
							density='compact'
						>

							<v-col class='ma-0 pa-0' cols='11'>

								<v-row class='align-center ma-0 pa-0 unselectable justify-space-between' density='compact'>

									<v-col
										v-for='(item, index) in latencyRow'
										:key='index'
										class='ma-0 pa-0'
										cols='auto'
									>
										<v-icon class='mr-2' :color='item.color' :icon='item.icon' size='small' />
										<span class='text-white m-3'>{{ item.text }}: </span>

										<span
											v-if='item.value'
											class='font-weight-bold'
											:class='`text-${item.color}`'
										>{{ item.value
										}}</span>
									</v-col>
								</v-row>

								<v-col class='ma-0 pa-0 divider' cols='12' />

								<!-- TODO fix me, n? -->
								<v-row class='ma-0 pa-0 align-start messageboxn justify-start' density='compact'>

									<v-col class='ma-0 pa-0' cols='2'>
										<v-row class='align-start ma-0 pa-0 text-white unselectable justify-start'>
											<v-col class='ma-0 pa-0' cols='auto'>
												<CopyButton
													color='pi'
													:dark='true'
													:density='"compact"'
													:disabled='!message'
													:hover-message='`click to copy sent message`'
													:small='true'
													:to-copy='copySentMessage'
													:tooltip-message='"sent message copied!"'
												/>
											</v-col>

											<v-col class='ma-0 pa-0' cols='auto'>
												sent:
											</v-col>

										</v-row>
									</v-col>

									<v-col class=' text-pi ma-0 pa-0 font-weight-bold' cols='10'>
										<span v-if='device.structured_data'>{ "data" : {{ formatMessage(message) }}
											<span v-if='unique'>, "unique": true </span> }
										</span>

										<span v-else> {{ message }}</span>
									</v-col>

									<v-col class='ma-0 pa-0 divider' cols='12' />

									<v-col class='ma-0 pa-0' cols='2'>
										<v-row class='align-start ma-0 pa-0 text-white unselectable justify-start'>
											<v-col class='ma-0 pa-0' cols='auto'>
												<CopyButton
													color='primary'
													:dark='true'
													:density='"compact"'
													:disabled='!response'
													:hover-message='`click to copy response message`'
													:small='true'
													:to-copy='response'
													:tooltip-message='"response message copied!"'
												/>
											</v-col>

											<v-col class='ma-0 pa-0' cols='auto'>
												response:
											</v-col>
										</v-row>
									</v-col>

									<v-col v-if='response' class='ma-0 pa-0' cols='10'>

										<v-row class='align-start ma-0 pa-0 justify-space-around' density='compact'>
											<v-col class='ma-0 pa-0 text-primary font-weight-bold' cols='12'>
												{{ response }}
											</v-col>
										</v-row>
									</v-col>
								</v-row>

							</v-col>
						</v-row>
					</v-expand-transition>
				</v-col>
			</v-row>

			<v-row class='align-center ma-0 pa-0 justify-center' :class='{ "small-text": mobile }'>
				<v-row class='align-center ma-0 pa-0 no gutters justify-center'>
					<v-col v-if='device.device_password_required && !ws' class='ma-0 pa-0' cols='11' lg='9'>

						<v-form autocomplete='off' @submit.prevent>
							<v-text-field
								v-for='item in textFields'
								:key='item.model'
								v-model='password'
								:append-inner-icon='item.appendIcon'
								:autocomplete='item.autocomplete'
								:class='errorMessage.length > 0 ? "mb-n3" : "mb-n7"'
								color='primary'
								density='compact'
								:disabled='localLoading'
								:error='errorMessage.length > 0'
								:error-messages='errorMessage'
								:label='item.label'
								:prepend-inner-icon='item.icon'
								required
								:type='item.type'
								variant='outlined'
								@click:append-inner='passwordVisible = !passwordVisible'
								@keydown.enter='openWs'
							/>
						</v-form>
					</v-col>

					<v-col v-if='isConnected' class='ma-0 pa-0' cols='11' lg='9'>
						<v-row class='align-center ma-0 pa-0 no gutters justify-space-between'>
							<v-col class='ma-0 pa-0' cols='12'>
								<v-text-field
									v-model='message'
									:class='errorMessage.length > 0 ? "mb-n3" : "mb-n7"'
									clearable
									color='primary'
									:density='mobile ? "compact" : "default"'
									:disabled='localLoading'
									:error='errorMessage.length > 0'
									:error-messages='errorMessage'
									label='message'
									:prepend-inner-icon='mdiMessageReplyText'
									required
									type='text'
									variant='outlined'
									@keydown.enter='sendMessage'
									@update:model-value='clearResponse'
								/>
							</v-col>
						</v-row>

						<v-row
							v-if='device.structured_data'
							class='ma-0 pa-0 mb-n8 align-center justify-end'
							density='compact'
						>
							<v-col class='ma-0 pa-0' cols='auto'>
								<v-switch v-model='unique' color='primary' density='compact' :hide-details='true'>
									<template #label>
										<span
											class='font-weight-black text-body-small'
											:class='{ "text-primary": unique }'
										>unique</span>
									</template>
								</v-switch>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-row>
		</template>

		<template #button>
			<v-row class='align-center ma-0 pa-0 no gutters justify-center'>
				<v-col class='ma-0 pa-0' cols='11' lg='5'>
					<v-row class='align-center ma-0 pa-0 justify-space-around'>
						<v-col class='ma-0 pa-0' cols='6'>

							<ActionButton
								:block='true'
								color='pi'
								:disabled='localLoading'
								:icon='mdiClose'
								:icon-first='true'
								:small='true'
								text='close'
								@click='closeWs'
							/>
						</v-col>

						<v-col v-if='!isConnected' class='ma-0 pa-0' cols='6'>
							<ActionButton
								:block='true'
								color='primary'
								:disabled='connectDisabled || localLoading'
								:icon='mdiKey'
								:small='true'
								text='connect'
								@click='openWs'
							/>
						</v-col>

						<v-col v-else class='ma-0 pa-0' cols='6'>
							<ActionButton
								:block='true'
								color='primary'
								:disabled='localLoading || errorMessage.length > 0 || !message || sendDisabled'
								:icon='mdiSend'
								:small='true'
								text='send'
								@click='sendMessage'
							/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang='ts'>
import type { TDeviceInfo, TDialogFields } from '@/types'
import {
	mdiArrowDownBold, mdiArrowUpBold, mdiCheckboxBlankCircleOutline, mdiCheckCircle, mdiCircleHalfFull,
	mdiClose, mdiEye, mdiEyeOff, mdiKey, mdiLock, mdiMessageReplyText, mdiSend, mdiTimerOutline,
} from '@mdi/js'
import { parse } from 'secure-json-parse'
import { useDisplay } from 'vuetify'
import { axios_ws } from '@/services/axios'
import { snackError } from '@/services/snack'
import { convert_bytes } from '@/vanillaTS/convert_bytes'
import { env } from '@/vanillaTS/env'

const { mobile } = useDisplay()

onBeforeUnmount(() => {
	closeWs()
	updateExtra()
})

const byteSize_sent = computed(() => new Blob([message.value]).size)
const byteSize_response = computed(() => new Blob([response.value]).size)
const connectDisabled = computed(() => props.device.device_password_required && !password.value)
const connectedColor = computed(() => isConnected.value ? 'primary' : (localLoading.value ? 'secondary' : 'pi'))
const connectedIcon = computed(() => isConnected.value ? mdiCheckCircle : (localLoading.value ? mdiCircleHalfFull : mdiCheckboxBlankCircleOutline))
const connectedText = computed(() => isConnected.value ? 'connected' : (localLoading.value ? 'connecting...' : `not connected${props.device.device_password_required ? ' - password required' : ''}`))
const copySentMessage = computed((): string => {
	if (!props.device.structured_data) return message.value
	let output = `{ "data" : ${formatMessage(message.value)} }`
	if (unique.value) output += `, "unique": true }`
	return output
})

const isConnected = computed(() => connected.value)

const latencyRow = computed((): Array<{
	text: string
	value: string
	color: string
	icon: string
}> => [
	{
		text: 'latency',
		value: latency.value ? `${latency.value} ms` : '',
		color: 'secondary',
		icon: mdiTimerOutline,
	},
	{
		text: 'size sent',
		value: size_sent.value,
		color: 'pi',
		icon: mdiArrowUpBold,
	},
	{
		text: 'size response',
		value: size_response.value,
		color: 'primary',
		icon: mdiArrowDownBold,
	},
])
const sendDisabled = computed(() => byteSize_sent.value >= userModule().maxMessageSize && userModule().isFreeUser)

const size_sent = computed((): string => {
	const output = convert_bytes(byteSize_sent.value)
	return byteSize_sent.value === 0 ? '' : (output.total === '0' ? `${byteSize_sent.value}B` : `${output.total}${output.unit}`)
})
const size_response = computed((): string => {
	const output = convert_bytes(byteSize_response.value)
	return byteSize_response.value === 0 ? '' : (output.total === '0' ? `${byteSize_response.value}B` : `${output.total}${output.unit}`)
})
const textFields = computed((): Array<TDialogFields> => [
	{
		appendIcon: passwordVisible.value ? mdiEyeOff : mdiEye,
		autocomplete: 'new-password',
		icon: mdiLock,
		label: 'device password',
		model: 'password' as const,
		type: passwordVisible.value ? 'text' : 'password',
	},
])
const ttl = computed(() => deviceModule().get_ttl(props.device.name_of_device) > 0)

const authToken = ref('')
const connected = ref(false)
const errorMessage = ref('')
const isIntersecting = ref(false)
const latency = ref(0)
const localLoading = ref(false)
const message = ref('')
const password = ref('')
const passwordVisible = ref(false)
const response = ref('')
const sentTime = ref(0)
const unique = ref(false)
const ws: Ref<WebSocket | undefined> = ref(undefined)

function clearResponse (): void {
	response.value = ''
	sentTime.value = 0
	latency.value = 0
	errorMessage.value = ''
}
const emit = defineEmits(['cancel', 'update-extra-info', 'refresh'])

function closeWs (): void {
	ws.value?.close()
	ws.value = undefined
	response.value = ''
	message.value = ''
	connected.value = false
	latency.value = 0
	sentTime.value = 0
	emit('cancel')
}

function formatMessage (data: string): string {
	if (!props.device.structured_data) return data
	return data.startsWith('{') ? data : `"${data}"`
}

async function getAuthToken (): Promise<void> {
	errorMessage.value = ''
	const token = await axios_ws.auth({
		key: props.device.api_key,
		password: password.value,
	})
	password.value = ''
	if (token) authToken.value = token
	else {
		localLoading.value = false
		errorMessage.value = 'unable to generate access token'
		snackError({ message: 'unable to generate access token' })
	}
}

function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}

async function openWs (): Promise<void> {
	if (passwordVisible.value) passwordVisible.value = false
	localLoading.value = true
	await getAuthToken()
	if (!authToken.value) return
	const url = `${env.domain_wss}/client/${authToken.value}`
	authToken.value = ''
	ws.value = new WebSocket(url)

	ws.value.addEventListener('open', _event => {
		connected.value = true
		localLoading.value = false
		updateExtra()
	})

	ws.value.addEventListener('close', _event => {
		closeWs()
	})

	ws.value.addEventListener('error', _event => {
		closeWs()
		snackError({ message: 'websocket connection error' })
		localLoading.value = false
	})
	ws.value.addEventListener('message', async event => {
		if (sentTime.value) latency.value = Date.now() - sentTime.value
		sentTime.value = 0

		// If the response is an object, aka a buffer, attempt to convert the buffer back into text
		response.value = typeof event.data === 'object' ? (await event.data.text()) : String(event.data)
	})
}

function parser (input: string): unknown | never {
	try {
		const output = parse(input, undefined, {
			protoAction: 'remove',
			constructorAction: 'remove',
		})
		if (Object.keys(output).length === 0) throw new Error('Empty object')
		return output
	} catch {
		errorMessage.value = 'invalid message'
		return
	}
}

async function sendMessage (): Promise<void> {
	sentTime.value = Date.now()
	const data = message.value.startsWith('{') ? parser(message.value) : message.value
	if (!data) return snackError({ message: 'parsing error - invalid message' })
	if (props.device.structured_data) {
		const toSend = unique.value
			? JSON.stringify({
				data,
				unique: true,
			})
			: JSON.stringify({ data })
		if (!toSend) return snackError({ message: 'parsing error - invalid message' })
		ws.value?.send(toSend)
	} else ws.value?.send(message.value)
	updateExtra()
}

function updateExtra (): void {
	emit('update-extra-info')
	emit('refresh')
}

const props = defineProps<{
	device: TDeviceInfo
	maxConnected: boolean
}>()

watch(isIntersecting, (i: boolean): void => {
	if (i && !props.device.device_password_required) openWs()
})
watch(isConnected, (_i: boolean): void => {
	updateExtra()
})
watch(() => props.maxConnected, (i: boolean): void => {
	if (i && !isConnected.value) emit('cancel')
})
watch(message, (i: string): void => {
	if (!i) message.value = ''
})
watch(ttl, (i: boolean): void => {
	if (i) {
		closeWs()
	}
})
</script>

<style scoped>
.messagebox {
	max-height: 250px;
	overflow-y: auto;
	overflow-x: hidden;
}

.divider {
	border-top: 1px solid rgba(255, 255, 255, 0.25);
	width: 100%;
}

.black-box {
	background-color: rgba(0, 0, 0, .95);
	border-radius: .5rem;
}
</style>
