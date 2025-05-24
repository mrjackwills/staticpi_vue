<template>
	<v-row align='center' justify='start' class='ma-0 pa-0 pl-2'>
		<v-col cols='12' class='ma-0 pa-0'>
			<v-row align='center' justify='start' class='ma-0 pa-0'>
				<v-col v-if='smAndUp' cols='2' lg='1' class='ma-0 pa-0' :order='order_icon'>
					<v-icon :color='color' :icon='icon' />
				</v-col>
				<v-col cols='12' sm='10' class='ma-0 pa-0' :order='order_detail'>
					<span class='' :class='`text-${color}`'>{{ detail }}</span>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { mdiCheck, mdiMinus } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndUp } = useDisplay();

const color = computed(() => props.freePlan ? 'error' : 'primary');
const icon = computed(() => props.freePlan ? mdiMinus : mdiCheck);
const order_icon = computed(() => mdAndUp.value ? '1' : '2');
const order_detail = computed(() => mdAndUp.value ? '2' : '1');

const props = defineProps<{
	freePlan: boolean;
	detail: string;
}>();
</script>
