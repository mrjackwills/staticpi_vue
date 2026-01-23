<template>
	<v-app-bar
		app
		clipped-left
		color='pi'
		dark
		:extended='!online'
		extension-height='40'
		flat
		:height='appbarHeight'
	>
		<v-toolbar-title
			class='cl pa-0'
			@click='goHome'
		>
			<v-row align='center' class='pa-0 ma-0' justify='start' no-gutters>
				<v-col
					class=''
					:class='logoMargin'
					cols='auto'
				>
					<v-img
						:eager='true'
						:height='logoSize'
						src='@/assets/svg/app_bar_logo.svg'
						:width='logoSize'
					/>
				</v-col>
				<v-col align-self='center' class='unselectable text-h4' cols='auto'>
					<StaticPi color='' />
				</v-col>
			</v-row>
		</v-toolbar-title>

		<v-toolbar-items>
			<template v-if='authenticated && email && onDesktop'>
				<v-row align='center' class='mr-2'>
					<v-col class='mr-3' cols='auto' @click='goSettings'>
						<v-chip color='primary cl text-subtitle-1' variant='flat'>
							<v-row align='center' class='ma-0 pa-0 no-gutters' justify='space-between'>
								<v-col class='ma-0 pa-0 mr-1' cols='auto'>
									<v-icon :icon='mdiAccountCircle' />
								</v-col>
								<v-col class='ma-0 pa-0' cols='auto'>
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
					:key='item.route'
					class='elevation-0'
					:to='item.route'
				>
					<v-icon class='mr-2' :icon='item.icon' />
					{{ item.message }}
				</v-btn>
			</template>
		</v-toolbar-items>
		<v-btn
			v-if='!onDesktop'
			class='cl mr-2'
			dark
			icon
			variant='text'
			@click='navDrawer'
		>
			<v-icon
				class=''
				:icon='mdiMenu'
				size='large'
			/>

		</v-btn>

		<template v-if='!online' #extension>
			<v-row
				app
				class='ma-0 pa-0'
				:class='alert_class'
				density='compact'
				justify='end'
				no-gutters
			>
				<v-col class='ma-0 pa-0' cols='12'>
					<OfflineAlert />
				</v-col>
			</v-row>
		</template>
	</v-app-bar>
</template>

<script setup lang='ts'>
import { mdiAccountCircle, mdiMenu } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { FrontEndNames, FrontEndRoutes } from '@/types/const_routes'
import { notAuthenticatedLinks } from '@/vanillaTS/NavigationLinks'

const { lgAndUp } = useDisplay()

const alert_class = computed(() => onDesktop.value ? 'alert-top' : 'alert-bottom')
const appbarHeight = computed(() => appBarModule().size)
const authenticated = computed(() => userModule().authenticated)
const email = computed(() => userModule().email)
const logoMargin = computed(() => onDesktop.value ? 'mr-3' : 'mr-1')
const logoSize = computed(() => onDesktop.value ? '46px' : '36px')
const onDesktop = computed(() => lgAndUp.value)
const online = computed(() => browserModule().online)

const open = computed({
	get (): boolean {
		return navDrawerModule().open
	},
	set (b: boolean): void {
		navDrawerModule().set_open(b)
	},
})
const router = useRouter()
const route = useRoute()

function goHome (): void {
	if (authenticated.value && route.name !== FrontEndNames.USER_DEVICES) router.push(FrontEndRoutes.USER_DEVICES)
	if (!authenticated.value && route.name !== FrontEndNames.HOME) router.push(FrontEndRoutes.BASE)
}
function goSettings (): void {
	if (route.name !== FrontEndNames.USER_SETTINGS) router.push(FrontEndRoutes.USER_SETTINGS)
}
function navDrawer (): void {
	if (onDesktop.value) return
	open.value = !open.value
}
</script>

<style>
/* So that offline alert takes up the full width */
.v-toolbar__extension{
	padding: 0px!important;
}

</style>
