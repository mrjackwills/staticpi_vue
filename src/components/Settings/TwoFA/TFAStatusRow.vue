<template>
	<section class='mb-1'>
		<v-row class='ma-0 pa-0' align='center' justify='center'>
			<v-col cols='12' md='8' class='ma-0 pa-0'>
				<v-row class='ma-0 pa-0'>
					<v-col cols='1' sm='auto' class='ma-0 pa-0' :class='mdAndUp ? "mr-2" : "mr-1"'>
						<v-icon :color='iconColor' :size='smAndDown ? "small" : "default"' :icon='icon' />
					</v-col>
					<v-col cols='9' sm='auto' class='ma-0 pa-0'>
						<span :class='[textColor, textSize]'>{{ text }}</span>
					</v-col>
					<v-spacer />
					<v-col cols='1' sm='auto' class='ma-0 pa-0 text-pi' v-if='active'>
						<v-row justify='end' class='pa-0 ma-0'>
							<v-col cols='auto' class='pa-0 ma-0'>
								<v-icon @click='click' :disabled='!online || backupProcess' size='small' color='pi'
									:icon='mdiCloseCircle' />
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndDown } = useDisplay();

const backupProcess = computed(() => twoFAModule().backupProcess);
const icon = computed(() => props.active ? mdiCheckCircle : mdiAlertCircle);
const iconColor = computed(() => props.active ? 'primary' : 'error');
const online = computed(() => browserModule().online);
const textColor = computed(() => props.active ? 'text-primary' : 'text-error');
const textSize = computed(() => mdAndUp.value ? 'text-h6' : 'text-h7');

const emit = defineEmits(['click']);
const click = (): void => {
	emit('click');
};

const props = defineProps<{
	active: boolean;
	text: string;
}>();
</script>