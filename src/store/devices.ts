
import { defineStore } from 'pinia';
import { ModuleName } from '@/types/const_module';
import type { TDeviceInfo, TLimits } from '@/types';

export const deviceModule = defineStore(ModuleName.DEVICES, {

	state: () => ({
		all: [] as Array<TDeviceInfo>,
		rate_limit: [] as Array<TLimits>,
		timestamp: new Date(),
		total_counted_bandwidth: Number(0)
	}),

	getters: {
		device_names (): Array<string> {
			const output = [];
			for (const i of this.all) output.push(i.name_of_device);
			return output;
		},

		get_api_key (state): (x: string) => string {
			return (x: string): string => {
				const index = state.all.findIndex((i) => i.name_of_device === x);
				const device = state.all[index];
				return device ? device.api_key : '';
			};
		},

		get_ttl (state): (x: string) => number {
			return (x: string): number => {
				const index = state.rate_limit.findIndex((i) => i.name_of_device === x);
				const device = state.rate_limit[index];
				return device ? device.ttl : 0;
			};
		},

		numberOfDevices (): number {
			return this.all.length;
		},

		name_exists: (state): (x: string) => boolean => {
			return (x: string): boolean => {
				const output = state.all.findIndex((i) => i.name_of_device === x);
				return output >= 0;
			};
		}

	},

	actions: {
		set_all_devices (x: Array<TDeviceInfo>): void {
			let bw = Number(0);
			for (const i of x) {
				bw += Number(i.client_bytes_month_out) + Number(i.pi_bytes_month_out);
			}
			this.total_counted_bandwidth = bw;
			this.all = x;
		},

		set_all_limits (x: Array<TLimits>): void {
			this.rate_limit = x;
		},
		set_timestamp (): void {
			this.timestamp = new Date();
		}
	}
});
