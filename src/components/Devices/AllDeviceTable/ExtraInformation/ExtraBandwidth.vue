<template>
	<v-row align='center' justify='center' class='ma-0 pa-0 no-gutters unselectable' v-intersect='onIntersect'>
		<v-col :cols='cols' class='ma-0 pa-0'>

			<v-row align='center' justify='center' class='ma-0 pa-0 no-gutters'>

				<v-col cols='12' md='auto' class='ma-0 pa-0 cl' @click='toggleHidden'>

					<v-row align='center' :justify='justify' class='ma-0 pa-0 no-gutters' v-if='show_calc'>
						<v-col cols='auto' class='ma-0 pa-0'>
							<v-icon :color='color' :icon='mdiSwapVerticalBold' />
						</v-col>
						<v-col cols='auto' class='mx-2 ma-0 pa-0'>
							<SubHeading heading='bandwidth' :heading_size='"text-h7 unselectable"' justify='start'
								:color='color' />
						</v-col>
						<v-col cols='auto' class='ma-0 pa-0'>
							<v-icon :color='color' :class='{ "flipy": hidden }' :icon='mdiChevronDoubleUp' />
						</v-col>
					</v-row>

				</v-col>

				<v-col cols='12' md='auto' class='ma-0 pa-0 ml-2' v-if='showDetailSwitch'>
					<v-switch v-model='switchDetailed' :hide-details='true' color='primary' density='compact'>
						<template v-slot:label>
							<span class='font-weight-black text-caption'
								:class='{ "text-primary": switchDetailed }'>detailed</span>
						</template>
					</v-switch>
				</v-col>

			</v-row>

			<v-expand-transition>
				<section v-if='!hidden'>
					<v-divider class='mt-1' />

					<section v-if='switchDetailed'>
						<v-row class='ma-0 pa-0' justify='space-between' align='center'>
							<v-col cols='2' />

							<v-col class='ma-0 pa-0 text-right' :class='{ "border-right": index !== 2 && !mobile }'
								cols='3' v-for='(item, index) in headers' :key='index'>
								<span class='font-weight-bold mr-1' :class='{ "small-text": mobile }'>
									{{ item }}
								</span>
							</v-col>
						</v-row>

						<v-row class='ma-0 pa-0' justify='start' align='center'>
							<v-col class='ma-0 pa-0 text-right' cols='12'>
								<v-divider />
							</v-col>
						</v-row>
					</section>

					<component :is='isComponent' :device='device' />

					<v-divider />

					<v-row v-if='(switchDetailed && show_calc)' class='ma-0 pa-0 no-gutters' align='center'
						justify='center'>
						<v-col cols='auto ma-0 pa-0' class='text-center small-text font-italic unselectable'>
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
import { mdiChevronDoubleUp, mdiSwapVerticalBold } from '@mdi/js';
import ExtraBandwidthDetailed from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraBandwidthDetailed.vue';
import ExtraBandwidthSimple from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraBandwidthSimple.vue';
import { useDisplay } from 'vuetify';
import type { TDeviceInfo } from '@/types';
import type { VRow } from 'vuetify/components/VGrid';

const { mobile } = useDisplay();

const color = 'primary';

const cols = computed(() => mobile.value || switchDetailed.value ? '12' : '4');
const justify = computed(() => mobile.value ? 'space-between' : 'center');
const showDetailSwitch = computed(() => !hidden.value);
const isComponent = computed(() => switchDetailed.value ? ExtraBandwidthDetailed : ExtraBandwidthSimple);

const headers = ['device', 'clients', 'all'];
const hidden = ref(false);
const isIntersecting = ref(false);
const switchDetailed = ref(false);

const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};
const emit = defineEmits(['hidden']);

const toggleHidden = (): void => {
	hidden.value = !hidden.value;
	emit('hidden', hidden.value);
};

withDefaults(defineProps<{
	device: TDeviceInfo;
	show_calc?: boolean;
}>(), { show_calc: true });

watch(isIntersecting, (i: boolean): void => {
	if (!i) {
		hidden.value = false;
		switchDetailed.value = false;
	}
});
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
