import { defineStore, getActivePinia } from 'pinia';
import { ModuleName } from '@/types/const_module';
import type { TSettingSection } from '@/types';

export const settingSectionModule = defineStore(ModuleName.SETTINGS_SECTION, {

	state: () => ({
		beforemount_open: false,
		current_section: undefined as TSettingSection | undefined
	}),

	actions: {
		set_beforemount_open (value: boolean) {
			this.beforemount_open = value;
		},

		set_current_section (value: TSettingSection | undefined) {
		
			const router = getActivePinia()?.router();
			const route = router?.currentRoute;
			const pathIncludesSection = route?.value.fullPath.toLowerCase().includes(`?section=${value}`);
			if (value && !pathIncludesSection) router?.replace({
				path: route?.value.path,
				query: { section: value } 
			});
			else if (this.current_section && !pathIncludesSection) router?.replace({
				path: route?.value.path,
				query: { section: value } 
			});
			this.current_section = value;
		}
	}
});