import type { ConstT } from '@/types';

export const ModuleName = {
	APPBAR: 'appbar',
	BROWSER: 'browser',
	DEVICES: 'device',
	DIALOG: 'dialog',
	LOADING: 'loading',
	NAV_DRAWER: 'navdrawer',
	PASSWORD_STRENGTH: 'passwordstrength',
	RESET_PASSWORD: 'resetpassword',
	SETTINGS_SECTION: 'settingsection',
	SNACKBAR: 'snackbar',
	TWO_FA: 'twofa',
	USER: 'user'
} as const;

export type ModuleName = ConstT<typeof ModuleName>;
