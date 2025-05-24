import { defineStore } from 'pinia';
import { ModuleName } from '@/types/const_module';

export const loadingModule = defineStore(ModuleName.LOADING, {

	state: () => ({ loading: false }),

	actions: {
		set_loading (value: boolean) {
			this.loading = value;
		}
	}
});
