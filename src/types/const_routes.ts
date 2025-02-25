export const FrontEndRoutes = {
	ADMIN: '/admin' as const,
	BASE: '/' as const,
	CATCH_ALL: '/:pathMatch(.*)*' as const,
	CONTACT: '/contact' as const,
	DOCUMENTATION: '/documentation' as const,
	ERROR: '/error' as const,
	FORGOTPASSWORD: '/forgot-password' as const,
	LOGIN: '/login' as const,
	PLANS: '/plans' as const,
	PRIVACY: '/privacy' as const,
	REGISTER: '/register' as const,
	RESETPASSWORD_param_ID: '/user/reset/:id' as const,
	STATUS: '/status' as const,
	TERMS: '/terms' as const,
	USER_DEVICES: '/user/devices' as const,
	USER_RESET: '/user/reset' as const,
	USER_SETTINGS: '/user/settings' as const,
	VERIFY_param_ID: '/user/verify/:id' as const
};

export type FrontEndRoutes = (typeof FrontEndRoutes)[keyof typeof FrontEndRoutes]; 
export const FrontEndNames =  {
	ADMIN: 'admin' as const,
	CONTACT: 'contact' as const,
	DOCUMENTATION: 'documentation' as const,
	ERROR: 'error' as const,
	FORGOTPASSWORD: 'forgot-password' as const,
	HOME: 'home' as const,
	LOGIN: 'login' as const,
	PLANS: 'plans' as const,
	PRIVACY: 'privacy' as const,
	REGISTER: 'register' as const,
	STATUS: 'status' as const,
	TERMS: 'terms' as const,
	USER_DEVICES: 'user_devices' as const,
	USER_RESET: 'user_reset' as const,
	USER_RESET_ID: 'user_reset_id' as const,
	USER_SETTINGS: 'user_settings' as const,
	USER_VERIFY_param_ID: 'user_verify_id' as const
};


export type FrontEndNames = (typeof FrontEndNames)[keyof typeof FrontEndNames]; 