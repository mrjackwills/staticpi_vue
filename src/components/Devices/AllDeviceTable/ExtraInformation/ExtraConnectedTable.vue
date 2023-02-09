<template>
	<v-row align='center' justify='center' class='ma-0 pa-0 no-gutters' v-intersect='onIntersect'>
		<v-col cols='12' class='ma-0 pa-0'>
			
			<v-row align='center' :justify='justify' class='ma-0 pa-0 no-gutters cl' @click='toggleHidden' >
				<v-col cols='auto' class='ma-0 pa-0'>
					<v-icon :color='iconColor' :icon='icon' />
				</v-col>
				<v-col cols='auto' class='mx-2 ma-0 pa-0 no-gutters'>
					<SubHeading
						:heading='heading'
						:heading_size='"text-h7 unselectable"'
						justify='start'
						:color='iconColor'
					/>
				</v-col>
				<v-col cols='auto' class='ma-0 pa-0'>
					<v-icon :color='iconColor' :class='{"flipy": hidden}' :icon='mdiChevronDoubleUp' />
				</v-col>
			</v-row>

			<v-expand-transition>
				<section v-show='!hidden'>
					<v-divider class='' />
					<v-expand-transition>
						<v-fade-transition group tag='v-row' v-if='online && tableRows.length > 0'  >

							<v-list-item
								v-for='(item, index) in tableRows'
								:key='index'
								density='compact'
								class='ma-0 pa-0 no-gutters'
								:class='{"mt-n2":mdAndUp}'
							>
								<v-row
									:class='{"hover-row":mdAndUp}'
									align='center'
									justify='space-between'
									class='ma-0 pa-0 no-gutters'
								>
									<v-col cols='12' md='auto' class='ma-0 pa-0'>
										<span :class='{"small-text": mobile}' class='ma-0 pa-0'>
											<ExtraOnlineSince :timestamp='item.timestamp_online'/>
										</span>
									</v-col>
									<v-spacer />
									<v-col cols='12' md='auto' class='ma-0 pa-0 cl' >
										<span :class='{"small-text": mobile}' class='ma-0 pa-0'>
											<ExtraIp v-if='item.ip' :ip='item.ip' />
										</span>
									</v-col>
									<v-col cols='12' class='ma-0 pa-0' v-if='index+1 !== tableRows.length'>
										<v-divider class='ma-0 pa-0' />
									</v-col>
								</v-row>
							</v-list-item>

						</v-fade-transition>
						<template v-else>
							<v-col cols='auto' class='font-weight-bold text-uppercase small-text text-center ma-0 pa-0'>
								{{ offlineMessage }} offline
							</v-col>
						</template>
					</v-expand-transition>
				</section>
			</v-expand-transition>
		</v-col>
	</v-row>

</template>

<script setup lang="ts">
import { mdiAccessPointNetwork, mdiAccessPointNetworkOff, mdiChevronDoubleUp, mdiPlaylistCheck, mdiPlaylistRemove } from '@mdi/js';
import { useDisplay } from 'vuetify';
import ExtraIp from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraIp.vue';
import ExtraOnlineSince from '@/components/Devices/AllDeviceTable/ExtraInformation/ExtraOnlineSince.vue';
import SubHeading from '@/components/Card/SubHeading.vue';
import type { TExtraTableRow, TJustify } from '@/types';

const { mdAndUp, mobile, smAndDown } = useDisplay();

const heading = computed((): string => {
	let suffix = props.tableRows.length>1 ? `s: ${props.tableRows.length}` : '';
	return props.is_device ? 'device connection' : `client connection${suffix}`;
});
const icon = computed((): string => {
	return props.is_device? props.online? mdiAccessPointNetwork : mdiAccessPointNetworkOff : props.online? mdiPlaylistCheck : mdiPlaylistRemove;
});
const iconColor = computed((): string => {
	return props.online ? 'primary' : 'pi';
});
const justify = computed((): TJustify => {
	return smAndDown.value ? 'space-between' : 'center';
});
const offlineMessage = computed((): string => {
	return props.is_device ? 'device' : 'all clients';
});

const hidden = ref(false);
const isIntersecting = ref(false);

const onIntersect = (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void => {
	isIntersecting.value = is_i;
};

const emit = defineEmits([ 'hidden' ]);
const toggleHidden = (): void => {
	hidden.value = !hidden.value;
	emit('hidden', hidden.value);
};

const props = defineProps({
	is_device: {
		type: Boolean,
		required: true
	},
	online: {
		type: Boolean,
		required: true
	},
	tableRows: {
		type: Array as () => Array<TExtraTableRow>,
		required: true,
	}
});

watch(isIntersecting, (i: boolean): void => {
	if (!i) hidden.value = false;
});
</script>

<style scoped>
.hover-row:hover {
	background-color: rgb(var(--v-theme-rowHover));
}
</style>