<template>
	<section
		class='text-caption unselectable'
		:class='computedClasses'
	>
		<v-row
			align='center'
			class='ma-0 pa-0'
			justify='center'
			no-gutters
			order='1'
		>
			<v-col
				class=''
				cols='auto'
			>
				<v-row align='center' class='no-gutters ma-0 pa-0' justify='center'>
					<v-col class='ma-0 pa-0 mr-1  mb-1 cl' cols='auto'>
						<a class='font-weight-bold' href='https://www.github.com/mrjackwills/staticpi_vue' rel='noopener noreferrer' target='_blank'>
							<v-icon :icon='mdiGithub' size='small' style='vertical-align: middle;' />
							<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
								<span class=''>see source code</span>
							</v-tooltip>
						</a>
					</v-col>
					<v-col class='ma-0 pa-0' cols='auto' @click='buildInfo'>
						<StaticPi color='' />
					</v-col>
					<v-col class='ma-0 pa-0 mx-1' cols='auto' @click='buildInfo'>
						<v-icon :icon='mdiCopyright' size='x-small' style='vertical-align: middle;' />
					</v-col>
					<v-col class='ma-0 pa-0' cols='auto' @click='buildInfo'>
						2020 -
					</v-col>

				</v-row>
			</v-col>
		</v-row>

		<v-row align='center' class='no-gutters unselectable ma-0 pa-0' justify='center'>
			<v-col class='ma-0 pa-0' cols='12'>

				<v-expand-transition>

					<v-row v-if='showBuild && authed' align='center' class='no-gutters ma-0 pa-0' justify='center'>
						<v-col v-for='(item, index) in rows' :key='index' class='ma-0 pa-0' cols='12'>
							<v-row
								align='center'
								class='ma-0 pa-0'
								justify='center'
								no-gutters
							>
								<v-col
									class='ma-0 pa-0'
									cols='auto'
								>
									{{ item.text }}
									<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
										<span>{{ item.tooltip }}</span>
									</v-tooltip>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-expand-transition>

			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import type { TFooterRow } from '@/types'
import { mdiCopyright, mdiGithub } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { env } from '@/vanillaTS/env'

const userStore = userModule()

onBeforeUnmount(() => {
	clearTimeout(buildTimeout.value)
})

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

const api_version = computed(() => browserModule().api_version)
const appVersion = computed(() => env.app_version)
const authed = computed(() => userStore.authenticated)
const buildDate = computed(() => env.build_date)
const computedClasses = computed(() => userStore.authenticated ? 'cl text-white' : '')
const rows = computed((): Array<TFooterRow> => [
	{
		text: String(appVersion.value),
		tooltip: 'site version',
		model: 'siteVersion' as const,
	},
	{
		text: buildDate.value,
		tooltip: 'site build date',
		model: 'buildDate' as const,
	},
	{
		text: String(api_version.value),
		tooltip: 'API version',
		model: 'apiVersion' as const,
	},
])

const buildTimeout = ref(0)
const showBuild = ref(false)

function buildInfo (): void {
	if (!authed.value) return
	clearTimeout(buildTimeout.value)
	showBuild.value = !showBuild.value
	buildTimeout.value = window.setTimeout(() => {
		showBuild.value = false
	}, 15_000)
}

</script>

<style scoped>
.v-tooltip__content {
	font-size: 11px !important;
	padding: 2px 6px 2px 6px!important;
}

a, a:visited, a:hover, a:active {
  color: inherit;
}
</style>
