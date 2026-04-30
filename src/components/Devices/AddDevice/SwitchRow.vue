<template>
	<section class=''>
		<section class=''>
			<v-row class='align-center ma-0 pa-0 justify-start'>
				<v-col class='' cols='auto'>
					<v-switch
						v-model='switched'
						color='primary'
						density='compact'
						:disabled
						:hide-details='true'
					>
						<template #label>
							<span class='font-weight-black' :class='switched? "text-primary":"text-pi"'>{{ heading }}</span>
						</template>

					</v-switch>
				</v-col>

				<v-spacer />

				<v-col v-if='to' class='ma-0 pa-0' cols='auto'>
					<DocumentationLink :section='to' />
				</v-col>
			</v-row>

			<div class='mt-n3 mb-2 unselectable'>{{ description }}</div>
		</section>

		<v-expand-transition>
			<section v-if='switched && component' class=''>
				<component
					:is='isComponent'
					@client-password-input='(x: string) => emit("client-password-input", x)'
					@device-password-input='(x: string) => emit("device-password-input", x)'
					@input='(x: string) => emit("input", x)'
				/>
			</section>
		</v-expand-transition>
	</section>
</template>

<script setup lang='ts'>
import DevicePassword from '@/components/Devices/AddDevice/DevicePassword.vue'
import MaxClients from '@/components/Devices/AddDevice/MaxClients.vue'

const switched = ref(false)

const emit = defineEmits(['switched', 'input', 'client-password-input', 'device-password-input'])

watch(switched, i => {
	emit('switched', i)
})

const isComponent = computed(() => props.component === 'DevicePassword' ? DevicePassword : (props.component === 'MaxClients' ? MaxClients : null))

const props = defineProps<{
	description: string
	disabled: boolean
	heading: string
	component: string
	to?: string
}>()

</script>

<style>
.theme--light.v-input--switch.v-input--is-disabled:not(.v-input--is-dirty) .v-input--switch__track {
	opacity: 1;
}
</style>
