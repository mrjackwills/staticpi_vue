import type { ConstT } from '@/types';

export const ModuleName = {
	APPBAR: 'appbar' as const,
	BROWSER: 'browser' as const,
	DEVICES: 'device' as const,
	DIALOG: 'dialog' as const,
	LOADING: 'loading' as const,
	NAV_DRAWER: 'navdrawer' as const,
	PASSWORD_STRENGTH: 'passwordstrength' as const,
	RESET_PASSWORD: 'resetpassword' as const,
	SETTINGS_SECTION: 'settingsection' as const,
	SNACKBAR: 'snackbar' as const,
	TWO_FA: 'twofa' as const,
	USER: 'user' as const
};

export type ModuleName = ConstT<typeof ModuleName>;