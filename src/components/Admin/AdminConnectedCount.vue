<template>
	<AppCard
		sm='12'
		md='12'
		lg='11'
		xl='11'
		heading='connections'
		heading_justify='start'
		heading_class='ml-2'
		heading_size='text-h6'
		my=''
	>
		<template v-slot:body>
			<v-row align='center' justify='center' class='no-gutters py-2'>
				<v-col cols='11' class=''>
					<v-row align='center' justify='space-around' class='no-gutters' >
						<v-col
							v-for='(item,index) in data'
							:key='index'
							cols='12'
							md='auto'
							class='ma-0 pa-0 my-1'
						>
							<v-row align='center' justify='space-between' class='ma-0 pa-0'>
								<v-col cols='auto' class='ma-0 pa-0'>
									<span class='text-pi mr-2'>
										{{ item.name }} :
								
									</span>
								</v-col>
								<v-col cols='auto' class='ma-0 pa-0'>
									<span class=''>
										{{ item.data }}
									</span>
								</v-col>
							</v-row>
							<v-divider class='hidden-md-and-up' v-if='(index!== data.length -1)'/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/Card/AppCard.vue';
import type { TAdminConnectedCount } from '@/types';

const data = computed(() => {
	return [
		{
			name: 'pi',
			data: props.connectedCount.pi
		},
		{
			name: 'clients',
			data: props.connectedCount.client
		},

		{
			name: 'total',
			data: props.connectedCount.client + props.connectedCount.pi
		},
	];
});

const props = defineProps({
	connectedCount: {
		type: Object as () => TAdminConnectedCount,
		required: true
	}
});
</script>