<template>
	<ActionButton
		:block='true'
		class='mr-2'
		color='pi'
		:disabled
		:icon='mdiArrowLeft'
		:icon-first='true'
		text='back'
		@click='goBack'
	/>
</template>

<script setup lang='ts'>
import { mdiArrowLeft } from '@mdi/js'
import { FrontEndRoutes } from '@/types/const_routes'

const router = useRouter()

function goBack (): void {
	if (browserModule().history > 1) router.back()
	else router.push(FrontEndRoutes.BASE)
}

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })
</script>
