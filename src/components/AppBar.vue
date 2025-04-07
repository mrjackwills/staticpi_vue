
<template>
	<v-app-bar
		:extended='!online'
		:height='appbarHeight'
		extension-height='40'
		color='pi'
		app
		clipped-left
		dark
		flat
	>
		<v-toolbar-title
			@click='goHome'
			class='cl pa-0'
		>
			<v-row align='center' justify='start' no-gutters class='pa-0 ma-0'>
				<v-col
					:class='logoMargin'
					class=''
					cols='auto'
				>
					<v-img
						src='@/assets/svg/app_bar_logo.svg'
						:eager='true'
						:width='logoSize'
						:height='logoSize'
					/>
				</v-col>
				<v-col cols='auto' class='unselectable text-h4' align-self='center'>
					<StaticPi color=''/>
				</v-col>
			</v-row>
		</v-toolbar-title>

		<v-toolbar-items>
			<template v-if='authenticated && email && onDesktop' >
				<v-row align='center'  class='mr-2'>
					<v-col cols='auto' class='mr-3' @click='goSettings'>
						<v-chip color='primary cl text-subtitle-1' variant='flat'>
							<v-row align='center' justify='space-between' class='ma-0 pa-0 no-gutters'>
								<v-col cols='auto' class='ma-0 pa-0 mr-1'>
									<v-icon :icon='mdiAccountCircle' />
								</v-col>
								<v-col cols='auto' class='ma-0 pa-0'>
									<span class='unselectable'>{{ email }}</span>
								</v-col>
							</v-row>
						</v-chip>
					</v-col>
				</v-row>
			</template>
			<template v-if='!authenticated && onDesktop'>
				<v-btn
					v-for='item in notAuthenticatedLinks'
					:to='item.route'
					class='elevation-0'
					:key='item.route'
				>
					<v-icon class='mr-2' :icon='item.icon' />
					{{ item.message }}
				</v-btn>
			</template>
		</v-toolbar-items>
		<v-btn
			v-if='!onDesktop'
			@click='navDrawer'
			class='cl mr-2'
			dark
			icon
			variant='text'
		>
			<v-icon
				:icon='mdiMenu'
				class=''
				size='large'
			/>

		</v-btn>

		<template v-slot:extension v-if='!online'>
			<v-row
				app
				:class='alert_class'
				class='ma-0 pa-0'
				justify='end'
				density='compact'
				no-gutters
			>
				<v-col cols='12' class='ma-0 pa-0'>
					<OfflineAlert  />
				</v-col>
			</v-row>
		</template>
	</v-app-bar>
</template>

<script setup lang='ts'>
import { FrontEndNames, FrontEndRoutes } from '@/types/const_routes';
import { mdiAccountCircle, mdiMenu } from '@mdi/js';
import { notAuthenticatedLinks } from '@/vanillaTS/NavigationLinks';
import { useDisplay } from 'vuetify';

const { lgAndUp } = useDisplay();

const alert_class = computed(() => !onDesktop.value ? 'alert-bottom' : 'alert-top');
const appbarHeight = computed(() => onDesktop.value ? '76' : '56');
const authenticated = computed(() => userModule().authenticated);
const email = computed(() => userModule().email);
const logoMargin = computed(() => onDesktop.value ? 'mr-3' : 'mr-1');
const logoSize = computed(() => onDesktop.value ? '46px' : '36px');
const onDesktop = computed(() => lgAndUp.value);
const online = computed(() => browserModule().online);

const open = computed({
	get (): boolean {
		return navDrawerModule().open;
	},
	set (b: boolean): void {
		navDrawerModule().set_open(b);
	}
});
const router = useRouter();
const route = useRoute();

const goHome = (): void => {
	if (authenticated.value && route.name !== FrontEndNames.USER_DEVICES) router.push(FrontEndRoutes.USER_DEVICES);
	if (!authenticated.value && route.name !== FrontEndNames.HOME) router.push(FrontEndRoutes.BASE);
};
const goSettings = (): void => {
	if (route.name !== FrontEndNames.USER_SETTINGS) router.push(FrontEndRoutes.USER_SETTINGS);
};
const navDrawer = (): void => {
	if (onDesktop.value) return;
	open.value = !open.value;
};
</script>

<style>
/* So that offline alert takes up the full width */
.v-toolbar__extension{
	padding: 0px!important;
}

</style>