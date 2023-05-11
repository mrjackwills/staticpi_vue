<template>
	<v-row class='ma-0 pa-0' align='center' justify='center' no-gutters>
		<v-col
			@mouseover='mouseover'
			@mouseleave='mouseleave'
			class='ma-0 pa-0'
			cols='11'
			md='auto'
		>
			<v-btn
				@click='click'
				:block='block'
				:color='color'
				:disabled='disabled && !overrideDisabled || !online && !overrideDisabled'
				:size='buttonSize'
				:to='routerLink'
				:variant='disabled?"outlined":"flat"'
				class='elevation-0'
				rounded
			>
				<v-row
					align='center'
					class='ma-1'
					justify='center'
				>
					<v-col
						v-if='icon'
						:class='iconClass'
						:order='iconOrder'
						align-self='center'
						class='ma-0 pa-0'
						cols='auto'
					>
						<v-icon
							:class='flipx'
							:icon='icon'
						/>
					</v-col>
					<v-col
						:order='textOrder'
						align-self='center'
						class='ma-0 pa-0'
						cols='auto'

					>
						<v-row justify='center' align='center' class='ma-0 pa-0' no-gutters dense >
							<v-col cols='auto' class='ma-0 pa-0'>
								<div class='text-body-1' :color='disabled?"text-grey":"text-cardColor"'>
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
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndDown } = useDisplay();

const buttonSize = computed(() => {
	if (mdAndUp.value && !props.small) {
		return 'large';
	}
	if (smAndDown.value || props.small) {
		return 'small';
	}
	return 'default';

});

const iconClass = computed((): string => {
	return props.iconFirst ? 'mr-1' : 'ml-1';
});
const iconOrder = computed((): string => {
	return props.iconFirst ? '1' : '2';
});
const flipx = computed((): string => {
	return props.text === 'logout' ? 'flipx' :'';
});
const online = computed((): boolean => {
	return browserModule().online;
});
const textOrder = computed((): string => {
	return props.iconFirst ? '2' : '1';
});

const localDisabled = ref(false);

const emit = defineEmits([ 'click', 'mouseleave', 'mouseover' ]);
const click = (): void => {
	if (!props.routerLink) emit('click');
};
const mouseleave = (): void => {
	if (props.mouseOverEvents) emit('mouseleave');
};
const mouseover = (): void => {
	if (props.mouseOverEvents) emit('mouseover');
};

onMounted(() => {
	localDisabled.value = props.disabled;

});

const props = withDefaults(defineProps<{
	block: boolean,
	color: string,
	disabled: boolean,
	icon?: string,
	iconFirst: boolean,
	monospace: boolean,
	mouseOverEvents: boolean,
	overrideDisabled: boolean,
	routerLink?: string
	small: boolean,
	text: string
}>(), {
	block: false,
	color: 'primary',
	disabled: false,
	iconFirst: false,
	monospace: false,
	mouseOverEvents: false,
	overrideDisabled: false,
	small: false,
	text: 'submit'
});

watch(() => props.disabled, (i) => {
	localDisabled.value = i;
});

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