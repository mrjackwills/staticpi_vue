import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';

export const browserModule = defineStore(ModuleName.BROWSER, {

	state: () => ({
		api_version: '',
		android_ios: false,
		description: '',
		force_refresh: false,
		history: 0,
		init: false,
		online: true,
		pwa: false,
		redirect: '',
		stopScroll: false,
		title: ''
	}),

	actions: {
		set_api_version (x: string): void {
			this.api_version = x;
		},

		set_android_ios (x: boolean): void {
			this.android_ios = x;
		},

		set_description (x: string): void {
			this.description = x;
		},

		set_force_refresh (x: boolean): void {
			this.force_refresh = x;
		},

		set_history (): void {
			this.history ++;
		},

		set_init (x: boolean): void {
			this.init = x;
		},

		set_online (x: boolean): void {
			this.online = x;
		},

		set_pwa (x: boolean): void {
			this.pwa = x;
		},

		set_redirect (x: string): void {
			this.redirect = x;
		},

		set_stopScroll (x: boolean): void {
			this.stopScroll = x;
		},

		set_title (x: string): void {
			this.title = x;
		},
		
	}
});
