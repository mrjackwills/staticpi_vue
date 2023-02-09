<template>
	<section class='mb-1'>
		<v-row class='ma-0 pa-0' align='center' justify='center'>
			<v-col cols='12' md='8' class='ma-0 pa-0'>
				<v-row class='ma-0 pa-0'>
					<v-col cols='1' sm='auto' class='ma-0 pa-0' :class='mdAndUp? "mr-2" : "mr-1"'>
						<v-icon :color='iconColor' :size='smAndDown?"small":"default"' :icon='icon' />
					</v-col>
					<v-col cols='9' sm='auto' class='ma-0 pa-0'>
						<span :class='[textColor, textSize]'>{{ text }}</span>
					</v-col>
					<v-spacer />
					<v-col cols='1' sm='auto' class='ma-0 pa-0 text-pi'  v-if='active'>
						<v-row justify='end' class='pa-0 ma-0'>
							<v-col cols='auto' class='pa-0 ma-0'>
								<v-icon
									@click='click'
									:disabled='!online || backupProcess'
									size='small'
									color='pi'
									:icon='mdiCloseCircle'
								/>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import { browserModule, twoFAModule } from '@/store';
import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndDown } = useDisplay();

const backupProcess = computed((): boolean => {
	return twoFAModule().backupProcess;
});
const icon = computed((): string => {
	return props.active ? mdiCheckCircle: mdiAlertCircle;
});
const iconColor = computed((): string => {
	return props.active ? 'primary' : 'error';
});
const online = computed((): boolean => {
	return browserModule().online;
});
const textColor = computed((): string => {
	return props.active ? 'text-primary' : 'text-error';
});
const textSize = computed((): string => {
	return mdAndUp.value ? 'text-h6' : 'text-h7';
});

const emit = defineEmits([ 'click' ]);
const click = (): void => {
	emit('click');
};
const props = defineProps({
	active: {
		type: Boolean,
		required: true
	},
	text: {
		type: String,
		required: true
	},
});
</script>