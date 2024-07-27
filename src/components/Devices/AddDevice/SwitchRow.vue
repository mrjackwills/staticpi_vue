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
					:is='isComponent'
					@update:model-value='(x: string) => emit("input", x)'
					@client_passwordInput='(x: string) => emit("client_passwordInput", x)'
					@device_passwordInput='(x: string) => emit("device_passwordInput", x)'
				/>
			</section>
		</v-expand-transition>
	</section>
</template>

<script setup lang='ts'>
import DevicePassword from '@/components/Devices/AddDevice/DevicePassword.vue';
import MaxClients from '@/components/Devices/AddDevice/MaxClients.vue';

const switched = ref(false);

const emit = defineEmits([ 'switched', 'input', 'client_passwordInput', 'device_passwordInput' ]);

watch(switched, (i) => {
	emit('switched', i);
});

const isComponent = computed(() => {
	return props.component === 'DevicePassword' ? DevicePassword : MaxClients;
});

const props = defineProps<{
	description: string,
	disabled: boolean,
	heading: string,
	component: string,
	to?: string,
}>();

</script>

<style>
.theme--light.v-input--switch.v-input--is-disabled:not(.v-input--is-dirty) .v-input--switch__track {
	opacity: 1;
}
</style>