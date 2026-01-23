<template>
	<v-navigation-drawer
		id='nav_bar'
		v-model='open'
		app
		class='unselectable'
		color='pi'
		dark
		:location='mdAndDown?"right":"left"'
		:rail='mini'
		touchless
		width='180'
	>
		<v-list class='pt-0' density='compact'>

			<section v-if='mdAndDown'>
				<v-list-item class='cl' @click='(open=!open)'>
					<template #prepend>
						<v-icon class='flipx mr-2' :icon='mdiClose' />
					</template>
					<template #title>
						<span class=''>close</span>
					</template>
				</v-list-item>

				<v-divider class='divider' color='white' />
			</section>

			<v-list-item
				v-for='item in links'
				:key='item.route'
				class='cl'
				density='compact'
				router
				:to='item.route'
			>
				<template #prepend>
					<v-icon class='mr-2' :icon='item.icon' />
				</template>
				<template #title>
					<!-- this is new -->
					<span v-if='!mini' class=''>{{ item.message }}</span>
				</template>
			</v-list-item>

			<v-expand-transition>
				<section v-if='isAdmin'>
					<v-list-item
						v-for='item in adminLinks'
						:key='item.route'
						class='cl'
						density='compact'
						router
						:to='item.route'
					>
						<template #prepend>
							<v-icon class='mr-2' :icon='item.icon' />
						</template>
						<template #title>
							<span v-if='!mini' class=''>{{ item.message }}</span>
						</template>
					</v-list-item>
				</section>
			</v-expand-transition>

			<section v-if='authenticated'>
				<v-list-item v-if='lgAndUp' class='cl' title='minimize' @click='minimize'>
					<template #prepend>
						<v-icon class='mr-2' :icon='miniLogo' />
					</template>
					<template #title>
						<span v-if='!mini' class=''>minimize</span>
					</template>
				</v-list-item>
				<v-divider class='divider' color='white' />
				<v-list-item class='cl' title='minimize' @click='logout'>
					<template #prepend>
						<v-icon class='flipx mr-2' :icon='mdiLoginVariant' />
					</template>
					<template #title>
						<span v-if='!mini' class=''>logout</span>
					</template>
				</v-list-item>
			</section>
			<section v-if='!mini'>
				<v-list-item>
					<v-divider class='divider' color='white' />
					<FooterText class='mt-2' />
				</v-list-item>
			</section>
		</v-list>

	</v-navigation-drawer>
</template>

<script setup lang='ts'>
import { mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiClose, mdiLoginVariant } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_authenticatedUser } from '@/services/axios'
import { dialoger } from '@/services/dialog'
import { adminLinks, authenticatedLinks, notAuthenticatedLinks } from '@/vanillaTS/NavigationLinks'

const { mdAndUp, mdAndDown, lgAndUp } = useDisplay()

const navDrawerStore = navDrawerModule()

const authenticated = computed(() => userModule().authenticated)

const isAdmin = computed(() => userModule().isAdminUser)

const links = computed(() => authenticated.value ? authenticatedLinks : notAuthenticatedLinks)

const mini = computed({
	get (): boolean {
		return mdAndUp.value ? navDrawerStore.mini : false
	},
	set (b: boolean): void {
		navDrawerStore.set_mini(b)
	},
})
const miniLogo = computed(() => mini.value ? mdiChevronDoubleRight : mdiChevronDoubleLeft)

const open = computed({
	get (): boolean {
		return lgAndUp.value ? authenticated.value : navDrawerStore.open
	},
	set (b: boolean): void {
		navDrawerStore.set_open(b)
	},
})

async function logout_confirm (): Promise<void> {
	await axios_authenticatedUser.signout_post()
}
function logout (): void {
	dialoger({
		message: 'Are you sure you want to logout?',
		title: 'Logout',
		buttonText: 'logout',
		confirmMethod: logout_confirm,
		icon: mdiLoginVariant,
		passwordrequired: false,
		twoFABackup: false,
		twoFARequired: false,
	})
}

function minimize (): void {
	mini.value = !mini.value
}

</script>

<style>
.divider{
	opacity: .35;
}

.v-list-item__prepend > .v-icon {
	margin-inline-end: 0;
}

.v-list-item__spacer{
	width: 0px!important;
}
</style>
