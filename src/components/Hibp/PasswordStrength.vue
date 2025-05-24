<template>
	<v-row class='pa-0 ma-0' justify='center' align='center' dense no-gutters>
		<v-col cols='12' class='px-1 mb-3' :class='{ "mt-n4": errorMessage.length === 0 }'>
			<v-progress-linear :color='passStrengthColor' :model-value='passStrength' rounded />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>

onUnmounted(() => {
	passStrength.value = 0;
});
onMounted(() => {
	passStrength.value = calc_strength();
});
const passStrength = computed({
	get (): number {
		return passwordStrengthModule().strength;
	},
	set (n: number): void {
		passwordStrengthModule().set_strength(n);
	}
});

const passStrengthColor = computed(() => props.errorMessage || passStrength.value < 35 ? 'error' : passStrength.value < 80 ? 'blue' : 'primary');

const calc_strength = (): number => {
	if (!props.password) return 1;

	const length = props.password.length;
	const lower = /[a-z]+/g;
	const numbers = /\d+/g;
	const symbols = /\W+/g;
	const upper = /[A-Z]+/g;
	const scores = {
		lowerScore: props.password.match(lower) ? 1.25 : 1,
		numbersScore: props.password.match(numbers) ? 1.5 : 1,
		symbolsScore: props.password.match(symbols) ? 1.6 : 1,
		upperScore: props.password.match(upper) ? 1.55 : 1
	};
	return scores.lowerScore * scores.upperScore * scores.symbolsScore * scores.numbersScore * (length * 0.75);
};

const props = defineProps<{
	passwordCompromised: boolean;
	password: string;
	errorMessage: string;
}>();

watch(() => props.password, (): void => {
	passStrength.value = calc_strength();
});
</script>
