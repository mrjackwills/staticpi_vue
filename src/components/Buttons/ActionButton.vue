<template>
	<v-row class='align-center ma-0 pa-0 justify-center' density='compact'>
		<v-col
			class='ma-0 pa-0'
			cols='11'
			md='auto'
			@mouseleave='mouseleave'
			@mouseover='mouseover'
		>
			<v-btn
				:block
				class='elevation-0'
				:color
				:disabled='disabled && !overrideDisabled || !online && !overrideDisabled'
				rounded
				:size='buttonSize'
				:to='routerLink'
				:variant='disabled?"outlined":"flat"'
				@click='click'
			>
				<v-row
					class='ma-1 align-center justify-center'
				>
					<v-col
						v-if='icon'
						class='ma-0 pa-0 align-self-center'
						:class='iconClass'
						cols='auto'
						:order='iconOrder'
					>
						<v-icon
							:class='flipx'
							:icon
						/>
					</v-col>
					<v-col
						class='ma-0 pa-0 align-self-center'
						cols='auto'
						:order='textOrder'
					>
						<v-row
							class='ma-0 pa-0 align-center justify-center'
							density='compact'
						>
							<v-col class='ma-0 pa-0' cols='auto'>
								<div class='text-body-large' :color='disabled?"text-grey":"text-cardColor"'>
									<span :class='{"countdown" : monospace}'>{{ text }}</span>
								</div>
							</v-col>
						</v-row>
					</v-col>

				</v-row>
			</v-btn>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify'

const { mdAndUp, smAndDown } = useDisplay()

const buttonSize = computed(() => mdAndUp.value && !props.small ? 'large' : (smAndDown.value || props.small ? 'small' : 'default'))
const iconClass = computed(() => props.iconFirst ? 'mr-1' : 'ml-1')
const iconOrder = computed(() => props.iconFirst ? '1' : '2')
const flipx = computed(() => props.text === 'logout' ? 'flipx' : '')
const online = computed(() => browserModule().online)
const textOrder = computed(() => props.iconFirst ? '2' : '1')

const localDisabled = ref(false)

const emit = defineEmits(['click', 'mouseleave', 'mouseover'])
function click (): void {
	if (!props.routerLink) emit('click')
}
function mouseleave (): void {
	if (props.mouseOverEvents) emit('mouseleave')
}
function mouseover (): void {
	if (props.mouseOverEvents) emit('mouseover')
}

onMounted(() => {
	localDisabled.value = props.disabled
})

const props = withDefaults(defineProps<{
	block?: boolean
	color?: string
	disabled?: boolean
	icon?: string
	iconFirst?: boolean
	monospace?: boolean
	mouseOverEvents?: boolean
	overrideDisabled?: boolean
	routerLink?: string
	small?: boolean
	text?: string
}>(), {
	block: false,
	color: 'primary',
	disabled: false,
	iconFirst: false,
	monospace: false,
	mouseOverEvents: false,
	overrideDisabled: false,
	small: false,
	text: 'submit',
})

watch(() => props.disabled, i => {
	localDisabled.value = i
})

</script>

<style scoped>

/* Change disabled button color from default, to one that's slightly darker */
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
	background-color: rgba(0, 0, 0, .2) !important;
}

.countdown{
	font-feature-settings: 'tnum';
	font-variant-numeric: tabular-nums;
}
</style>
