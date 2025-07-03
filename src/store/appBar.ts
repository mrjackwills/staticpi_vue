import { defineStore } from 'pinia';
import { ModuleName } from '@/types/const_module';

export const appBarModule = defineStore(ModuleName.APPBAR, {

	state: () => ({ size: 0 }),

	actions: {
		set_loading (value: number) {
			this.size = value;
		}
	}
});
