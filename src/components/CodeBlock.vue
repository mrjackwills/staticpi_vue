<template>
	<v-card :color='vsColor' class='no-gutters ma-0 pa-0' >

		<v-row class='ma-0 pa-0 no-gutters' align='center' justify='center'>
			
			<v-col cols='12' class='ma-0 pa-0'>

				<v-row no-gutters class='ma-0 pa-0 text-white' align='center' justify='start' v-if='titleBar'>

					<v-col cols='auto' v-for='(item, index) in codeIcons' :key='index' class='ml-2'>
						<v-icon size='x-small' :color='item' :icon='mdiCheckboxBlankCircle' />
					</v-col>

					<v-col cols='auto' class='font-italic ml-12 unselectable mx-2 text-cardColor' :class='smallText'>
						{{ filename }}
					</v-col>

					<v-col cols='auto' class='font-italic unselectable cl'>
						<CopyButton
							:hoverMessage='`click to copy "${filename}"`'
							:small='true'
							:toCopy='code'
							:tooltipMessage='"code copied!"'
							color='cardColor'
						/>
					</v-col>

				</v-row>

				<v-row align='center' justify='center' class='ma-0 pa-0 text-white' >
					<v-col cols='12' class='ma-0 pa-0' :nonce='`nonce-${nonce}`'>

						<pre
							class='language-js'
							v-html='highlighted_code' />
					</v-col>
				</v-row>

			</v-col>
		</v-row>
		
	</v-card>
	
</template>

<script setup lang="ts">
import '@/scss/vscode.css';
import { mdiCheckboxBlankCircle } from '@mdi/js';
import { nonce } from '@/vanillaTS/globalConst';
import { useDisplay } from 'vuetify';
import prism from 'prismjs';

const { mobile } = useDisplay();

const smallText = computed((): string => {
	return mobile.value ? 'small-text' : '';
});
const vsColor = computed((): string => {
	return '#4b4453';
});

const highlighted_code = computed((): string => {
	return prism.highlight(props.code, prism.languages.js, 'js').trim();
});

const codeIcons= [ '#ff5f56', '#ffbd2e', '#27c93f' ];

const props = withDefaults(defineProps<{code: string, filename?: string, titleBar?: boolean}>(), {
	filename: '',
	titleBar: true,
});

</script>
