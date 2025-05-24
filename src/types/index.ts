import type { HttpCode } from '@/types/const_http';
import type { UserLevel } from '@/types/const_userLevel';

export type ConstT<T> = T[keyof T];

export type TAuthentication = { authentication: TAuthObject };

export type TAuthObject = {
	password: string;
	token?: string;
};

export type u<T> = undefined | T;
export type su = u<string>;
export type nu = u<number>;

export type TSnack = {
	message?: string;
	icon?: string;
	timeout?: number;
	type?: 'success' | 'error' | 'info';
	closable?: boolean;
	loading?: boolean;
} & Partial<TSnackPosition>;

export type TSnackPosition = {
	x: TPositionX;
	y: TPositionY;
};
export type TPositionX = 'left' | 'right';
export type TPositionY = 'bottom' | 'top';

export type TSettingSection = '2fa' | 'changepassword' | 'userlevel' | 'changefullname' | 'deleteaccount' | 'downloaddata';

export type TExtraTableRow = {
	timestamp_online: string | undefined;
	ip: string | undefined;
};

export type TRootState = {
	user: {
		_email: string;
		_authenticated: boolean;
		_maxBandwidth: string;
		_maxClients: number;
		_maxMessageSize: number;
		_maxDevices: number;
		_userLevel: UserLevel;
	};
};

// client_bytes_monthly_out
type TBytesTime = 'month' | 'day' | 'total';
type TPiClientTime = `pi_bytes_${TBytesTime}` | `client_bytes_${TBytesTime}`;
type TBandwidthInOut = `${TPiClientTime}_out` | `${TPiClientTime}_in`;

export type TDeviceInfo = { max_clients: number }
  & Record<'name_of_device' | 'api_key' | 'creation_date', string>
  & Record<'client_password_required' | 'device_password_required' | 'paused' | 'structured_data', boolean>
  & Record<'ip' | 'timestamp_online' | 'timestamp_offline', string | undefined>
  & Record<TBandwidthInOut, string>;

export type TLimits = {
	name_of_device: string;
	ttl: number;
};

export type TShowMoreInfo = {
	name_of_device: string;
	value: boolean;
};

export type TSortableColumns = 'connection' | 'name' | 'bandwidth' | 'max clients' | 'structured data' | 'device password' | 'status';
export type TSortedBy = {
	name?: TSortableColumns;
	largestFirst: boolean;
};

export type TSelectConnectedClient = {
	ip: string;
	timestamp_online: string;
};

export type TFooterModel = 'siteVersion' | 'apiVersion' | 'buildDate';
export type TFooterRow = Record<'text' | 'tooltip', string> & { model: TFooterModel };

/**
 * Dialog
 */
export type TConfirmMethod = (authentication: TAuthObject) => Promise<void>;

export type TDialogData = {
	buttonText: string;
	icon: string;
	message: string;
	confirmMethod: TConfirmMethod;
	passwordrequired: boolean;
	title: string;
	twoFABackup: boolean;
	twoFARequired: boolean;
	timeout?: number;
	visible?: boolean;

};

export type TConvertBytes = {
	total: string;
	unit: 'GB' | 'MB' | 'kB';
};

type TBandwidth = TConvertBytes & {	bytes: string };

type TExtraTime = 'all' | 'client' | 'device';

export type TExtraBandwidthDetailed = { period:	'last 24 hours' | 'this month' | 'all time' }
  & Record<TExtraTime, {
  	in: TBandwidth;
  	out: TBandwidth;
  	total: TBandwidth;
  }>;

export type TExtraBandwidthSimple = { period: 'last 24 hours' | 'this month' | 'all time' } & TBandwidth;

/**
 * base text fields
 */
type BaseFields = 'password' | 'email';
type BaseTextFields = Record<'appendIcon' | 'autocomplete' | 'icon' | 'label' | 'type', string>;

export type TRegisterModels = BaseFields | 'full_name' | 'invite';

export type TWsAuth = Record<'key' | 'password', string>;

export type TRegisterTextField = BaseTextFields & {
	clearable: boolean;
	model: TRegisterModels;
};

export type TLoginModel = BaseFields | 'token';
export type TLoginFields = BaseTextFields & { model: TLoginModel };
export type TResetFields = BaseTextFields & { model: 'password' };
export type TDialogFields = BaseTextFields & { model: 'password' };

export type TAddDeviceModel = 'maxClients' | 'password';
export type TAddDeviceFields = {
	description: string;
	heading: string;
	disabled: boolean;
	initStatus: boolean;
	model: TAddDeviceModel;
	errorMessage: TAddDeviceModel;
	initDataStatus?: string;
	dataInput?: boolean;
	inputLabel?: string;
	inputType?: string;
	prependIcon?: string;
};

export type TSwitchButton = {
	color: string;
	click: () => void;
	icon: string;
	class: string;
};

export type TDeviceTableFields = {
	click: () => void;
	color: string;
	icon: string;
	class?: string;
	disabled?: boolean;
};

type TGlobalBandwidthTime = 'hour' | 'day' | 'month' | 'total';
type TGlobalInOut = `${TGlobalBandwidthTime}_in` | `${TGlobalBandwidthTime}_out`;

export type TGlobalBandwidth = Record<TGlobalInOut, number>;

export type TRegisterUser = Record<'email' | 'full_name' | 'invite' | 'password', string> & Record<'agree' | 'age', boolean>;
export type TPasswordPatch = Record<'resetId' | 'password', string> & { token: string | undefined };
export type TSignin = TAuthObject & {
	email: string;
	remember: boolean;
};
export type TPasswordChange = Record<'current_password' | 'new_password', string> & { token?: string } & { remove_sessions: boolean };

export type TTFASetupPatch = { always_required: true } | { always_required: false } & TAuthObject;

export type TToken = { token: string };

type TAxiosStatus = { status: HttpCode };

export type TSigninBody = { response: { two_fa_backup: boolean } };
export type TSigninResponse = TSigninBody & TAxiosStatus;

export type TResetPasswordGet = Record<'two_fa_enabled' | 'two_fa_backup', boolean>;

export type DevicePatch = { apiKey: boolean } | { maxClients: number } | { pause: boolean } | { name: string };

export type TPatchKeys = 'apiKey' | 'pause';

export type TDeviceNamedGet = { name: string };
export type TDeviceNamedDelete = TDeviceNamedGet & TAuthentication;
export type TDeviceNamedPatch = {
	patch: DevicePatch;
	name: string;
	auth?: TAuthObject;
};

export type TBaseDevicePatch = Partial<TAuthentication> & { name: string };
export type TDevicePatchRename = TBaseDevicePatch & { new_name: string };
export type TDeviceDeletePassword = Required<TBaseDevicePatch>;
export type TDevicePasswordPatch = TBaseDevicePatch & Record<'device_password' | 'client_password', string>;
export type TDevicePatchMaxClients = TBaseDevicePatch & { maxClients: number };
export type TDevicePatchPause = TBaseDevicePatch & { pause: boolean };
export type TDeviceStructuredData = TBaseDevicePatch & { structured_data: boolean };

export type TAddDevice = {
	name: string | undefined;
	device_password: string | undefined;
	client_password: string | undefined;
	max_clients: number;
	structured_data: boolean;
};

type TChangePasswordBase = Record<'autocomplete' | 'icon' | 'label' | 'type' | 'appendIcon', string>;
export type TChangeUserPassword = TChangePasswordBase & { model: 'current_password' | 'new_password' };
export type TChangeDevicePassword = TChangePasswordBase & { model: 'device_password' | 'client_password' };

export type TUpdate = Record<'message' | 'server' | 'time', string> & { status: boolean };

export type TServerName = 'website' | 'api' | 'wss' | 'token';

export type TOnlineResponse = Record<'api_version' | 'uptime', string>;
export type TServers = Record<'address' | 'updateTime', string> & Record<'status' | 'loading', boolean> & { description: TServerName } & TOnlineResponse;

export type TComputedBandwidth = Record<'icon' | 'timespan', string> & Record<'in' | 'out', {
	human_readable: TConvertBytes;
	bytes: number;
}>;

export type TNavigationLink = Record<'icon' | 'message' | 'route', string>;

export type TStructuredKey = 'unique' | 'error' | 'cache' | 'data';

export type TAddressRow = Record<'name' | 'address' | 'toCopy' | 'tooltipMessage' | 'hoverMessage', string>;

// Admin
export type TAdminMemory = Record<'uptime' | 'uptime_app' | 'virt' | 'rss', number>;

// block?
export type TAdminLimit = Record<'points' | 'max' | 'ttl', number> & {
	key: string;
	blocked: boolean;
};

export type TAdminUser =
  Record<'full_name' | 'email' | 'timestamp' | 'user_level' | 'registered_user_id', string> &
  Record<'login_attempt_number' | 'two_fa_backup_count' | 'device_count', number> &
  Record<'password_reset' | 'two_fa_enabled' | 'active', boolean> & Record<TBandwidthInOut, string>;

export type TAdminSession = { key: string } &
  Record<'ttl' | 'timestamp', number>;

export type TAdminUserAndSessions = {
	user: TAdminUser;
	sessions: Array<TAdminSession>;
};

export type AdminConnection = Record<'timestamp' | 'device_id', number> &
  Record<'device_type' | 'ulid' | 'ip', string>;

export type AdminDeviceAndConnections = {
	device: TDeviceInfo;
	connections: Array<AdminConnection>;
};

export type TAdminEmailCount = Record<'hour' | 'total', number>;
export type TAdminConnectedCount = Record<'pi' | 'client', number>;

export type TAdminContactMessage = {
	contact_message_id: number;
	registered_user_id: number | null;
} & Record<'ip' | 'timestamp' | 'message' | 'user_agent' | 'email', string>;

export type TAdminConnectionRemove = Record<'connection_ulid' | 'device_type', string> & { device_id: number };

export type TAdminEmailDevice = TAdminUserDelete & { device_name: string };
export type TAdminUserDelete = { email: string } & TAuthObject;
export type TAdminInvite = {
	count: number;
	invite: string;
};
export type TAdminInvitePost = TAdminInvite & TAuthObject;
export type TContact = Record<'email' | 'message', string>;
