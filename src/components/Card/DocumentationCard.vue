<template>
	<AppCard
		sm='12'
		md='12'
		lg='11'
		xl='11'
	>
		<template v-slot:body>
			<v-row align='center' justify='center' class='ma-0 pa-0 px-2 px-md-12'  :class='smallText'>
				<v-col cols='12' class='ma-0 pa-0'>
					<v-row align='center' justify='start' class='ma-0 pa-0'>
						<v-col cols='auto' class='ma-0 pa-0' order='2'>
							<ProUserChip :class='proMargin' class='ma-1 ml-3' v-if='pro' />
						</v-col>
						<v-col cols='auto' class='ma-0 pa-0' order='1'>
							<AppSubheading :heading='heading' justify='start' :id='createId' />
						</v-col>
					</v-row>
					<v-divider class='mb-1' />
				</v-col>
				<v-col cols='12' class='ma-0 pa-0 mb-4'>
					<slot name='doc-body'></slot>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import AppCard from '@/components/Card/AppCard.vue';
import AppSubheading from '@/components/Card/SubHeading.vue';
import ProUserChip from '@/components/Buttons/ProUserChip.vue';

const { mobile } = useDisplay();

const createId = computed((): string => {
	return props.heading.toLowerCase().replaceAll(' ', '-');
});
const proMargin = computed(() :string => {
	return mobile.value ? 'mr-2' : 'mr-12';
});
const smallText = computed((): string => {
	return mobile.value ? 'small-text' : '';
});

const props = defineProps({
	heading: {
		type: String,
		required: true
	},
	pro: {
		type: Boolean,
		default: false
	}
});
</script>