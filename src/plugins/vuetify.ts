import 'vuetify/styles';
import '@/scss/variables.scss';

import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { createVuetify } from 'vuetify';
import { nonce } from '@/vanillaTS/globalConst';

export default createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
	
	theme: {
		cspNonce: nonce,
		themes: {
			light: {
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
					rowHover: '#dededf'
				},
			},
		},
	},
});