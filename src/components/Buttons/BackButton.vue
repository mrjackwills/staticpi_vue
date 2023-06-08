<template>
	<ActionButton
		@click='goBack'
		:block='true'
		:icon='mdiArrowLeft'
		:iconFirst='true'
		class='mr-2'
		color='pi'
		text='back'
		:disabled='disabled'
	/>
</template>

<script setup lang='ts'>
import { FrontEndRoutes } from '@/types/enum_routes';
import { mdiArrowLeft } from '@mdi/js';

const router = useRouter();

const goBack = (): void => {
	if (browserModule().history > 1) router.back();
	else router.push(FrontEndRoutes.BASE);
};

withDefaults(defineProps<{disabled?: boolean}>(), { disabled: false });
</script>