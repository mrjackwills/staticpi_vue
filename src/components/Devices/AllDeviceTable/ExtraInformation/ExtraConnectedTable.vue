<template>
	<v-row
		v-intersect='onIntersect'
		class='ma-0 pa-0 align-center justify-center'
		density='compact'
	>
		<v-col class='ma-0 pa-0' cols='12'>

			<v-row
				class='ma-0 pa-0 cl align-center'
				:class='justify'
				density='compact'
				@click='toggleHidden'
			>
				<v-col class='ma-0 pa-0' cols='auto'>
					<v-icon :color='iconColor' :icon />
				</v-col>

				<v-col class='mx-2 ma-0 pa-0 ' cols='auto' density='compact'>
					<SubHeading
						:color='iconColor'
						:heading
						heading-size='text-h7 unselectable'
						justify='start'
					/>
				</v-col>

				<v-col class='ma-0 pa-0' cols='auto'>
					<v-icon :class='{ "flipy": hidden }' :color='iconColor' :icon='mdiChevronDoubleUp' />
				</v-col>
			</v-row>

			<v-expand-transition>
				<section v-show='!hidden'>
					<v-divider class='' />

					<v-expand-transition>
						<v-fade-transition v-if='online && tableRows.length > 0' group tag='v-row'>

							<v-list-item
								v-for='(item, index) in tableRows'
								:key='index'
								class='ma-0 pa-0 '
								:class='{ "mt-n2": mdAndUp }'
								density='compact'
							>
								<v-row
									class='ma-0 pa-0 align-center justify-space-between'
									:class='{ "hover-row": mdAndUp }'
									density='compact'
								>
									<v-col class='ma-0 pa-0' cols='12' md='auto'>
										<span class='ma-0 pa-0' :class='{ "small-text": mobile }'>
											<ExtraOnlineSince :timestamp='item.timestamp_online' />
										</span>
									</v-col>

									<v-spacer />

									<v-col class='ma-0 pa-0 cl' cols='12' md='auto'>
										<span class='ma-0 pa-0' :class='{ "small-text": mobile }'>
											<ExtraIp v-if='item.ip' :ip='item.ip' />
										</span>
									</v-col>

									<v-col v-if='index + 1 !== tableRows.length' class='ma-0 pa-0' cols='12'>
										<v-divider class='ma-0 pa-0' />
									</v-col>
								</v-row>
							</v-list-item>

						</v-fade-transition>

						<template v-else>
							<v-col class='font-weight-bold text-uppercase small-text text-center ma-0 pa-0' cols='auto'>
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
import type { TExtraTableRow } from '@/types'
import type { VRow } from 'vuetify/components/VGrid'
import { mdiAccessPointNetwork, mdiAccessPointNetworkOff, mdiChevronDoubleUp, mdiPlaylistCheck, mdiPlaylistRemove } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mdAndUp, mobile, smAndDown } = useDisplay()

const heading = computed(() => props.isDevice ? 'pi connection' : `client connection${props.tableRows.length > 1 ? `s: ${props.tableRows.length}` : ''}`)
const icon = computed(() => props.isDevice ? (props.online ? mdiAccessPointNetwork : mdiAccessPointNetworkOff) : (props.online ? mdiPlaylistCheck : mdiPlaylistRemove))
const iconColor = computed(() => props.online ? 'primary' : 'pi')
const justify = computed(() => smAndDown.value ? 'justify-space-between' : 'justify-center')
const offlineMessage = computed(() => props.isDevice ? 'device' : 'all clients')

const hidden = ref(false)
const isIntersecting = ref(false)

function onIntersect (is_i: boolean, _entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver): void {
	isIntersecting.value = is_i
}

const emit = defineEmits(['hidden'])
function toggleHidden (): void {
	hidden.value = !hidden.value
	emit('hidden', hidden.value)
}

const props = withDefaults(defineProps<{
	isDevice?: boolean
	online?: boolean
	tableRows: Array<TExtraTableRow>
}>(), {
	isDevice: true,
	online: true,
})

watch(isIntersecting, (i: boolean): void => {
	if (!i) hidden.value = false
})
</script>

<style scoped>
.hover-row:hover {
	background-color: rgb(var(--v-theme-rowHover));
}
</style>
