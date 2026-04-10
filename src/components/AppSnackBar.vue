<template>
	<v-snackbar
		v-model='visible'
		class='ma-0 pa-0'
		:class='[margin, { "mr-2": isDesktop }]'
		content-class='tooltip_bottom'
		:location='snack_location??"bottom center"'
		:multi-line='isDesktop'
		:timeout='timeoutValue'
		:top='position.y === "top"'
	>
		<v-row
			class='ma-0 pa-0 align-center justify-center'
			density='compact'
			style='height:100%'
		>
			<v-col class='ma-0 pa-0  px-2 unselectable' cols='12'>
				<v-row class='px-1 justify-center align-center' density='compact'>
					<v-col v-if='loading' class='pa-0 mr-2' cols='auto'>
						<v-progress-circular color='primary' indeterminate :size='18' :width='3' />
					</v-col>
					<v-col v-if='icon && isDesktop && !loading' class='pa-0 ma-0' cols='auto'>
						<v-icon class='mr-2' :color :icon />
					</v-col>
					<v-col class='pa-0' cols='auto'>
						<div class='text-center text-white'> {{ message }}</div>
					</v-col>
					<v-col v-if='closable && isDesktop' class='pa-0 ma-0' cols='auto'>
						<v-icon
							class='ml-2'
							color='white'
							:icon='mdiClose'
							size='small'
							@click='visible = false'
						/>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-snackbar>
</template>

<script setup lang='ts'>
import type { VDialog } from 'vuetify/components'
import { mdiClose } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mdAndUp, smAndDown } = useDisplay()

const [snackbarStore, userStore] = [snackbarModule(), userModule()]
onBeforeUnmount(() => {
	clearInterval(localInterval.value)
	clearInterval(reloadTimeout.value)
})
const authenticated = computed(() => userStore.authenticated)
const closable = computed(() => snackbarStore.closable)
const color = computed(() => snackbarStore.color)
const icon = computed(() => snackbarStore.icon)
const isDesktop = computed(() => mdAndUp.value)
const loading = computed(() => snackbarStore.loading)

// Not sure if this is correct, but satisfies the type checker
const snack_location = computed((): VDialog['$props']['location'] => {
	const x = snackbarStore.position.x ?? 'left'
	const y = snackbarStore.position.y ?? 'bottom'
	return mdAndUp.value ? `${y} ${x}` : `bottom center`
})
const margin = computed(() => smAndDown.value || !authenticated.value ? '' : (navDrawerModule().mini ? 'mini_margin' : 'margin'))
const message = computed({
	get (): string {
		return snackbarStore.message
	},
	set (s: string): void {
		snackbarStore.set_message(s)
	},
})
const position = computed(() => snackbarStore.position)
const timeoutValue = computed(() => snackbarStore.timeout)

const visible = computed({
	get (): boolean {
		return snackbarStore.visible
	},
	set (b: boolean): void {
		snackbarStore.set_visible(b)
	},
})

const localInterval = ref(0)
const reloadTimeout = ref(0)

</script>

<style>
.v-snack__content {
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.margin {
	margin-left: 90px !important
}

.mini_margin {
	margin-left: 28px !important
}

.tooltip_bottom {
	bottom: 10px !important
}
</style>
