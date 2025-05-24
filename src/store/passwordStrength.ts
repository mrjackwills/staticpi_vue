import { defineStore } from 'pinia';
import { ModuleName } from '@/types/const_module';

export const passwordStrengthModule = defineStore(ModuleName.PASSWORD_STRENGTH, {

	state: () => ({ strength: 0 }),

	actions: {
		set_strength (value: number) {
			this.strength = value;
		}
	}
});
