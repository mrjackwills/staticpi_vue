class Env {
	readonly #app_version = String(import.meta.env.VERSION);
	readonly #domain_api = String(import.meta.env.VITE_APP_DOMAIN_API);
	readonly #domain_auth = String(import.meta.env.VITE_APP_DOMAIN_AUTH);
	readonly #domain_wss = String(import.meta.env.VITE_APP_DOMAIN_WSS);
	readonly #domain_www = String(import.meta.env.VITE_APP_DOMAIN_WWW);
	readonly #build_date = new Date(import.meta.env.BUILD_DATE);
	readonly #mode_production = import.meta.env.PROD ;

	get app_version (): string {
		return this.#app_version;
	}

	get build_date (): string {
		return this.#build_date.toISOString();
	}

	get domain_api (): string {
		return this.#domain_api;
	}
	
	get domain_auth (): string {
		return this.#domain_auth;
	}
		
	get domain_wss (): string {
		return this.#domain_wss;
	}

	get domain_www (): string {
		return this.#domain_www;
	}

	get mode_production (): boolean {
		return this.#mode_production;
	}
}

export const env = new Env();