import { defineStore } from 'pinia';
import { ModuleName } from '@/types/const_module';
import type { TConfirmMethod } from '@/types';

export const dialogModule = defineStore(ModuleName.DIALOG, {

	state: () => ({
		confirmButton: '',
		confirmMethod: undefined as TConfirmMethod | undefined,
		icon: '',
		message: '',
		passwordRequired: false,
		timeout: 0,
		title: '',
		twoFABackup: false,
		twoFARequired: false,
		visible: false
	}),

	actions: {
		
		set_confirmButton (x: string): void {
			this.confirmButton = x;
		},
		
		set_confirmMethod (x: TConfirmMethod | undefined): void {
			this.confirmMethod = x;
		},
		
		set_icon (x: string): void {
			this.icon = x;
		},
		
		set_message (x: string): void {
			this.message = x;
		},
		
		set_passwordRequired (x: boolean): void {
			this.passwordRequired = x;
		},
		
		set_timeout (x: number): void {
			this.timeout = x;
		},
		
		set_title (x: string): void {
			this.title = x;
		},
		
		set_twoFABackup (x: boolean): void {
			this.twoFABackup = x;
		},
		
		set_twoFARequired (x: boolean): void {
			this.twoFARequired = x;
		},
		
		set_visible (x: boolean): void {
			this.visible = x;
		}
	}
});
