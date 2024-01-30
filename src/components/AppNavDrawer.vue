<template>
	<v-navigation-drawer
		v-model='open'
		:rail='mini'
		:location='mdAndDown?"right":"left"'
		class='unselectable'
		color='pi'
		id='nav_bar'
		width='180'
		app
		dark
		touchless
	>
		<v-list class='pt-0' density='compact'>

			<section v-if='mdAndDown'>
				<v-list-item @click='(open=!open)' class='cl'>
					<template v-slot:prepend>
						<v-icon :icon='mdiClose' class='flipx mr-2' />
					</template>
					<template v-slot:title>
						<span class=''>close</span>
					</template>
				</v-list-item>
			
				<v-divider color='white' class='divider' />
			</section>

			<v-list-item v-for='(item, index) in links'
				:key='index'
				:to='item.route'
				router
				density='compact'
				class='cl'
			>
				<template v-slot:prepend>
					<v-icon :icon='item.icon' class='mr-2'/>
				</template>
				<template v-slot:title>
					<span class=''>{{ item.message }}</span>
				</template>
			</v-list-item>

			<v-expand-transition>
				<section v-if='isAdmin'>
					<v-list-item v-for='(item, index) in adminLinks'
						:key='index'
						:to='item.route'
						router
						density='compact'
						class='cl'
					>
						<template v-slot:prepend>
							<v-icon :icon='item.icon' class='mr-2' />
						</template>
						<template v-slot:title>
							<span class=''>{{ item.message }}</span>
						</template>
					</v-list-item>
				</section>
			</v-expand-transition>
					
			<section v-if='authenticated'>
				<v-list-item v-if='lgAndUp' @click='minimize' class='cl' title='minimize'>
					<template v-slot:prepend>
						<v-icon :icon='miniLogo' class='mr-2' />
					</template>
					<template v-slot:title>
						<span class=''>minimize</span>
					</template>
				</v-list-item>
				<v-divider color='white' class='divider' />
				<v-list-item @click='logout' class='cl' title='minimize'>
					<template v-slot:prepend>
						<v-icon :icon='mdiLoginVariant' class='flipx mr-2' />
					</template>
					<template v-slot:title>
						<span class=''>logout</span>
					</template>
				</v-list-item>
			</section>
			<section v-if='!mini' >
				<v-divider color='white' class='divider' />
				<FooterText class='mt-2' />
			</section>
		</v-list>
		
	</v-navigation-drawer>
</template>

<script setup lang='ts'>
import { adminLinks, authenticatedLinks, notAuthenticatedLinks } from '@/vanillaTS/NavigationLinks';
import { axios_authenticatedUser } from '@/services/axios';
import { dialoger } from '@/services/dialog';
import { useDisplay } from 'vuetify';
import { mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiClose, mdiLoginVariant } from '@mdi/js';
import type { TNavigationLink } from '@/types';

const { mdAndUp, mdAndDown, lgAndUp } = useDisplay();

const navDrawerStore = navDrawerModule();

const authenticated = computed((): boolean => {
	return userModule().authenticated;
});

const isAdmin = computed((): boolean => {
	return userModule().isAdminUser;
});

const links = computed((): Array<TNavigationLink> => {
	return authenticated.value ? authenticatedLinks: notAuthenticatedLinks;
});
const mini = computed({
	get (): boolean {
		if (mdAndUp.value) {
			return navDrawerStore.mini;
		} else {
			return false;
		}
	},
	set (b: boolean): void {
		navDrawerStore.set_mini(b);
	},
});
const miniLogo = computed((): string => {
	return mini.value ? mdiChevronDoubleRight : mdiChevronDoubleLeft ;
});

const open = computed({
	get (): boolean {
		if (lgAndUp.value) {
			return authenticated.value;
		} else {
			return navDrawerStore.open;
		}
	},
	set (b: boolean): void {
		navDrawerStore.set_open(b);
	},
});

const logout_confirm = async (): Promise<void> => {
	await axios_authenticatedUser.signout_post();
};
const logout = (): void => {
	dialoger({
		message: 'Are you sure you want to logout?',
		title: 'Logout',
		buttonText: 'logout',
		confirmMethod: logout_confirm,
		icon: mdiLoginVariant,
		passwordrequired: false,
		twoFABackup: false,
		twoFARequired: false,
	});
};

const minimize = (): void => {
	mini.value = !mini.value;
};

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