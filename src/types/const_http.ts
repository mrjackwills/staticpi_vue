/**
 * Original source - https://gist.github.com/scokmen/f813c904ef79022e84ab2409574d1b45
 * Hypertext Transfer Protocol (HTTP) response status codes.
 */
export const HttpCode = {
	CONTINUE: 100 as const,
	SWITCHING_PROTOCOLS: 101 as const,
	PROCESSING: 102 as const,
	OK: 200 as const,
	CREATED: 201 as const,
	ACCEPTED: 202 as const,
	NON_AUTHORITATIVE_INFORMATION: 203 as const,
	NO_CONTENT: 204 as const,
	ALREADY_REPORTED: 208 as const,
	BAD_GATEWAY: 502 as const,
	BAD_REQUEST: 400 as const,
	CONFLICT: 409 as const,
	EXPECTATION_FAILED: 417 as const,
	FAILED_DEPENDENCY: 424 as const,
	FORBIDDEN: 403 as const,
	FOUND: 302 as const,
	GATEWAY_TIMEOUT: 504 as const,
	GONE: 410 as const,
	HTTP_VERSION_NOT_SUPPORTED: 505 as const,
	I_AM_A_TEAPOT: 418 as const,
	IM_USED: 226 as const,
	INSUFFICIENT_STORAGE: 507 as const,
	INTERNAL_SERVER_ERROR: 500 as const,
	LENGTH_REQUIRED: 411 as const,
	LOCKED: 423 as const,
	LOOP_DETECTED: 508 as const,
	METHOD_NOT_ALLOWED: 405 as const,
	MISDIRECTED_REQUEST: 421 as const,
	MOVED_PERMANENTLY: 301 as const,
	MULTI_STATUS: 207 as const,
	MULTIPLE_CHOICES: 300 as const,
	NETWORK_AUTHENTICATION_REQUIRED: 511 as const,
	NOT_ACCEPTABLE: 406 as const,
	NOT_EXTENDED: 510 as const,
	NOT_FOUND: 404 as const,
	NOT_IMPLEMENTED: 501 as const,
	NOT_MODIFIED: 304 as const,
	PARTIAL_CONTENT: 206 as const,
	PAYLOAD_TOO_LARGE: 413 as const,
	PAYMENT_REQUIRED: 402 as const,
	PERMANENT_REDIRECT: 308 as const,
	PRECONDITION_FAILED: 412 as const,
	PRECONDITION_REQUIRED: 428 as const,
	PROXY_AUTHENTICATION_REQUIRED: 407 as const,
	RANGE_NOT_SATISFIABLE: 416 as const,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431 as const,
	REQUEST_TIMEOUT: 408 as const,
	RESET_CONTENT: 205 as const,
	SEE_OTHER: 303 as const,
	SERVICE_UNAVAILABLE: 503 as const,
	SWITCH_PROXY: 306 as const,
	TEMPORARY_REDIRECT: 307 as const,
	TOO_MANY_REQUESTS: 429 as const,
	UNAUTHORIZED: 401 as const,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451 as const,
	UNPROCESSABLE_ENTITY: 422 as const,
	UNSUPPORTED_MEDIA_TYPE: 415 as const,
	UPGRADE_REQUIRED: 426 as const,
	URI_TOO_LONG: 414 as const,
	USE_PROXY: 305 as const,
	VARIANT_ALSO_NEGOTIATES: 506 as const

};

export type HttpCode = (typeof HttpCode)[keyof typeof HttpCode]; 