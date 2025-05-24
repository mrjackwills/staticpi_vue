import { defineStore } from 'pinia';
import { ModuleName } from '@/types/const_module';

export const twoFAModule = defineStore(ModuleName.TWO_FA, {

	state: () => ({
		active: false,
		always_required: false,
		backupProcess: false,
		count: 0,
		secret: '',
		setupProcessStarted: false
	}),

	actions: {
		set_active (x: boolean): void {
			this.active = x;
		},

		set_alwaysRequired (x: boolean): void {
			this.always_required = x;
		},

		set_backupProcess (x: boolean): void {
			this.backupProcess = x;
		},

		set_count (x: number): void {
			this.count = x;
		},

		set_secret (x: string): void {
			this.secret = x;
		},

		set_setupProcessStarted (x: boolean): void {
			this.setupProcessStarted = x;
		}
	}
});
