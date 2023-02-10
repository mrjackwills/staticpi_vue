<template>
	<section
		
		class='text-caption unselectable'
		:class='computedClasses'
	>
		<v-row justify='center' align='center' class='ma-0 pa-0' no-gutters order='1'>
			<v-col
				class=''
				cols='auto'
			>
				<v-row align='center' justify='center' class='no-gutters ma-0 pa-0'>
					<v-col class='ma-0 pa-0 mr-1  mb-1 cl' cols='auto'>
						<a href='https://www.github.com/mrjackwills/staticpi_vue' target='_blank' rel='noopener noreferrer' class='font-weight-bold'>
							<v-icon style='vertical-align: middle;' size='small' :icon='mdiGithub' />
							<v-tooltip activator='parent' location='top center' class='tooltip-z'>
								<span class=''>see code source</span>
							</v-tooltip>
						</a>
					</v-col>
					<v-col class='ma-0 pa-0' cols='auto' @click='buildInfo' >
						<StaticPi color=''/>
					</v-col>
					<v-col class='ma-0 pa-0 mx-1' cols='auto' @click='buildInfo' >
						<v-icon style='vertical-align: middle;' size='x-small' :icon='mdiCopyright' />
					</v-col>
					<v-col class='ma-0 pa-0' cols='auto' @click='buildInfo'>
						2020 -
					</v-col>
				
				</v-row>
			</v-col>
		</v-row>
				
		<v-row justify='center' align='center' class='no-gutters unselectable ma-0 pa-0'>
			<v-col cols='12' class='ma-0 pa-0'>
		
				<v-expand-transition>

					<v-row justify='center' align='center' class='no-gutters ma-0 pa-0' v-if='showBuild && authed'>
						<v-col cols='12' class='ma-0 pa-0' v-for='(item, index) in rows' :key='index'>
							<v-row
								no-gutters
								justify='center'
								align='center'
								class='ma-0 pa-0'
							>
								<v-col
									cols='auto'
									class='ma-0 pa-0'
								>
									{{ item.text }}
									<v-tooltip activator='parent' location='top center' class='tooltip-z'>
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
import { browserModule, userModule } from '@/store';
import { env } from '@/vanillaTS/env';
import { mdiCopyright, mdiGithub } from '@mdi/js';
import StaticPi from '@/components/StaticPi.vue';
import type { TFooterRow } from '@/types';

const userStore = userModule();

onBeforeUnmount(() => {
	clearTimeout(buildTimeout.value);
});

const api_version = computed((): string|undefined => {
	return browserModule().api_version;
});
const appVersion = computed((): string => {
	return env.app_version;
});
const authed = computed((): boolean => {
	return userStore.authenticated;
});
const buildDate = computed((): string => {
	return env.build_date;
});
const computedClasses = computed((): string => {
	return userStore.authenticated ? 'cl text-white' : '';
});
const rows = computed((): Array<TFooterRow> => {
	return [
		{
			text: String(appVersion.value),
			tooltip: 'site version',
			model: 'siteVersion' as const
		},
		{
			text: buildDate.value,
			tooltip: 'site build date',
			model: 'buildDate' as const
		},
		{
			text: String(api_version.value),
			tooltip: 'api version',
			model: 'apiVersion' as const
		}
	];
});

const buildTimeout = ref(0);
const showBuild = ref(false);

const buildInfo = (): void => {
	if (!authed.value) return;
	clearTimeout(buildTimeout.value);
	showBuild.value = !showBuild.value;
	buildTimeout.value = setTimeout(() => {
		showBuild.value = false;
	}, 15000);
};

</script>

<style scoped >
.v-tooltip__content {
	font-size: 11px !important;
	padding: 2px 6px 2px 6px!important;
}

a, a:visited, a:hover, a:active {
  color: inherit;
}
</style>