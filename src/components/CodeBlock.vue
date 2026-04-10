<template>
	<v-card class='ma-0 pa-0' :color='vsColor' density='compact'>

		<v-row class='align-center ma-0 pa-0  justify-center' density='compact'>

			<v-col class='ma-0 pa-0' cols='12'>

				<v-row
					v-if='titleBar'
					class='ma-0 pa-0 text-white justify-start align-center'
					density='compact'
				>

					<v-col v-for='(item, index) in codeIcons' :key='index' class='ml-2' cols='auto'>
						<v-icon :color='item' :icon='mdiCheckboxBlankCircle' size='x-small' />
					</v-col>

					<v-col class='font-italic ml-12 unselectable mx-2 text-cardColor' :class='smallText' cols='auto'>
						{{ filename }}
					</v-col>

					<v-col class='font-italic unselectable cl' cols='auto'>
						<CopyButton
							color='cardColor'
							:hover-message='`click to copy "${filename}"`'
							:small='true'
							:to-copy='code'
							:tooltip-message='"code copied!"'
						/>
					</v-col>

				</v-row>

				<v-row class='align-center ma-0 pa-0 text-white justify-center'>
					<v-col class='ma-0 pa-0' cols='12'>

						<pre class='language-js' v-html='highlighted_code' />
					</v-col>
				</v-row>

			</v-col>
		</v-row>

	</v-card>

</template>

<script setup lang="ts">
import { mdiCheckboxBlankCircle } from '@mdi/js'
import prism from 'prismjs'
import { useDisplay } from 'vuetify'
import '@/scss/vscode.css'

const { mobile } = useDisplay()

const smallText = computed(() => mobile.value ? 'small-text' : '')
const vsColor = '#4b4453'

const highlighted_code = computed(() => {
	return prism.languages.js ? prism.highlight(props.code, prism.languages.js, 'js').trim() : ''
})

const codeIcons = ['#ff5f56', '#ffbd2e', '#27c93f']

const props = withDefaults(defineProps<{
	code: string
	filename?: string
	titleBar?: boolean
}>(), {
	filename: '',
	titleBar: true,
})

</script>
