<template>
	<v-row v-intersect='onIntersect' class='align-center ma-0 pa-0 unselectable justify-center' density='compact'>
		<v-col class='ma-0 pa-0' :cols>

			<v-row class='align-center ma-0 pa-0  justify-center' density='compact'>

				<v-col class='ma-0 pa-0 cl' cols='12' md='auto' @click='toggleHidden'>

					<v-row
						v-if='showCalc'
						class='ma-0 pa-0 align-center'
						:class='justify'
						density='compact'
					>
						<v-col class='ma-0 pa-0' cols='auto'>
							<v-icon :color :icon='mdiSwapVerticalBold' />
						</v-col>
						<v-col class='mx-2 ma-0 pa-0' cols='auto'>
							<SubHeading
								:color
								heading='bandwidth'
								heading-size='text-h7 unselectable'
								justify='start'
							/>
						</v-col>
						<v-col class='ma-0 pa-0' cols='auto'>
							<v-icon :class='{ "flipy": hidden }' :color :icon='mdiChevronDoubleUp' />
						</v-col>
					</v-row>

				</v-col>

				<v-col v-if='showDetailSwitch' class='ma-0 pa-0 ml-2' cols='12' md='auto'>
					<v-switch v-model='switchDetailed' color='primary' density='compact' :hide-details='true'>
						<template #label>
							<span
								class='font-weight-black text-body-small'
								:class='{ "text-primary": switchDetailed }'
							>detailed</span>
						</template>
					</v-switch>
				</v-col>

			</v-row>

			<v-expand-transition>
				<section v-if='!hidden'>
					<v-divider class='mt-1' />

					<section v-if='switchDetailed'>
						<v-row class='align-center ma-0 pa-0 justify-space-between'>
							<v-col cols='2' />

							<v-col
								v-for='(item, index) in headers'
								:key='index'
								class='ma-0 pa-0 text-right'
								:class='{ "border-right": index !== 2 && !mobile }'
								cols='3'
							>
								<span class='font-weight-bold mr-1' :class='{ "small-text": mobile }'>
									{{ item }}
								</span>
							</v-col>
						</v-row>

						<v-row class='align-center ma-0 pa-0 justify-start'>
							<v-col class='ma-0 pa-0 text-right' cols='12'>
								<v-divider />
							</v-col>
						</v-row>
					</section>

					<component :is='isComponent' :device />

					<v-divider />

					<v-row
						v-if='(switchDetailed && showCalc)'
						class='ma-0 pa-0 align-center justify-center'
						density='compact'
					>
						<v-col class='text-center small-text font-italic unselectable' cols='auto ma-0 pa-0'>
							Only the sum of the received amount from both all clients and device is counted against your
							monthly
							bandwidth allowance
						</v-col>
					</v-row>

				</section>
			</v-expand-transition>

		</v-col>

	</v-row>

</template>

<script setup lang="ts">
import type { TDeviceInfo } from '@/types'
import type { VRow } from 'vuetify/components/VGrid'
import { mdiChevronDoubleUp, mdiSwapVerticalBold } from '@mdi/js'
import { useDisplay } from 'vuetify'
import ExtraBandwidthDetailed from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraBandwidthDetailed.vue'
import ExtraBandwidthSimple from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraBandwidthSimple.vue'

const { mobile } = useDisplay()

const color = 'primary'

const cols = computed(() => mobile.value || switchDetailed.value ? '12' : '4')
const justify = computed(() => mobile.value ? 'justify-space-between' : 'justify-center')
const showDetailSwitch = computed(() => !hidden.value)
const isComponent = computed(() => switchDetailed.value ? ExtraBandwidthDetailed : ExtraBandwidthSimple)

const headers = ['device', 'clients', 'all']
const hidden = ref(false)
const isIntersecting = ref(false)
const switchDetailed = ref(false)

function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}
const emit = defineEmits(['hidden'])

function toggleHidden (): void {
	hidden.value = !hidden.value
	emit('hidden', hidden.value)
}

withDefaults(defineProps<{
	device: TDeviceInfo
	showCalc?: boolean
}>(), { showCalc: true })

watch(isIntersecting, (i: boolean): void => {
	if (!i) {
		hidden.value = false
		switchDetailed.value = false
	}
})
</script>

<style>
.hover-row:hover {
	background-color: rgb(var(--v-theme-rowHover));
}

.bandwidth-text {
	font-size: .75rem;
}

.border-right {
	border-right: 3px solid rgba(0, 0, 0, .15)
}
</style>
