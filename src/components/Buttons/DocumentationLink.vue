<template>
	<router-link target='_blank' :to>
		<v-icon color='primary' :icon='mdiLinkVariant' :size='iconSize' />

		<v-tooltip v-if='show_tooltip' activator='parent' content-class='tooltip' location='top center'>
			<span> open documentation</span>
		</v-tooltip>
	</router-link>
</template>

<script setup lang="ts">
import { mdiLinkVariant } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { FrontEndRoutes } from '@/types/const_routes'

// Don't show tooltips when on android or ios if also on mobile view!
const show_tooltip = computed(() => !(browserModule().android_ios && useDisplay().mobile.value))

const to = computed(() => `${FrontEndRoutes.DOCUMENTATION}#${props.section}`)

const iconSize = computed(() => props.xsmall ? 'x-small' : (props.small ? 'small' : 'default'))

const props = withDefaults(defineProps<{
	section: string
	small?: boolean
	xsmall?: boolean
}>(), {
	small: true,
	xsmall: false,
})

</script>
