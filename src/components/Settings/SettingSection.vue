<template>
	<AppCard
		my='my-2'
		sm='12'
		md='12'
		lg='11'
		xl='11'
		:disabled='disabled'
	>
		<template v-slot:body>
			<v-row align='center' justify='start' class='ma-0 pa-0 no-gutters my-3'>
				<v-col cols='auto' class='ma-a pa-0'>
					<slot name='titleIcon' />
				</v-col>
				<v-col cols='auto' class='ma-0 pa-0 font-weight-bold text-pi' :class='title'>
					<slot name='title' />
				</v-col>
				<v-spacer />
				<ProUserChip v-if='proOnly' />
				
			</v-row>
			<v-row align='center' justify='center' class='ma-0 pa-0'>
				<v-col cols='12' class='pa-0 ma-0 text-body-1'>
					<slot name='text_description' />
				</v-col>
			</v-row>
			<v-row align='center' justify='center' class='ma-0 pa-0'>
				<v-col cols='12' class='pa-0 ma-0'>
					<slot name='body' />
				</v-col>
			</v-row>

			<v-row justify='center' class='pa-0 ma-0'>
				<v-col cols='12' md='8' lg='4' class='pa-0 ma-0'>
					<v-row justify='space-around' class='pa-0 ma-0'>
						<v-col cols='6' md='auto' class='pa-0 ma-0' >
							<slot name='cancel_button' />
						</v-col>
						<v-col cols='6' md='auto' class='pa-0 ma-0' >
							<slot name='save_button' />
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row align='center' justify='center' class='ma-0 pa-0 my-3'>
				<v-col cols='12' class='ma-0 pa-0'>
					<slot name='action_button' />
				</v-col>
			</v-row>
		</template>
	</AppCard>
		
</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay();

const title = computed((): string => {
	return smAndDown.value ? 'text-h7' : 'text-h6';
});

withDefaults(defineProps<{disabled: boolean, proOnly: boolean}>(), { disabled: false, proOnly: false });
</script>