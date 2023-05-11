import { defineStore } from 'pinia';
import { FrontEndRoutes } from '@/types/enum_routes';
import { getActivePinia } from 'pinia';
import { ModuleName } from '@/types/enum_module';
import { UserLevel } from '@/types/enum_userLevel';

export const userModule = defineStore(ModuleName.USER, {

	state: () => ({
		authenticated: false,
		email: '',
		full_name: '',
		maxBandwidth: '0',
		maxClients: 0,
		maxMessageSize: 0,
		maxDevices: 0,
		timestamp: undefined as undefined | string,
		userLevel: UserLevel.FREE,
	}),

	persist: {
		storage: localStorage,
		paths: [ 'authenticated' ],
	},

	getters: {
		isFreeUser (): boolean {
			return this.userLevel === UserLevel.FREE;
		},
		isProUser (): boolean {
			return this.userLevel === UserLevel.PRO;
		},
		isAdminUser (): boolean {
			return this.userLevel === UserLevel.ADMIN;
		},
		isProOrAdminUser (): boolean {
			return this.isProUser || this.isAdminUser;
		},
	},

	actions: {
		set_authenticated (x: boolean): void {
			this.authenticated = x;
		},

		set_email (x: string): void {
			this.email = x;
		},

		set_full_name (x: string): void {
			this.full_name = x;
		},

		set_maxBandwidth (x: string): void {
			this.maxBandwidth = x;
		},

		set_maxClients (x: number): void {
			this.maxClients = x;
		},

		set_maxDevices (x: number): void {
			this.maxDevices = x;
		},

		set_maxMessageSize (x: number): void {
			this.maxMessageSize = x;
		},

		set_timestamp (x: string|undefined): void {
			this.timestamp = x;
		},

		set_userLevel (x: UserLevel): void {
			this.userLevel = x;
		},

		async clientSideSignout (): Promise<void> {
			this.$reset();
			deviceModule().$reset();
			dialogModule().$reset();
			getActivePinia()?.router().push(FrontEndRoutes.BASE);
			navDrawerModule().$reset();
			passwordStrengthModule().$reset();
			snackbarModule().$reset();
			resetPasswordModule().$reset();
			settingSectionModule().$reset();
		}

	},
});