import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';

export const resetPasswordModule = defineStore(ModuleName.RESET_PASSWORD, {

	state: () => ({
		id: '',
		two_fa_backup: false,
		two_fa_enabled: false,
	}),

	actions: {
		set_id (value: string) {
			this.id = value;
		},
		set_two_fa_backup (value: boolean) {
			this.two_fa_backup = value;
		},
		set_two_fa_enabled (value: boolean) {
			this.two_fa_enabled = value;
		},
	}
});