import { axios_admin, axios_authenticatedUser, axios_incognito } from '@/services/axios';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { FrontEndNames, FrontEndRoutes } from '@/types/enum_routes';
import { snackError, snackSuccess } from '@/services/snack';
import EmptyComponent from '@/components/EmptyComponent.vue';
import Home from '@/views/HomeView.vue';

const ulid_regex = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/gi;

// Initialise the user store
const init_check = async (): Promise<void> => {
	const browserStore = browserModule();
	if (!browserStore.init) {
		loadingModule().set_loading(true);
		if (userModule().authenticated) {
			await axios_authenticatedUser.user_get();
			if (userModule().isAdminUser) {
				await axios_admin.admin_get();
			}
		}
	}
	browserStore.set_init(true);
	browserStore.set_history();
	loadingModule().set_loading(false);
};

/** Routes that required a authed user, via login+cookie */
const adminRoutes: Array<RouteRecordRaw> = [
	{
		path: FrontEndRoutes.ADMIN,
		name: FrontEndNames.ADMIN,
		component: () => import('@/views/Admin/AdminView.vue')
	},
];

for (const route of adminRoutes) {
	route.beforeEnter = async (to, _from, next): Promise<void> => {
		await init_check();
		const isAdmin = userModule().isAdminUser;
		isAdmin ? next(): next(FrontEndRoutes.BASE);
	};
}

/** Routes that required a authed user, via login+cookie */
const authenticatedRoutes: Array<RouteRecordRaw> = [
	{
		path: FrontEndRoutes.USER_SETTINGS,
		name: FrontEndNames.USER_SETTINGS,
		component: () => import('@/views/Authenticated/SettingsView.vue')
	},
	{
		path: FrontEndRoutes.USER_DEVICES,
		name: FrontEndNames.USER_DEVICES,
		component: () => import('@/views/Authenticated/DevicesView.vue')
	},

];

for (const route of authenticatedRoutes) {
	route.beforeEnter = async (to, _from, next): Promise<void> => {
		await init_check();
		const isAuthenticated = userModule().authenticated;
		const browser_store = browserModule();
		if (!isAuthenticated) {
			browser_store.set_redirect(to.path);
			next(FrontEndRoutes.LOGIN);
		}
		else next();
	};
}

const hexRoutes: Array<RouteRecordRaw> = [
	{
		path: FrontEndRoutes.RESETPASSWORD_param_ID,
		name: FrontEndNames.USER_RESET_ID,
		component: EmptyComponent,
		beforeEnter: async (to, _from, next): Promise<void> => {
			const [ browser_store, loading_store, resetPassword_store, user_store ] = [ browserModule(), loadingModule(), resetPasswordModule(), userModule() ];
			browser_store.set_history();
			const isAuthenticated = user_store.authenticated;
			const id = String(to.params.id);
			if (isAuthenticated) next(FrontEndRoutes.BASE);
			else {
				if (!id?.match(ulid_regex)) snackError({ message: 'Invalid verification data' });
				else {
					loading_store.set_loading(true);
					const response = await axios_incognito.reset_get(id);
					loading_store.set_loading(false);
					if (response) {
						resetPassword_store.set_id(id);
						resetPassword_store.set_two_fa_backup(response.two_fa_backup);
						resetPassword_store.set_two_fa_enabled(response.two_fa_enabled);
						next(FrontEndRoutes.USER_RESET);
						return;
					}
					resetPassword_store.set_id('');
					next(FrontEndRoutes.BASE);
				}
			}
		}
	},
	{
		path: FrontEndRoutes.USER_RESET,
		name: FrontEndNames.USER_RESET,
		component: () => import('@/views/HexAuthenticated/ResetPasswordView.vue'),
		beforeEnter: (_to, _from, next): void => {
			const [ browser_store, resetPassword_store, user_store ] = [ browserModule(), resetPasswordModule(), userModule() ];
			browser_store.set_history();
			const isAuthenticated = user_store.authenticated;
			const resetId = resetPassword_store.id;
			if (isAuthenticated || !resetId) next(FrontEndRoutes.ERROR);
			else next();
			
		}
	},
	{
		/** Verify user after successful register - componentless */
		path: FrontEndRoutes.VERIFY_param_ID,
		name: FrontEndNames.USER_VERIFY_param_ID,
		component: EmptyComponent,
		beforeEnter: async (to, _from, next): Promise<void> => {
			const [ browser_store, user_store ] = [ browserModule(), userModule() ];
			browser_store.set_history();
			const isAuthenticated = user_store.authenticated;
			if (isAuthenticated) next(FrontEndRoutes.BASE);
			else {
				if (!String(to.params.id).match(ulid_regex)) snackError({ message: 'Invalid verification data' });
				else {
					loadingModule().set_loading(true);
					const success = await axios_incognito.verify_get(String(to.params.id));
					if (success) {
						next(FrontEndRoutes.LOGIN);
						snackSuccess({ message: 'Verified, please sign in to continue', timeout: 15000 });
						loadingModule().set_loading(false);
						return;
					}
					loadingModule().set_loading(false);
				}
				next(FrontEndRoutes.BASE);
			}
		}
	},
];

/** Routes only available to none authenticated users */
const notAuthenticatedRoutes: Array<RouteRecordRaw> = [
	{
		path: FrontEndRoutes.FORGOTPASSWORD,
		name: FrontEndNames.FORGOTPASSWORD,
		component: () => import('@/views/NotAuthenticated/ForgotPasswordView.vue')
	},
	{
		path: FrontEndRoutes.LOGIN,
		name: FrontEndNames.LOGIN,
		component: () => import('@/views/NotAuthenticated/LoginView.vue')
	},

	{
		path: FrontEndRoutes.PLANS,
		name: FrontEndNames.PLANS,
		component: () => import('@/views/NotAuthenticated/PlansView.vue')
	},
	{
		path: FrontEndRoutes.REGISTER,
		name: FrontEndNames.REGISTER,
		component: () => import('@/views/NotAuthenticated/RegisterView.vue')
	},

];

for (const route of notAuthenticatedRoutes) {
	route.beforeEnter = async (_to, _from, next): Promise<void> => {
		await init_check();
		userModule().authenticated ? next(FrontEndRoutes.BASE) : next();
	};
}

/** Routes available to anyone at anytime */
const baseRoutes: Array<RouteRecordRaw> = [
	{
		path: FrontEndRoutes.BASE,
		name: FrontEndNames.HOME,
		component: Home,
	},
	{
		path: FrontEndRoutes.ERROR,
		name: FrontEndNames.ERROR,
		component: () => import('@/views/ErrorView.vue'),
	},
	{
		path: FrontEndRoutes.STATUS,
		name: FrontEndNames.STATUS,
		component: () => import('@/views/NetworkStatusView.vue')
	},
	{
		path: FrontEndRoutes.CONTACT,
		name: FrontEndNames.CONTACT,
		component: () => import('@/views/ContactView.vue')
	},

	{
		path: FrontEndRoutes.TERMS,
		name: FrontEndNames.TERMS,
		component: () => import('@/views/PrivacyView.vue')
	},
	{
		path: FrontEndRoutes.PRIVACY,
		name: FrontEndNames.PRIVACY,
		component: () => import('@/views/PrivacyView.vue')
	},
	{
		path: FrontEndRoutes.DOCUMENTATION,
		name: FrontEndNames.DOCUMENTATION,
		component: () => import('@/views/DocumentationView.vue')
	},
	{
		path: FrontEndRoutes.CATCH_ALL,
		redirect: { name: 'error' },
	},
];

for (const route of baseRoutes) {
	route.beforeEnter = async (to, _from, next): Promise<void> => {
		await init_check();
		if (to.name === FrontEndNames.HOME) {
			if (userModule().authenticated) {
				return next(FrontEndRoutes.USER_DEVICES);
			}
		}
		next();
	};
}
const allRoutes = [ ...baseRoutes, ...adminRoutes, ...authenticatedRoutes, ...hexRoutes, ...notAuthenticatedRoutes ];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: allRoutes,
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}
		else if (to.hash) {
			return {
				el: to.hash,
				behavior: 'smooth',
				// this is to counter the height of the app bar, if on mobile!
				top: 76,
			};
		/// Settings page amends url, so need to skip scrolling if both to & from are in the same page!
		} else if (to.name?.toString() !== from.name?.toString()) {
			return { top: 0 };
		}
	}
});

export default router;