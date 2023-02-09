<template>
	<section class='' >
		<section class=''>
			<v-row align='center' justify='start' class='ma-0 pa-0'>
				<v-col cols='auto' class=''>
					<v-switch
						v-model='switched'
						:disabled='disabled'
						:hide-details='true'
						color='primary'
						density='compact'
					>
						<template v-slot:label>
							<span class='font-weight-black' :class='switched? "text-primary":"text-pi"'>{{ heading }}</span>
						</template>
			
					</v-switch>
				</v-col>
				<v-spacer />
				<v-col cols='auto' class='ma-0 pa-0' v-if='to'>
					<DocumentationLink :section='to' />
				</v-col>
			</v-row>
			<div class='mt-n3 mb-2 unselectable'>{{ description }}</div>
		</section>
		<v-expand-transition>
			<section v-if='switched && component' class=''>
				<component
					@update:model-value='input_method'
					@client_passwordInput='client_passwordInput'
					@device_passwordInput='device_passwordInput'
					:is='isComponent'
				/>
			</section>
		</v-expand-transition>
	</section>
</template>

<script setup lang='ts'>
import DevicePassword from '@/components/Devices/AddDevice/DevicePassword.vue';
import DocumentationLink from '@/components/Buttons/DocumentationLink.vue';
import MaxClients from '@/components/Devices/AddDevice/MaxClients.vue';

const switched = ref(false);

const emit = defineEmits([ 'switched', 'input', 'client_passwordInput', 'device_passwordInput' ]);
const input_method = (i: string): void => {
	emit('input', i);
};

const client_passwordInput = (i: string): void => {
	emit('client_passwordInput', i);
};
const device_passwordInput = (i: string): void => {
	emit('device_passwordInput', i);
};

watch(() => switched.value, (i) => {
	emit('switched', i);
});

const isComponent = computed(() => {
	if (props.component === 'DevicePassword') {
		return DevicePassword;
	} if (props.component === 'MaxClients') {
		return MaxClients;
	}
});

const props = defineProps({
	description: {
		type: String,
		required: true
	},
	disabled: {
		type: Boolean,
		required: true
	},
	heading: {
		type: String,
		required: true,
	},
	component: {
		type: String,
		required: true,
	},
	to: {
		type: String,
		default: ''
	}
});
</script>

<style>
.theme--light.v-input--switch.v-input--is-disabled:not(.v-input--is-dirty) .v-input--switch__track {
	opacity: 1;
}
</style>