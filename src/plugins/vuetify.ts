import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import 'vuetify/styles'
import '@/scss/variables.scss'

const customLightTheme: ThemeDefinition = {
	dark: false,
	colors: {
		primary: '#329C74',
		primaryLighter: '#46A581',
		secondary: '#5ca3d6',
		accent: '#eda3e4',
		error: '#c36726',
		pi: '#c31c4a',
		piDarken: '#9C163B',
		app: '#D4B56A',
		backgroundColor: '#f5f4f2',
		cardColor: '#fafafa',
		rowHover: '#dededf',
	},
}

export default createVuetify({
	defaults: {
		VRow: {
			density: 'compact',
		},
	},
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: { mdi },
	},

	theme: {
		defaultTheme: 'customLightTheme',
		themes: { customLightTheme },
	},
})
