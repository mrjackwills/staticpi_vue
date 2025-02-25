<template>
	<AppCard xl='12' sm='12' md='11' lg='11' my='' :hasButton='true' :buttonJustify='"center"' :loading='localLoading' :pad='false'>
		
		<template v-slot:body>

			<v-row class='ma-0 pa-0' align='center' :class='{"small-text": mobile}' justify='center' v-intersect='onIntersect'>

				<v-col cols='11' lg='9' class='ma-0 pa-0 my-2 black-box py-3' >

					<v-row class='ma-0 pa-0 no gutters' align='center' justify='center'>

						<v-col cols='11' class='ma-0 pa-0'>

							<v-row class='ma-0 pa-0 no gutters' align='center' justify='center'>
								<v-col cols='auto' class='ma-0 pa-0' >
									<v-icon :size='mobile?"x-small":"small"' :color='connectedColor' :class='{"spin": localLoading}' :icon='connectedIcon' />
									<span class='ml-2 unselectable font-weight-bold' :class='`text-${connectedColor}`'>{{ connectedText }}</span>
								</v-col>
								<v-spacer />
								<template v-if='isConnected'>
									<v-col cols='auto' class='ma-0 pa-0 text-white unselectable text-caption' :class='{"small-text":mobile}'>
										send JSON as: <span class='font-weight-black'>{ "key" : "value" }</span>
									</v-col>
								</template>
							</v-row>
						</v-col>

					</v-row>

					<v-expand-transition>

						<v-row class='ma-0 pa-0 mb-4 no-gutters' align='center' justify='center' v-if='isConnected'>

							<v-col cols='11' class='ma-0 pa-0' >

								<v-row class='ma-0 pa-0 no-gutters unselectable' align='center' justify='space-between'>

									<v-col cols='auto' class='ma-0 pa-0' v-for='(item, index) in latencyRow' :key='index'>
										<v-icon size='small' class='mr-2' :color='item.color' :icon='item.icon' />
										<span class='text-white m-3'>{{ item.text }}: </span>
										<span :class='`text-${item.color}`' class='font-weight-bold' v-if='item.value'>{{ item.value }}</span>
									</v-col>
								</v-row>

								<v-col cols='12' class='ma-0 pa-0 divider' />

								<v-row class='ma-0 pa-0 no-gutters messagebox' align='start' justify='start' >

									<v-col cols='2' class='ma-0 pa-0'>
										<v-row align='start' justify='start' class='ma-0 pa-0 text-white unselectable'>
											<v-col cols='auto' class=' ma-0 pa-0'>
												<CopyButton
													:dark='true'
													:density='"compact"'
													:disabled='!message'
													:hoverMessage='`click to copy sent message`'
													:small='true'
													:toCopy='copySentMessage'
													:tooltipMessage='"sent message copied!"'
													color='pi'
												/>
											</v-col>
											<v-col cols='auto' class=' pl-2 ma-0 pa-0'>
												sent:
											</v-col>
												
										</v-row>
									</v-col>
									<v-col cols='10' class=' text-pi ma-0 pa-0 font-weight-bold'>
										<span v-if='device.structured_data'>{ "data" : {{ formatMessage(message) }}
											<span v-if='unique'>, "unique": true </span> }
										</span>
										<span v-else> {{ message }}</span>
									</v-col>

									<v-col cols='12' class='ma-0 pa-0 divider' />
								
									<v-col cols='2' class='ma-0 pa-0'>
										<v-row align='start' justify='start' class='ma-0 pa-0 text-white unselectable'>
											<v-col cols='auto' class='ma-0 pa-0'>
												<CopyButton
													:dark='true'
													:density='"compact"'
													:disabled='!response'
													:hoverMessage='`click to copy response message`'
													:small='true'
													:toCopy='response'
													:tooltipMessage='"response message copied!"'
													color='primary'
												/>
											</v-col>
											<v-col cols='auto' class='pl-2 ma-0 pa-0'>
												response:
											</v-col>
										</v-row>
									</v-col>
									<v-col cols='10' class='ma-0 pa-0' v-if='response'>

										<v-row class='ma-0 pa-0 no-gutters' align='start' justify='space-around' >
											<v-col cols='12' class='ma-0 pa-0 text-primary font-weight-bold'>
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
			<v-row class='ma-0 pa-0' align='center' :class='{"small-text": mobile}' justify='center'>
				<v-row class='ma-0 pa-0 no gutters' align='center' justify='center'>
					<v-col cols='11' lg='9' class='ma-0 pa-0'  v-if='device.device_password_required && !ws'>

						<v-form
							v-on:submit.prevent
							autocomplete='off'
						>
							<v-text-field
								v-for='item in textFields'
								v-model='password'
								@click:append-inner='passwordVisible = !passwordVisible'
								@keydown.enter='openWs'
								:append-inner-icon='item.appendIcon'
								:autocomplete='item.autocomplete'
								:class='errorMessage.length > 0 ? "mb-n3": "mb-n7"'
								:disabled='localLoading'
								:error='errorMessage.length > 0'
								:error-messages='errorMessage'
								:key='item.model'
								:label='item.label'
								:prepend-inner-icon='item.icon'
								:type='item.type'
								color='primary'
								density='compact'
								variant='outlined'
								required
							/>
						</v-form>
					</v-col>
					<v-col cols='11' lg='9' class='ma-0 pa-0' v-if='isConnected'>
						<v-row class='ma-0 pa-0 no gutters' align='center' justify='space-between'>
							<v-col cols='12' class='ma-0 pa-0'>
								<v-text-field
									v-model='message'
									@update:model-value='clearResponse'
									@keydown.enter='sendMessage'
									:density='mobile?"compact":"default"'
									:disabled='localLoading'
									:error='errorMessage.length > 0'
									:class='errorMessage.length > 0 ? "mb-n3": "mb-n7"'
									:error-messages='errorMessage'
									:prepend-inner-icon='mdiMessageReplyText'
									color='primary'
									label='message'
									type='text'
									variant='outlined'
									clearable
									required
								/>
							</v-col>
						</v-row>

						<v-row class='no-gutters ma-0 pa-0 mb-n8' align='center' justify='end' v-if='device.structured_data'>
							<v-col cols='auto' class='ma-0 pa-0'>
								<v-switch
									v-model='unique'
									color='primary'
									:hide-details='true'
									density='compact'
								>
									<template v-slot:label>
										<span class='font-weight-black text-caption' :class='{"text-primary":unique}'>unique</span>
									</template>
								</v-switch>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-row>
		</template>

		<template v-slot:button>
			<v-row class='ma-0 pa-0 no gutters' align='center' justify='center'>
				<v-col class='ma-0 pa-0' cols='11' lg='5'>
					<v-row class='ma-0 pa-0' align='center' justify='space-around'>
						<v-col cols='6' class='ma-0 pa-0'>

							<ActionButton
								@click='closeWs'

								:block='true'
								:disabled='localLoading'
								:icon='mdiClose'
								:iconFirst='true'
								color='pi'
								text='close'
								:small='true'
							/>
						</v-col>
						<v-col cols='6' class='ma-0 pa-0' v-if='!isConnected'>
							<ActionButton
					
								@click='openWs'
								:block='true'
								:disabled='connectDisabled||localLoading'
								:icon='mdiKey'
								color='primary'
								text='connect'
								:small='true'
							/>
						</v-col>
						<v-col cols='6' class='ma-0 pa-0' v-else>
							<ActionButton
								@click='sendMessage'
								:block='true'
								:disabled='localLoading||errorMessage.length > 0||!message||sendDisabled'
								:icon='mdiSend'
								color='primary'
								text='send'
								:small='true'
							/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang='ts'>
import { axios_ws } from '@/services/axios';
import { convert_bytes } from '@/vanillaTS/convert_bytes';
import { env } from '@/vanillaTS/env';
import { parse } from 'secure-json-parse';
import { snackError } from '@/services/snack';
import { useDisplay } from 'vuetify';
import type { TDeviceInfo, TDialogFields } from '@/types';
import {
	mdiArrowDownBold, mdiArrowUpBold, mdiCheckboxBlankCircleOutline, mdiCheckCircle, mdiCircleHalfFull,
	mdiClose, mdiEye, mdiEyeOff, mdiKey, mdiLock, mdiMessageReplyText, mdiSend, mdiTimerOutline 
} from '@mdi/js';

const { mobile } = useDisplay();

onBeforeUnmount(() => {
	closeWs();
	updateExtra();
});

const byteSize_sent = computed((): number => {
	return new Blob([ message.value ]).size;
});
const byteSize_response = computed((): number => {
	return new Blob([ response.value ]).size;
});
const connectDisabled = computed((): boolean => {
	return props.device.device_password_required && !password.value;
});
const connectedColor = computed((): string => {
	return isConnected.value ? 'primary' : localLoading.value ? 'secondary' : 'pi';
});
const connectedIcon = computed((): string => {
	return isConnected.value ? mdiCheckCircle : localLoading.value ? mdiCircleHalfFull : mdiCheckboxBlankCircleOutline;
});
const connectedText = computed((): string => {
	return isConnected.value ? 'connected' : localLoading.value ? 'connecting...' : `not connected${props.device.device_password_required ? ' - password required' : ''}`;
});
const copySentMessage = computed((): string => {
	if (!props.device.structured_data) return message.value;
	let output = `{ "data" : ${formatMessage(message.value)} }`;
	if (unique.value) output += `, "unique": true }`;
	return output;
});

const isConnected = computed((): boolean => {
	return connected.value;
});
		
const latencyRow = computed((): Array<{
	text: string;
	value: string;
	color: string;
	icon: string; 
}> => {
	return [
		{
			text: 'latency',
			value: latency.value ? `${latency.value} ms` : '',
			color: 'secondary',
			icon: mdiTimerOutline
		},
		{
			text: 'size sent',
			value: size_sent.value,
			color: 'pi',
			icon: mdiArrowUpBold
		},
		{
			text: 'size response',
			value: size_response.value,
			color: 'primary',
			icon: mdiArrowDownBold
		}
	];
});
const sendDisabled = computed((): boolean => {
	const user = userModule();
	return byteSize_sent.value >= user.maxMessageSize && user.isFreeUser;
});
const size_sent = computed((): string => {
	const output = convert_bytes(byteSize_sent.value);
	return byteSize_sent.value === 0 ? '' : output.total === '0' ? `${byteSize_sent.value}B` : `${output.total}${output.unit}`;
});
const size_response = computed((): string => {
	const output = convert_bytes(byteSize_response.value);
	return byteSize_response.value === 0 ? '' : output.total === '0' ? `${byteSize_response.value}B` : `${output.total}${output.unit}`;
});
const textFields = computed((): Array<TDialogFields> => {
	return [
		{
			appendIcon: passwordVisible.value ? mdiEyeOff : mdiEye,
			autocomplete: 'new-password',
			icon: mdiLock,
			label: 'device password',
			model: 'password' as const,
			type: passwordVisible.value ? 'text' : 'password'
		}
	];
});
const ttl = computed((): boolean => {
	return deviceModule().get_ttl(props.device.name_of_device) > 0;
});

const authToken = ref('');
const connected = ref(false);
const errorMessage = ref('');
const isIntersecting = ref(false);
const latency = ref(0);
const localLoading = ref(false);
const message = ref('');
const password = ref('');
const passwordVisible = ref(false);
const response = ref('');
const sentTime = ref(0);
const unique = ref(false);
const ws: Ref<WebSocket | undefined> = ref(undefined);

const clearResponse = (): void => {
	response.value = '';
	sentTime.value = 0;
	latency.value = 0;
	errorMessage.value = '';
};
const emit = defineEmits([ 'cancel', 'updateExtraInfo', 'refresh' ]);

const closeWs = (): void => {
	ws.value?.close();
	ws.value = undefined;
	response.value = '';
	message.value = '';
	connected.value = false;
	latency.value = 0;
	sentTime.value = 0;
	emit('cancel');
};

const formatMessage = (data: string): string => {
	if (!props.device.structured_data) return data;
	return data.startsWith('{') ? data : `"${data}"`;
};
	
const getAuthToken = async (): Promise<void> => {
	errorMessage.value = '';
	const token = await axios_ws.auth({
		key: props.device.api_key,
		password: password.value 
	});
	 
	password.value = '';
	if (token) authToken.value = token;
	else {
		localLoading.value = false;
		errorMessage.value = 'unable to generate access token';
		snackError({ message: 'unable to generate access token' });
	}
};

const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};
		
const openWs = async (): Promise<void> => {

	if (passwordVisible.value) passwordVisible.value = false;
	localLoading.value = true;
	await getAuthToken();
	if (!authToken.value) return;
	const url = `${env.domain_wss}/client/${authToken.value}`;
	authToken.value = '';
	ws.value = new WebSocket(url);

	ws.value.addEventListener('open', (_event) => {
		connected.value = true;
		localLoading.value = false;
		updateExtra();
	});

	ws.value.addEventListener('close', (_event) => {
		closeWs();
	});
			
	ws.value.addEventListener('error', (_event) => {
		closeWs();
		snackError({ message: 'websocket connection error' });
		localLoading.value = false;
	});
	ws.value.addEventListener('message', async (event) => {
		if (sentTime.value) latency.value = Date.now() - sentTime.value;
		sentTime.value = 0;

		// If the response is an object, aka a buffer, attempt to convert the buffer back into text
		if (typeof event.data === 'object') {
			response.value = await event.data.text();
		} else {
			response.value = String(event.data);
		}
	});
};

const parser = (input: string): unknown | never => {
	try {
		const output = parse(input, undefined, {
			protoAction: 'remove',
			constructorAction: 'remove' 
		});
		if (Object.keys(output).length === 0) throw Error('Empty object');
		return output;
	} catch (_e) {
		errorMessage.value = 'invalid message';
		return;
	}
};

const sendMessage = async (): Promise<void> => {
	sentTime.value = Date.now();
	const data = message.value.startsWith('{') ? parser(message.value) : message.value;
	if (!data) return snackError({ message: 'parsing error - invalid message' });
	if (props.device.structured_data) {
		const toSend = unique.value ? JSON.stringify({
			data,
			unique: true 
		}) : JSON.stringify({ data });
		if (!toSend) return snackError({ message: 'parsing error - invalid message' });
		ws.value?.send(toSend);
	} else ws.value?.send(message.value);
	updateExtra();
};

const updateExtra = (): void => {
	emit('updateExtraInfo');
	emit('refresh');
};

const props = defineProps<{
	device: TDeviceInfo;
	maxConnected: boolean; 
}>();

watch(isIntersecting, (i: boolean): void => {
	if (i && !props.device.device_password_required) openWs();
});
watch(isConnected, (_i: boolean): void => {
	updateExtra();
});
watch(() => props.maxConnected, (i: boolean): void => {
	if (i && !isConnected.value) emit('cancel');
});
watch(message, (i: string): void => {
	if (!i) message.value = '';
});
watch(ttl, (i: boolean): void => {
	if (i) {
		closeWs();
	}
});
</script>

<style scoped>
.messagebox{
	max-height: 250px;
	overflow-y: auto;
	overflow-x:hidden;
}

.divider{
	border-top: 1px solid rgba(255, 255, 255, 0.25);
	width: 100%;
}

.black-box{
	background-color: rgba(0,0,0,.95);
	border-radius: .5rem;
}

</style>