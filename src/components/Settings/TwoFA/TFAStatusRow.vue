<template>
	<section class='mb-1'>
		<v-row class='align-center ma-0 pa-0 justify-center'>
			<v-col class='ma-0 pa-0' cols='12' md='8'>
				<v-row class='ma-0 pa-0'>
					<v-col class='ma-0 pa-0' :class='mdAndUp ? "mr-2" : "mr-1"' cols='1' sm='auto'>
						<v-icon :color='iconColor' :icon :size='smAndDown ? "small" : "default"' />
					</v-col>
					<v-col class='ma-0 pa-0' cols='9' sm='auto'>
						<span :class='[textColor, textSize]'>{{ text }}</span>
					</v-col>
					<v-spacer />
					<v-col v-if='active' class='ma-0 pa-0 text-pi' cols='1' sm='auto'>
						<v-row class='pa-0 ma-0 justify-end'>
							<v-col class='pa-0 ma-0' cols='auto'>
								<v-icon
									color='pi'
									:disabled='!online || backupProcess'
									:icon='mdiCloseCircle'
									size='small'
									@click='click'
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
import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mdAndUp, smAndDown } = useDisplay()

const backupProcess = computed(() => twoFAModule().backupProcess)
const icon = computed(() => props.active ? mdiCheckCircle : mdiAlertCircle)
const iconColor = computed(() => props.active ? 'primary' : 'error')
const online = computed(() => browserModule().online)
const textColor = computed(() => props.active ? 'text-primary' : 'text-error')
const textSize = computed(() => mdAndUp.value ? 'text-headline-small' : 'text-h7')

const emit = defineEmits(['click'])
function click (): void {
	emit('click')
}

const props = defineProps<{
	active: boolean
	text: string
}>()
</script>
