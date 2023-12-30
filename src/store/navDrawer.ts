import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';

export const navDrawerModule = defineStore(ModuleName.NAV_DRAWER, {

	state: () => ({
		mini: false,
		open: false,
	}),

	actions: {
		set_mini (value: boolean) {
			this.mini = value;
		},
		set_open (value: boolean) {
			this.open = value;
		},
	}
});
