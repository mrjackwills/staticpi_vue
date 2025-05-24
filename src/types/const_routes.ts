import type { ConstT } from '@/types';

export const FrontEndRoutes = {
	ADMIN: '/admin',
	BASE: '/',
	CATCH_ALL: '/:pathMatch(.*)*',
	CONTACT: '/contact',
	DOCUMENTATION: '/documentation',
	ERROR: '/error',
	FORGOTPASSWORD: '/forgot-password',
	LOGIN: '/login',
	PLANS: '/plans',
	PRIVACY: '/privacy',
	REGISTER: '/register',
	RESETPASSWORD_param_ID: '/user/reset/:id',
	STATUS: '/status',
	TERMS: '/terms',
	USER_DEVICES: '/user/devices',
	USER_RESET: '/user/reset',
	USER_SETTINGS: '/user/settings',
	VERIFY_param_ID: '/user/verify/:id'
} as const;
export type FrontendRoutes = ConstT<typeof FrontEndRoutes>;

export const FrontEndNames = {
	ADMIN: 'admin',
	CONTACT: 'contact',
	DOCUMENTATION: 'documentation',
	ERROR: 'error',
	FORGOTPASSWORD: 'forgot-password',
	HOME: 'home',
	LOGIN: 'login',
	PLANS: 'plans',
	PRIVACY: 'privacy',
	REGISTER: 'register',
	STATUS: 'status',
	TERMS: 'terms',
	USER_DEVICES: 'user_devices',
	USER_RESET: 'user_reset',
	USER_RESET_ID: 'user_reset_id',
	USER_SETTINGS: 'user_settings',
	USER_VERIFY_param_ID: 'user_verify_id'
} as const;

export type FrontEndNames = ConstT<typeof FrontEndNames>;
