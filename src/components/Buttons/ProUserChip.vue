<template>
	<v-col cols='auto' class='unselectable ma-0 pa-1 ml-1' :order='order'>
		<v-chip :size='size' :ripple='false' label color='secondary' variant='flat' >
			<v-row align='center' justify='center' class='ma-0 pa-0 no-gutters'>
				<v-col cols='auto' class='ma-0 pa-0 mr-1'>
					<v-icon :size='size' :icon='mdiStarCircle' />
				</v-col>
				<v-col cols='auto' class='ma-0 pa-0'>pro user only</v-col>
			</v-row>

		</v-chip>
	</v-col>
</template>

<script setup lang="ts">
import { mdiStarCircle } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const size = computed(() => {
	if (mobile.value) {
		return 'x-small';
	} else {
		'default';
	}
});

defineProps({
	order: {
		type: String,
		default: '1'
	}
});
</script>
