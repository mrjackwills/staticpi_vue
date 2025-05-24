import { defineStore } from 'pinia';
import { ModuleName } from '@/types/const_module';
import type { TSnackPosition } from '@/types';

export const snackbarModule = defineStore(ModuleName.SNACKBAR, {

	state: () => ({
		closable: false,
		color: '',
		icon: '',
		loading: false,
		message: '',
		position: {
			x: 'right',
			y: 'bottom'
		} as TSnackPosition,
		timeout: 0,
		visible: false

	}),

	actions: {
		set_closable (x: boolean): void {
			this.closable = x;
		},

		set_color (x: string): void {
			this.color = x;
		},

		set_icon (x: string): void {
			this.icon = x;
		},

		set_loading (x: boolean): void {
			this.loading = x;
		},

		set_message (x: string): void {
			this.message = x;
		},

		set_position (x: TSnackPosition): void {
			this.position = x;
		},

		set_timeout (x: number): void {
			this.timeout = x;
		},

		set_visible (x: boolean): void {
			this.visible = x;
		}
	}
});
