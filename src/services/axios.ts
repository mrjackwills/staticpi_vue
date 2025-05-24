import { HttpCode } from '@/types/const_http';
import { snackError } from './snack';
import { UserLevel } from '@/types/const_userLevel';
import type * as types from '@/types';
import Axios, { type AxiosInstance, AxiosError } from 'axios';
import { env } from '@/vanillaTS/env';

type ErrorData = { data: { response: string } };

type AxiosClasses = AdminUser | AuthenticatedUser | Incognito | Device | SiteStatus | AxiosWs;

// Allow for longer timeouts when in debug mode
const get_timeout = (): number => {
	return env.mode_production ? 7000 : 70000;
};

const isAuthenticated = <T> () => {
	return function (_target: AxiosClasses, _propertyKey: string, descriptor: PropertyDescriptor): void {
		const original = descriptor.value;
		descriptor.value = async function (t: T): Promise<unknown> {
			const user_store = userModule();
			const authenticated = user_store.authenticated;
			if (authenticated) {
				const result = await original.call(this, t);
				return result;
			} else snackError({ message: 'Invalid Authentication' });
			return;
		};
	};
};

const isNotAuthenticated = <T> () => {
	return function (_target: AxiosClasses, _propertyKey: string, descriptor: PropertyDescriptor): void {
		const original = descriptor.value;
		descriptor.value = async function (t: T): Promise<unknown> {
			const user_store = userModule();
			const authenticated = user_store.authenticated;
			if (!authenticated) {
				const result = await original.call(this, t);
				return result;
			} else snackError({ message: 'Invalid Authentication' });
			return;
		};
	};
};

const isAdmin = <T> () => {
	return function (_target: AxiosClasses, _propertyKey: string, descriptor: PropertyDescriptor): void {
		const original = descriptor.value;
		descriptor.value = async function (t: T): Promise<unknown> {
			if (userModule().isAdminUser) {
				const result = await original.call(this, t);
				return result;
			} else snackError({ message: 'Invalid Authentication' });
			return;
		};
	};
};

const AllowedUsers = <T> (allowedUsers: Array<UserLevel>) => {
	return function (_target: AxiosClasses, _propertyKey: string, descriptor: PropertyDescriptor): void {
		const original = descriptor.value;
		descriptor.value = async function (t: T): Promise<unknown> {
			const user_store = userModule();
			const userLevel = user_store.userLevel;
			if (userLevel && allowedUsers.includes(userLevel)) {
				const result = await original.call(this, t);
				return result;
			} else snackError({ message: `Not available to ${userLevel ?? 'unregistered'} users` });
			return;
		};
	};
};

const wrap = <T>() => function (_target: AxiosClasses, propertyKey: string, descriptor: PropertyDescriptor): void {

	const original = descriptor.value;
	descriptor.value = async function (args: T): Promise<unknown> {
		const [browser_store, user_store] = [browserModule(), userModule()];
		try {
			const result = await original.call(this, args);
			if (result && propertyKey !== 'manifest_online') browser_store.set_online(true);
			return result;
		} catch (err) {
			browserModule().set_init(true);
			const e = err as AxiosError;
			if (e.message === 'offline' && propertyKey !== 'online') {
				if (browser_store.online) {
					snackError({ message: 'Server offline' });
					browser_store.set_online(false);
				}
			// eslint-disable-next-line @stylistic/brace-style
			}

			/*
			 * This is a branch for the server status checker, maybe change name from online to serverStatus
			 * the api propertyKey is online_get, so this has different effect from the ws and site online method
			 */
			else if (propertyKey === 'online') return false;
			else if (e.response?.status === HttpCode.FORBIDDEN) {
				const p = e.response as ErrorData;
				const authenticated = user_store.authenticated;
				const message = authenticated ? 'You have been signed out' : p?.data?.response;
				if (authenticated) {
					await user_store.clientSideSignout();
				}
				snackError({ message });
			} else if (e.response?.status === HttpCode.TOO_MANY_REQUESTS) {
				const p = e.response as ErrorData;
				snackError({ message: p.data.response });
			} else {
				const p = e?.response as ErrorData;
				const eeee = p.data?.response ?? 'Unable to access server';
				snackError({ message: eeee });
			}
			return;
		}
	};
};

class BaseAxios {
	protected baseAxios!: AxiosInstance;

	constructor (url: string) {
		this.baseAxios = Axios.create({
			baseURL: `${env.domain_api}/${url}`,
			withCredentials: true,
			timeout: get_timeout(),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-control': 'no-cache'
			}
		});

		this.baseAxios.interceptors.response.use(
			(config) => Promise.resolve(config),
			(error) => !error.response ? Promise.reject(new Error('offline')) : Promise.reject(error)
		);
	}
}

class Incognito extends BaseAxios {

	/*
	 * constructor (url: string) {
	 * 	super(url);
	 * }
	 */

	@wrap<string>()
	@isNotAuthenticated()
	async forgot_post (email: string): Promise<string | undefined> {
		const response = await this.baseAxios.post(`/reset`, { email });
		return response?.data?.response;
	}

	@wrap()
	// / 1000ms timeout for this call - good idea?
	async online_get (): Promise<types.TOnlineResponse> {
		const response = await this.baseAxios.get(`/online`, { timeout: 1000 });
		const browser_store = browserModule();
		browser_store.set_online(true);
		browser_store.set_api_version(response.data.response.api_version);
		return response?.data?.response;
	}

	@wrap()
	async bandwidth_get (): Promise<types.TGlobalBandwidth> {
		const response = await this.baseAxios.get(`/bandwidth`);
		return response?.data?.response;
	}

	@wrap<types.TRegisterUser>()
	@isNotAuthenticated<types.TRegisterUser>()
	async register_post (registerObject: types.TRegisterUser): Promise<string> {
		const response = await this.baseAxios.post(`/register`, registerObject);
		return response?.data?.response;
	}

	@wrap<string>()
	@isNotAuthenticated()
	async reset_get (hexId: string): Promise<types.TResetPasswordGet> {
		const { data } = await this.baseAxios.get(`/reset/${hexId}`);
		return data?.response;
	}

	@wrap<types.TPasswordPatch>()
	@isNotAuthenticated()
	async reset_patch ({ resetId, password, token }: types.TPasswordPatch): Promise<boolean> {
		await this.baseAxios.patch(`/reset/${resetId}`, {
			password,
			token
		});
		return true;
	}

	@wrap<types.TSignin>()
	async signin_post (authObject: types.TSignin): Promise<types.TSigninResponse> {
		const response = await this.baseAxios.post(`/signin`, authObject);
		return {
			response: response.data.response,
			status: response.status as HttpCode
		};
	}

	@wrap()
	@isNotAuthenticated()
	async verify_get (verifyId: string): Promise<boolean> {
		await this.baseAxios.get(`/verify/${verifyId}`);
		return true;
	}

	@wrap()
	async contact_post (data: types.TContact): Promise<boolean> {
		await this.baseAxios.post(`/contact`, data);
		return true;
	}
}

class AdminUser extends BaseAxios {

	/*
	 * constructor (url: string) {
	 * 	super(url);
	 * }
	 */

	@wrap()
	@isAuthenticated()
	async admin_get (): Promise<boolean> {
		await this.baseAxios.get('');
		return true;
	}

	@wrap()
	@isAdmin()
	async memory_get (): Promise<types.TAdminMemory> {
		const response = await this.baseAxios.get('/memory');
		return response.data.response;
	}

	@wrap()
	@isAdmin()
	async limit_get (): Promise<Array<types.TAdminLimit>> {
		const response = await this.baseAxios.get('/limit');
		return response.data.response;
	}

	@wrap()
	@isAdmin()
	async limit_delete (key: string): Promise<void> {
		await this.baseAxios.delete(`/limit`, { data: { key } });
	}

	@wrap()
	@isAdmin()
	async contact_get (): Promise<Array<types.TAdminContactMessage>> {
		const response = await this.baseAxios.get('/contact');
		return response.data.response;
	}

	@wrap()
	@isAdmin()
	async contact_delete (contact_message_id: number): Promise<void> {
		await this.baseAxios.delete(`/contact`, { data: { contact_message_id } });
	}

	@wrap()
	@isAdmin()
	async connections_get (): Promise<types.TAdminConnectedCount> {
		const response = await this.baseAxios.get('/connection');
		return response.data.response;
	}

	@wrap()
	@isAdmin()
	async email_log_get (): Promise<types.TAdminEmailCount> {
		const response = await this.baseAxios.get('/emails');
		return response.data.response;
	}

	@wrap()
	@isAdmin()
	async invite_get (): Promise<Array<types.TAdminInvite>> {
		const response = await this.baseAxios.get('/invite');
		return response.data.response;
	}

	@wrap()
	@isAdmin()
	async invite_post (data: types.TAdminInvitePost): Promise<boolean> {
		await this.baseAxios.post('/invite', data);
		return true;
	}

	@wrap()
	@isAdmin()
	async invite_delete (invite: string): Promise<boolean> {
		await this.baseAxios.delete(`/invite`, { data: { invite } });
		return true;
	}

	@wrap()
	@isAdmin()
	async connection_delete (data: types.TAdminConnectionRemove): Promise<boolean> {
		await this.baseAxios.delete(`/connection`, { data: { ...data } });
		return true;
	}

	@wrap()
	@isAdmin()
	async session_delete (key: string): Promise<void> {
		await this.baseAxios.delete(`/session/${key}`);
	}

	@wrap()
	@isAdmin()
	async all_users_get (): Promise<Array<types.TAdminUserAndSessions>> {
		const response = await this.baseAxios.get('/users');
		return response.data.response;
	}

	@wrap()
	@isAdmin()
	async user_connections_get (email: string): Promise<Array<types.AdminDeviceAndConnections>> {
		const response = await this.baseAxios.get(`/user/${email}/devices`);
		return response.data.response;
	}

	@wrap()
	@isAdmin()
	async attempt_delete (email: string): Promise<void> {
		await this.baseAxios.delete(`/user/${email}/attempt`);
	}

	@wrap()
	@isAdmin()
	async active_patch (email: string): Promise<boolean> {
		await this.baseAxios.patch(`/user/${email}/active`);
		return true;
	}

	@wrap()
	@isAdmin()
	async user_delete (data: types.TAdminUserDelete): Promise<boolean> {
		await this.baseAxios.delete(`/user/${data.email}`, {
			data: {
				password: data.password,
				token: data.token
			}
		});
		return true;
	}

	@wrap()
	@isAdmin()
	async device_delete (data: types.TAdminEmailDevice): Promise<boolean> {
		await this.baseAxios.delete(`/user/${data.email}/device/${data.device_name}`, {
			data: {
				password: data.password,
				token: data.token
			}
		});
		return true;
	}

	@wrap()
	@isAdmin()
	async device_pause_patch (data: types.TAdminEmailDevice): Promise<boolean> {
		await this.baseAxios.patch(`/user/${data.email}/device/${data.device_name}`, {
			password: data.password,
			token: data.token
		});
		return true;
	}
}

class AuthenticatedUser extends BaseAxios {

	/*
	 * constructor (url: string) {
	 * 	super(url);
	 * }
	 */

	@wrap()
	async signout_post (): Promise<void> {
		const user_store = userModule();
		await user_store.clientSideSignout();
		await this.baseAxios.post(`/signout`);
	}

	@wrap()
	@isAuthenticated()
	async account_delete (data: types.TAuthObject): Promise<boolean> {
		await this.baseAxios.delete(``, { data: { ...data } });
		return true;
	}

	@wrap()
	@isAuthenticated()
	async data_get (data: types.TAuthObject): Promise<string> {
		const response = await this.baseAxios.post(`/data`, data);
		return response?.data?.response;
	}

	@wrap()
	async user_get (): Promise<boolean> {
		const response = await this.baseAxios.get('');
		const [twoFA_store, user_store] = [twoFAModule(), userModule()];
		user_store.set_email(response.data.response.email);
		user_store.set_full_name(response.data.response.full_name);
		user_store.set_maxBandwidth(response.data.response.max_bandwidth);
		user_store.set_maxClients(response.data.response.max_clients);
		user_store.set_maxDevices(response.data.response.max_devices);
		user_store.set_maxMessageSize(response.data.response.max_message_size);
		user_store.set_timestamp(response.data.response.timestamp);
		user_store.set_userLevel(response.data.response.user_level);
		twoFA_store.set_alwaysRequired(response.data.response.two_fa_always_required);
		twoFA_store.set_active(response.data.response.two_fa_active);
		twoFA_store.set_count(response.data.response.two_fa_count);
		user_store.set_authenticated(true);
		return true;
	}

	@wrap<types.TPasswordChange>()
	@isAuthenticated<types.TPasswordChange>()
	async password_patch (input: types.TPasswordChange): Promise<boolean> {
		await this.baseAxios.patch(`/password`, input);
		return true;
	}

	@wrap<string>()
	@isAuthenticated<string>()
	async name_patch (input: string): Promise<boolean> {
		await this.baseAxios.patch(`/name`, { full_name: input });
		await this.user_get();
		return true;
	}

	@wrap()
	@isAuthenticated<types.TAuthObject>()
	async twoFA_delete (authentication: types.TAuthObject): Promise<boolean> {
		await this.baseAxios.delete(`/twofa`, { data: { ...authentication } });
		await this.user_get();
		return true;
	}

	@wrap<types.TAuthObject>()
	@isAuthenticated<types.TAuthObject>()
	async twoFA_put (authentication: types.TAuthObject): Promise<boolean> {
		await this.baseAxios.put(`/twofa`, { ...authentication });
		await this.user_get();
		return true;
	}

	// Delete all backup codes
	@wrap()
	@isAuthenticated<types.TAuthObject>()
	async twoFA_backup_delete (authentication: types.TAuthObject): Promise<boolean> {
		await this.baseAxios.delete(`/twofa/backup`, { data: { ...authentication } });
		await this.user_get();
		return true;
	}

	// Generate backup codes
	@wrap()
	@isAuthenticated<types.TAuthObject>()
	async twoFA_backup_post (): Promise<Array<string>> {
		const response = await this.baseAxios.post(`/twofa/backup`);
		await this.user_get();
		return response?.data?.response?.backups;
	}

	// Re-generate backup codes, requires auth
	@wrap()
	@isAuthenticated<types.TAuthObject>()
	async twoFA_backup_patch (authentication: types.TAuthObject): Promise<Array<string>> {
		const response = await this.baseAxios.patch(`/twofa/backup`, authentication);
		await this.user_get();
		return response?.data?.response?.backups;
	}

	@wrap()
	@isAuthenticated()
	async setupTwoFA_get (): Promise<boolean> {
		const response = await this.baseAxios.get(`/setup/twofa`);
		const twoFA_store = twoFAModule();
		twoFA_store.set_secret(response?.data?.response?.secret);
		return true;
	}

	@wrap()
	@isAuthenticated()
	async setupTwoFA_delete (): Promise<void> {
		await this.baseAxios.delete(`/setup/twofa`);
	}

	@wrap<types.TTFASetupPatch>()
	@isAuthenticated<types.TTFASetupPatch>()
	async twoFA_patch (body: types.TTFASetupPatch): Promise<boolean> {
		await this.baseAxios.patch(`/twofa`, body);
		await this.user_get();
		return true;
	}

	@wrap<types.TToken>()
	@isAuthenticated<types.TToken>()
	async setupTwoFA_post (token: types.TToken): Promise<boolean> {
		await this.baseAxios.post(`/setup/twofa`, token);
		return true;
	}
}

class Device extends BaseAxios {

	@wrap<types.TAuthObject>()
	@isAuthenticated<types.TAuthObject>()
	async all_delete (authentication: types.TAuthObject): Promise<boolean> {
		await this.baseAxios.delete('', { data: { ...authentication } });
		const device_store = deviceModule();
		device_store.set_all_devices([]);
		return true;
	}

	@wrap()
	@isAuthenticated()
	async deviceAll_get (): Promise<boolean> {
		const response = await this.baseAxios.get('');
		const device_store = deviceModule();
		device_store.set_all_devices(response.data?.response?.devices);
		device_store.set_all_limits(response.data?.response?.limits);
		device_store.set_timestamp();
		return true;
	}

	@wrap<types.TAddDevice>()
	@isAuthenticated<types.TAddDevice>()
	async deviceAdd_post (newDevice: types.TAddDevice): Promise<string> {
		const [device_store, user_store] = [deviceModule(), userModule()];
		if (device_store.numberOfDevices === user_store.maxDevices) throw Error('Max device limit reached');
		if (newDevice.device_password && !newDevice.client_password) {
			newDevice.client_password = newDevice.device_password;
		}
		const response = await this.baseAxios.post('', newDevice);
		return response.data?.response;
	}

	@wrap<types.TDeviceNamedDelete>()
	@isAuthenticated<types.TDeviceNamedDelete>()
	async named_delete (data: types.TDeviceNamedDelete): Promise<boolean> {
		if (!data.name) throw Error('No device name given');
		await this.baseAxios.delete(`/${data.name}`, {
			data: {
				password: data.authentication.password,
				token: data.authentication.token
			}
		});
		return true;
	}

	@wrap<types.TDeviceNamedGet>()
	@isAuthenticated<types.TDeviceNamedGet>()
	async named_get (data: types.TDeviceNamedGet): Promise<Array<types.TSelectConnectedClient> | undefined> {
		if (!data.name) throw Error('No device name given');
		const response = await this.baseAxios.get(`/${data.name}`);
		return response?.data?.response;
	}

	@wrap<types.TDevicePatchMaxClients>()
	@isAuthenticated<types.TDevicePatchMaxClients>()
	@AllowedUsers<types.TDevicePatchMaxClients>([UserLevel.PRO, UserLevel.ADMIN])
	async maxClients_patch (input: types.TDevicePatchMaxClients): Promise<boolean> {
		if (!input.maxClients || isNaN(Number(input.maxClients))) throw Error('Max clients invalid');
		await this.baseAxios.patch(`/${input.name}/max_clients`, { max_clients: Number(input.maxClients) });
		return true;
	}

	@wrap<types.TDeviceStructuredData>()
	@isAuthenticated<types.TDeviceStructuredData>()
	@AllowedUsers<types.TDeviceStructuredData>([UserLevel.PRO, UserLevel.ADMIN])
	async structuredData_patch (input: types.TDeviceStructuredData): Promise<boolean> {
		await this.baseAxios.patch(`/${input.name}/structured_data`, { structured_data: input.structured_data });
		return true;
	}

	@wrap<types.TDevicePatchRename>()
	@isAuthenticated<types.TDevicePatchRename>()
	@AllowedUsers<types.TDevicePatchRename>([UserLevel.PRO, UserLevel.ADMIN])
	async rename_patch (input: types.TDevicePatchRename): Promise<boolean> {
		if (!input.name || !input.new_name) throw Error('device name invalid');
		await this.baseAxios.patch(`/${input.name}/rename`, { new_name: input.new_name });
		return true;
	}

	@wrap<types.TDevicePatchRename>()
	@isAuthenticated<types.TDevicePatchRename>()
	@AllowedUsers<types.TDevicePatchRename>([UserLevel.PRO, UserLevel.ADMIN])
	async password_delete (input: types.TDeviceDeletePassword): Promise<boolean> {
		if (!input.name) throw Error('device name invalid');
		await this.baseAxios.delete(`/${input.name}/password`, { data: { ...input.authentication } });
		return true;
	}

	@wrap<types.TDevicePasswordPatch>()
	@isAuthenticated<types.TDevicePasswordPatch>()
	@AllowedUsers<types.TDevicePasswordPatch>([UserLevel.PRO, UserLevel.ADMIN])
	async password_patch (input: types.TDevicePasswordPatch): Promise<boolean> {
		if (!input.name) throw Error('device name invalid');
		await this.baseAxios.patch(`/${input.name}/password`, {
			device_password: input.device_password,
			client_password: input.client_password
		});
		return true;
	}

	@wrap<types.TDevicePatchRename>()
	@isAuthenticated<types.TDevicePatchRename>()
	async paused_patch (input: types.TDevicePatchPause): Promise<boolean> {
		await this.baseAxios.patch(`/${input.name}/pause`, { pause: input.pause });
		return true;
	}

	@wrap<Required<types.TBaseDevicePatch>>()
	@isAuthenticated<Required<types.TBaseDevicePatch>>()
	async apiKey_patch (input: Required<types.TBaseDevicePatch>): Promise<boolean> {
		await this.baseAxios.patch(`/${input.name}/api_key`, { ...input.authentication });
		return true;
	}

	@wrap<Required<types.TBaseDevicePatch>>()
	@isAuthenticated<Required<types.TBaseDevicePatch>>()
	async cache_delete (input: Required<types.TBaseDevicePatch>): Promise<boolean> {
		await this.baseAxios.delete(`/${input.name}/cache`, { data: { ...input.authentication } });
		return true;
	}

	@wrap<types.TDeviceNamedGet>()
	@isAuthenticated<types.TDeviceNamedGet>()
	async cache_get (name: string): Promise<string> {
		if (!name) throw Error('No device name given');
		const response = await this.baseAxios.get(`/${name}/cache`);
		return response?.data?.response.cache;
	}

}

class AxiosWs {
	private axios_ws_token!: AxiosInstance;

	constructor (wsAuthUrl: string) {
		this.axios_ws_token = Axios.create({
			baseURL: wsAuthUrl,
			withCredentials: false,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-control': 'no-cache'
			}
		});

		this.axios_ws_token.interceptors.response.use(
			(config) => Promise.resolve(config),
			(error) => !error.response ? Promise.reject(new Error('offline')) : Promise.reject(error)
		);

	}

	@wrap()
	async online (): Promise<types.TOnlineResponse> {
		const response = await this.axios_ws_token.get(`/online`);
		return response.data?.response;
	}

	@isAuthenticated<types.TWsAuth>()
	async auth ({ key, password }: types.TWsAuth): Promise<string | null> {
		try {
			const response = await this.axios_ws_token.post(`/client`, {
				key,
				password
			});
			return response.data?.response;
		} catch {
			return null;
		}
	}

}
class SiteStatus {
	private axios_website!: AxiosInstance;

	constructor (websiteUrl: string) {

		this.axios_website = Axios.create({
			baseURL: websiteUrl,
			withCredentials: false,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-control': 'no-cache'
			}
		});

		this.axios_website.interceptors.response.use(
			(config) => Promise.resolve(config),
			(error) => !error.response ? Promise.reject(new Error('offline')) : Promise.reject(error)
		);

	}

	async manifest_online (): Promise<string> {
		try {
			const response = await this.axios_website.get(`/manifest.webmanifest`);
			return response.data.id;
		} catch (_e) {
			return '';
		}
	}

}

export const axios_admin = new AdminUser('authenticated/admin');
export const axios_authenticatedUser = new AuthenticatedUser('authenticated/user');
export const axios_device = new Device('authenticated/device');
export const axios_incognito = new Incognito('incognito');

export const axios_site_status = new SiteStatus(env.domain_www);
export const axios_ws = new AxiosWs(env.domain_auth);
