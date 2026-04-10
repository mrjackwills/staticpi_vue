import type { VitePWAOptions } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import babel from '@rolldown/plugin-babel'
// Plugins
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Unfonts from 'unplugin-fonts/vite'
import Components from 'unplugin-vue-components/vite'
// Utilities
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression2'
import { VitePWA } from 'vite-plugin-pwa'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const pwaOptions: Partial<VitePWAOptions> = {
	base: '/',
	registerType: 'prompt',
	includeAssets: ['favicon.ico'],
	manifest: {
		display: 'standalone',
		name: 'staticPi',
		description: 'simple messaging service',
		short_name: 'staticPi',
		theme_color: '#c31c4a',
		background_color: '#fafafa',
		id: process.env.npm_package_version,
		icons: [
			{
				src: 'img/icons/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: 'img/icons/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},

		],
	},
}

function decoratorPreset (options: Record<string, unknown>) {
	return {
		preset: () => ({
			plugins: [['@babel/plugin-proposal-decorators', options]],
		}),
		rolldown: {
			// Only run this transform if the file contains a decorator.
			filter: {
				code: '@',
			},
		},
	}
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({ template: { transformAssetUrls } }),
		// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
		vuetify({ autoImport: true }),
		Components(),
		AutoImport({
			include: [
				/\.[tj]sx?$/,
				/\.vue$/,
				/\.vue\?vue/,
				/\.md$/,
			],
			imports: [
				'vue',
				'vue-router',
			],
			dts: 'src/auto-imports.d.ts',
			eslintrc: { enabled: true },
			dirs: ['src/store'],
			vueTemplate: false,
		}),
		Unfonts({
			custom: {
				families: [
					{
						name: 'Titillium Web',
						local: 'Titillium Web',
						src: './src/assets/fonts/*.woff2',
					},
				],
				display: 'auto',
				preload: true,
				injectTo: 'head-prepend',
			},
		}),
		VitePWA(pwaOptions),
		babel({ presets: [decoratorPreset({ version: '2023-11' })] }),
		compression({
			algorithms: ['brotliCompress', 'gzip'],
			exclude: [/\.(br)$/, /\.(gz)$/],
		}),
	],
	define: {
		'process.env': {},
		'import.meta.env.BUILD_DATE': Date.now(),
		'import.meta.env.VERSION': JSON.stringify(process.env.npm_package_version),
	},
	resolve: {
		alias: { '@': fileURLToPath(new URL('src', import.meta.url)) },
		extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
	},
	server: {
		port: 8002,
		host: '127.0.0.1',
	},
})
