import type * as types from '@/types'
import { HttpCode } from '@/types/const_http'
// import { isHttpCode } from '@/types/typeGuards'
import { env } from '@/vanillaTS/env'
import { snackError } from './snack'

type ErrorData = { data: { response: string } }

class HttpError extends Error {
	response?: { status: number, data: any }

	constructor (message: string, response?: { status: number, data: any }) {
		super(message)
		this.name = 'HttpError'
		this.response = response
	}
}

const REQUEST_TIMEOUT = 60_000

async function fetchRequest (
	baseURL: string,
	method: string,
	path: string,
	body?: any,
): Promise<{ data: any, status: number }> {
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

	try {
		const isFormData = body instanceof FormData

		const headers: Record<string, string> = {
			'Cache-Control': 'no-cache',
			...(!isFormData && {
				'Content-Type': 'application/json; charset=utf-8',
				Accept: 'application/json',
			}),
		}

		const init: RequestInit = {
			method,
			// TODO this isn't great
			credentials: baseURL === env.domain_api ? 'include' : 'omit',
			headers,
			signal: controller.signal,
			...(body !== undefined && { body: isFormData ? body : JSON.stringify(body) }),
		}

		const url = new URL(path.startsWith('/') ? path.slice(1) : path, baseURL.endsWith('/') ? baseURL : `${baseURL}/`).href
		const response = await fetch(url, init)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ response: 'unable to access server' }))
			throw new HttpError(`HTTP ${response.status}`, { status: response.status, data: errorData })
		}

		let parsed = {}
		try {
			const text = await response.text()
			parsed = text ? JSON.parse(text) : {}
		} catch {
			parsed = { response: 'invalid json response' }
		}
		return { data: parsed, status: response.status }
	} catch (error) {
		if (error instanceof HttpError) {
			throw error
		}
		throw new Error('offline', { cause: error })
	} finally {
		clearTimeout(timeoutId)
	}
}

function createClient (baseURL: string) {
	return {
		get: (path: string) =>
			fetchRequest(baseURL, 'GET', path, undefined),

		post: (path: string, body?: any) =>
			fetchRequest(baseURL, 'POST', path, body),

		patch: (path: string, body?: any) =>
			fetchRequest(baseURL, 'PATCH', path, body),

		put: (path: string, body?: any) =>
			fetchRequest(baseURL, 'PUT', path, body),

		delete: (path: string, body?: any) =>
			fetchRequest(baseURL, 'DELETE', path, body),
	}
}

const baseFetchApi = createClient(env.domain_api)
const baseFetchWww = createClient(env.domain_www)
const baseFetchAuth = createClient(env.domain_auth)

function isAuthenticated (fn: any, _context: ClassMethodDecoratorContext) {
	async function wrapped (this: any, ...args: any[]) {
		if (userModule().authenticated) {
			return await fn.call(this, ...args)
		}
		snackError({ message: 'invalid authentication' })
	}
	return wrapped
}

function isNotAuthenticated (fn: any, _context: ClassMethodDecoratorContext) {
	async function wrapped (this: any, ...args: any[]) {
		if (userModule().authenticated) {
			snackError({ message: 'invalid authentication' })
		} else {
			return await fn.call(this, ...args)
		}
	}
	return wrapped
}

function isAdmin (fn: any, _context: ClassMethodDecoratorContext) {
	async function wrapped (this: any, ...args: any[]) {
		if (userModule().authenticated && userModule().isAdminUser) {
			return await fn.call(this, ...args)
		}
		snackError({ message: 'invalid authentication' })
	}
	return wrapped
}

function wrap (fn: any, _context: ClassMethodDecoratorContext) {
	async function wrapped (this: any, ...args: any[]) {
		try {
			return await fn.apply(this, args)
		} catch (error) {
			const [browser_store, user_store] = [browserModule(), userModule()]

			loadingModule().set_loading(false)
			const e = error as HttpError

			if (e.message === 'offline') {
				if (browser_store.online) {
					snackError({ message: 'server offline' })
				}
				browser_store.set_online(false)
				return
			}

			if (e.response?.status === HttpCode.FORBIDDEN) {
				const p = e.response as ErrorData
				const authenticated = user_store.authenticated
				const message = authenticated ? 'You have been signed out' : p?.data?.response
				if (authenticated) {
					await user_store.clientSideSignout()
				}
				snackError({ message })
			}

			if (e.response?.status === HttpCode.TOO_MANY_REQUESTS) {
				const p = e.response as unknown as ErrorData
				snackError({ message: p.data.response })
				return
			}

			const p = e?.response as unknown as ErrorData
			snackError({ message: p?.data?.response ?? 'unable to access server' })
		}
	}
	return wrapped
}

class Incognito {
	readonly #url = 'incognito'

	@wrap
	@isNotAuthenticated
	async forgot_post (email: string): Promise<string | undefined> {
		const response = await baseFetchApi.post(`${this.#url}/reset`, { email })
		return response?.data?.response
	}

	@wrap
	// / 1000ms timeout for this call - good idea?
	async online_get (): Promise<types.TOnlineResponse> {
		// TODO custom timeout here?
		const response = await baseFetchApi.get(`${this.#url}/online`)
		const browser_store = browserModule()
		browser_store.set_online(true)
		browser_store.set_api_version(response.data.response.api_version)
		return response?.data?.response
	}

	@wrap
	async bandwidth_get (): Promise<types.TGlobalBandwidth> {
		const response = await baseFetchApi.get(`${this.#url}/bandwidth`)
		return response?.data?.response
	}

	@wrap
	@isNotAuthenticated
	async register_post (registerObject: types.TRegisterUser): Promise<string> {
		const response = await baseFetchApi.post(`${this.#url}/register`, registerObject)
		return response?.data?.response
	}

	@wrap
	@isNotAuthenticated
	async reset_get (hexId: string): Promise<types.TResetPasswordGet> {
		const { data } = await baseFetchApi.get(`${this.#url}/reset/${hexId}`)
		return data?.response
	}

	@wrap
	@isNotAuthenticated
	async reset_patch ({ resetId, password, token }: types.TPasswordPatch): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/reset/${resetId}`, {
			password,
			token,
		})
		return true
	}

	@wrap
	async signin_post (authObject: types.TSignin): Promise<types.TSigninResponse> {
		const response = await baseFetchApi.post(`${this.#url}/signin`, authObject)
		return {
			response: response.data.response,
			status: response.status as types.THttpCodeVal,
		}
	}

	@wrap
	@isNotAuthenticated
	async verify_get (verifyId: string): Promise<boolean> {
		await baseFetchApi.get(`${this.#url}/verify/${verifyId}`)
		return true
	}

	@wrap
	async contact_post (data: types.TContact): Promise<boolean> {
		await baseFetchApi.post(`${this.#url}/contact`, data)
		return true
	}
}

class AdminUser {
	readonly #url = 'authenticated/admin'
	@wrap
	@isAuthenticated
	async admin_get (): Promise<boolean> {
		await baseFetchApi.get(this.#url)
		return true
	}

	@wrap
	@isAdmin
	async memory_get (): Promise<types.TAdminMemory> {
		const response = await baseFetchApi.get(`${this.#url}/memory`)
		return response.data.response
	}

	@wrap
	@isAdmin
	async limit_get (): Promise<Array<types.TAdminLimit>> {
		const response = await baseFetchApi.get(`${this.#url}/limit`)
		return response.data.response
	}

	@wrap
	@isAdmin
	async limit_delete (key: string): Promise<void> {
		await baseFetchApi.delete(`${this.#url}/limit`, { key })
	}

	@wrap
	@isAdmin
	async contact_get (): Promise<Array<types.TAdminContactMessage>> {
		const response = await baseFetchApi.get(`${this.#url}/contact`)
		return response.data.response
	}

	@wrap
	@isAdmin
	async contact_delete (contact_message_id: number): Promise<void> {
		await baseFetchApi.delete(`${this.#url}/contact`, { contact_message_id })
	}

	@wrap
	@isAdmin
	async connections_get (): Promise<types.TAdminConnectedCount> {
		const response = await baseFetchApi.get(`${this.#url}/connection`)
		return response.data.response
	}

	@wrap
	@isAdmin
	async email_log_get (): Promise<types.TAdminEmailCount> {
		const response = await baseFetchApi.get(`${this.#url}/emails`)
		return response.data.response
	}

	@wrap
	@isAdmin
	async invite_get (): Promise<Array<types.TAdminInvite>> {
		const response = await baseFetchApi.get(`${this.#url}/invite`)
		return response.data.response
	}

	@wrap
	@isAdmin
	async invite_post (data: types.TAdminInvitePost): Promise<boolean> {
		await baseFetchApi.post(`${this.#url}/invite`, data)
		return true
	}

	@wrap
	@isAdmin
	async invite_delete (invite: string): Promise<boolean> {
		await baseFetchApi.delete(`${this.#url}/invite`, { invite })
		return true
	}

	@wrap
	@isAdmin
	async connection_delete (data: types.TAdminConnectionRemove): Promise<boolean> {
		await baseFetchApi.delete(`${this.#url}/connection`, { ...data })
		return true
	}

	@wrap
	@isAdmin
	async session_delete (key: string): Promise<void> {
		await baseFetchApi.delete(`${this.#url}/session/${key}`)
	}

	@wrap
	@isAdmin
	async all_users_get (): Promise<Array<types.TAdminUserAndSessions>> {
		const response = await baseFetchApi.get(`${this.#url}/users`)
		return response.data.response
	}

	@wrap
	@isAdmin
	async user_connections_get (email: string): Promise<Array<types.AdminDeviceAndConnections>> {
		const response = await baseFetchApi.get(`${this.#url}/user/${email}/devices`)
		return response.data.response
	}

	@wrap
	@isAdmin
	async attempt_delete (email: string): Promise<void> {
		await baseFetchApi.delete(`${this.#url}/user/${email}/attempt`)
	}

	@wrap
	@isAdmin
	async active_patch (email: string): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/user/${email}/active`)
		return true
	}

	@wrap
	@isAdmin
	async user_delete (data: types.TAdminUserDelete): Promise<boolean> {
		await baseFetchApi.delete(`${this.#url}/user/${data.email}`, {
			password: data.password,
			token: data.token,
		})
		return true
	}

	@wrap
	@isAdmin
	async device_delete (data: types.TAdminEmailDevice): Promise<boolean> {
		await baseFetchApi.delete(`${this.#url}/user/${data.email}/device/${data.device_name}`, {
			password: data.password,
			token: data.token,
		})
		return true
	}

	@wrap
	@isAdmin
	async device_pause_patch (data: types.TAdminEmailDevice): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/user/${data.email}/device/${data.device_name}`, {
			password: data.password,
			token: data.token,
		})
		return true
	}
}

class AuthenticatedUser {
	readonly #url = 'authenticated/user'

	@wrap
	async signout_post (): Promise<void> {
		const user_store = userModule()
		await user_store.clientSideSignout()
		await baseFetchApi.post(`${this.#url}/signout`)
	}

	@wrap
	@isAuthenticated
	async account_delete (data: types.TAuthObject): Promise<boolean> {
		await baseFetchApi.delete(this.#url, { ...data })
		return true
	}

	@wrap
	@isAuthenticated
	async data_get (data: types.TAuthObject): Promise<string> {
		const response = await baseFetchApi.post(`${this.#url}/data`, data)
		return response?.data?.response
	}

	@wrap
	async user_get (): Promise<boolean> {
		const response = await baseFetchApi.get(this.#url)
		const [twoFA_store, user_store] = [twoFAModule(), userModule()]
		user_store.set_email(response.data.response.email)
		user_store.set_full_name(response.data.response.full_name)
		user_store.set_maxBandwidth(response.data.response.max_bandwidth)
		user_store.set_maxClients(response.data.response.max_clients)
		user_store.set_maxDevices(response.data.response.max_devices)
		user_store.set_maxMessageSize(response.data.response.max_message_size)
		user_store.set_timestamp(response.data.response.timestamp)
		user_store.set_userLevel(response.data.response.user_level)
		twoFA_store.set_alwaysRequired(response.data.response.two_fa_always_required)
		twoFA_store.set_active(response.data.response.two_fa_active)
		twoFA_store.set_count(response.data.response.two_fa_count)
		user_store.set_authenticated(true)
		return true
	}

	@wrap
	@isAuthenticated
	async password_patch (input: types.TPasswordChange): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/password`, input)
		return true
	}

	@wrap
	@isAuthenticated
	async name_patch (input: string): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/name`, { full_name: input })
		await this.user_get()
		return true
	}

	@wrap
	@isAuthenticated
	async twoFA_delete (authentication: types.TAuthObject): Promise<boolean> {
		await baseFetchApi.delete(`${this.#url}/twofa`, { ...authentication })
		await this.user_get()
		return true
	}

	@wrap
	@isAuthenticated
	async twoFA_put (authentication: types.TAuthObject): Promise<boolean> {
		await baseFetchApi.put(`${this.#url}/twofa`, { ...authentication })
		await this.user_get()
		return true
	}

	// Delete all backup codes
	@wrap
	@isAuthenticated
	async twoFA_backup_delete (authentication: types.TAuthObject): Promise<boolean> {
		await baseFetchApi.delete(`${this.#url}/twofa/backup`, { ...authentication })
		await this.user_get()
		return true
	}

	// Generate backup codes
	@wrap
	@isAuthenticated
	async twoFA_backup_post (): Promise<Array<string>> {
		const response = await baseFetchApi.post(`${this.#url}/twofa/backup`)
		await this.user_get()
		return response?.data?.response?.backups
	}

	// Re-generate backup codes, requires auth
	@wrap
	@isAuthenticated
	async twoFA_backup_patch (authentication: types.TAuthObject): Promise<Array<string>> {
		const response = await baseFetchApi.patch(`${this.#url}/twofa/backup`, authentication)
		await this.user_get()
		return response?.data?.response?.backups
	}

	@wrap
	@isAuthenticated
	async setupTwoFA_get (): Promise<boolean> {
		const response = await baseFetchApi.get(`${this.#url}/setup/twofa`)
		const twoFA_store = twoFAModule()
		twoFA_store.set_secret(response?.data?.response?.secret)
		return true
	}

	@wrap
	@isAuthenticated
	async setupTwoFA_delete (): Promise<void> {
		await baseFetchApi.delete(`${this.#url}/setup/twofa`)
	}

	@wrap
	@isAuthenticated
	async twoFA_patch (body: types.TTFASetupPatch): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/twofa`, body)
		await this.user_get()
		return true
	}

	@wrap
	@isAuthenticated
	async setupTwoFA_post (token: types.TToken): Promise<boolean> {
		await baseFetchApi.post(`${this.#url}/setup/twofa`, token)
		return true
	}
}

class Device {
	readonly #url = 'authenticated/device'
	@wrap
	@isAuthenticated
	async all_delete (authentication: types.TAuthObject): Promise<boolean> {
		await baseFetchApi.delete(this.#url, { ...authentication })
		const device_store = deviceModule()
		device_store.set_all_devices([])
		return true
	}

	@wrap
	@isAuthenticated
	async deviceAll_get (): Promise<boolean> {
		const response = await baseFetchApi.get(this.#url)
		const device_store = deviceModule()
		device_store.set_all_devices(response.data?.response?.devices)
		device_store.set_all_limits(response.data?.response?.limits)
		device_store.set_timestamp()
		return true
	}

	@wrap
	@isAuthenticated
	async deviceAdd_post (newDevice: types.TAddDevice): Promise<string> {
		const [device_store, user_store] = [deviceModule(), userModule()]
		if (device_store.numberOfDevices === user_store.maxDevices) {
			throw new Error('Max device limit reached')
		}
		if (newDevice.device_password && !newDevice.client_password) {
			newDevice.client_password = newDevice.device_password
		}
		const response = await baseFetchApi.post(this.#url, newDevice)
		return response.data?.response
	}

	@wrap
	@isAuthenticated
	async named_delete (data: types.TDeviceNamedDelete): Promise<boolean> {
		if (!data.name) {
			throw new Error('No device name given')
		}
		await baseFetchApi.delete(`${this.#url}/${data.name}`, {
			password: data.authentication.password,
			token: data.authentication.token,
		})
		return true
	}

	@wrap
	@isAuthenticated
	async named_get (data: types.TDeviceNamedGet): Promise<Array<types.TSelectConnectedClient> | undefined> {
		if (!data.name) {
			throw new Error('No device name given')
		}
		const response = await baseFetchApi.get(`${this.#url}/${data.name}`)
		return response?.data?.response
	}

	@wrap
	@isAuthenticated
	// @AllowedUsers([UserLevel.PRO, UserLevel.ADMIN])
	async maxClients_patch (input: types.TDevicePatchMaxClients): Promise<boolean> {
		if (!input.maxClients || Number.isNaN(Number(input.maxClients))) {
			throw new Error('Max clients invalid')
		}
		await baseFetchApi.patch(`${this.#url}/${input.name}/max_clients`, { max_clients: Number(input.maxClients) })
		return true
	}

	@wrap
	@isAuthenticated
	// @AllowedUsers<types.TDeviceStructuredData>([UserLevel.PRO, UserLevel.ADMIN])
	async structuredData_patch (input: types.TDeviceStructuredData): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/${input.name}/structured_data`, { structured_data: input.structured_data })
		return true
	}

	@wrap
	@isAuthenticated
	// @AllowedUsers<types.TDevicePatchRename>([UserLevel.PRO, UserLevel.ADMIN])
	async rename_patch (input: types.TDevicePatchRename): Promise<boolean> {
		if (!input.name || !input.new_name) {
			throw new Error('device name invalid')
		}
		await baseFetchApi.patch(`${this.#url}/${input.name}/rename`, { new_name: input.new_name })
		return true
	}

	@wrap
	@isAuthenticated
	// @AllowedUsers<types.TDevicePatchRename>([UserLevel.PRO, UserLevel.ADMIN])
	async password_delete (input: types.TDeviceDeletePassword): Promise<boolean> {
		if (!input.name) {
			throw new Error('device name invalid')
		}
		await baseFetchApi.delete(`${this.#url}/${input.name}/password`, { ...input.authentication })
		return true
	}

	@wrap
	@isAuthenticated
	// @AllowedUsers<types.TDevicePasswordPatch>([UserLevel.PRO, UserLevel.ADMIN])
	async password_patch (input: types.TDevicePasswordPatch): Promise<boolean> {
		if (!input.name) {
			throw new Error('device name invalid')
		}
		await baseFetchApi.patch(`${this.#url}/${input.name}/password`, {
			device_password: input.device_password,
			client_password: input.client_password,
		})
		return true
	}

	@wrap
	@isAuthenticated
	async paused_patch (input: types.TDevicePatchPause): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/${input.name}/pause`, { pause: input.pause })
		return true
	}

	@wrap
	@isAuthenticated
	async apiKey_patch (input: Required<types.TBaseDevicePatch>): Promise<boolean> {
		await baseFetchApi.patch(`${this.#url}/${input.name}/api_key`, { ...input.authentication })
		return true
	}

	@wrap
	@isAuthenticated
	async cache_delete (input: Required<types.TBaseDevicePatch>): Promise<boolean> {
		await baseFetchApi.delete(`${this.#url}/${input.name}/cache`, { ...input.authentication })
		return true
	}

	@wrap
	@isAuthenticated
	async cache_get (name: string): Promise<string> {
		if (!name) {
			throw new Error('No device name given')
		}
		const response = await baseFetchApi.get(`${this.#url}/${name}/cache`)
		return response?.data?.response.cache
	}
}

class FetchWS {
	@wrap
	async online (): Promise<types.TOnlineResponse> {
		const response = await baseFetchAuth.get(`/online`)
		return response.data?.response
	}

	@isAuthenticated
	async auth ({ key, password }: types.TWsAuth): Promise<string | null> {
		try {
			const response = await baseFetchAuth.post(`/client`, {
				key,
				password,
			})
			return response.data?.response
		} catch {
			return null
		}
	}
}
class SiteStatus {
	async manifest_online (): Promise<string> {
		try {
			const response = await baseFetchWww.get(`/manifest.webmanifest`)
			return response.data.id
		} catch {
			return ''
		}
	}
}

export const fetch_admin = new AdminUser()
export const fetch_authenticatedUser = new AuthenticatedUser()
export const fetch_device = new Device()
export const fetch_incognito = new Incognito()

export const fetch_site_status = new SiteStatus()
export const fetch_WS = new FetchWS()
