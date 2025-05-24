<template>
	<AppCard
		sm='12'
		md='12'
		lg='11'
		xl='11'
		heading='rate limits'
		heading_justify='start'
		heading_class='ml-2'
		heading_size='text-h6'
		my=''
	>
		<template v-slot:body>
			<v-row align='center' justify='center' class='no-gutters py-2' :class='text_class' >
				<v-col cols='12' >
					<v-row align='center' class='font-weight-bold text-caption' justify='space-between'>
						<v-col cols='5' class=''>
							<span class=''>
								key
							</span>
						</v-col>
						<v-col cols='2' class='text-right'>
							<span class=''>
								points
							</span>
						</v-col>
						<v-col cols='2' class='text-right'>
							<span class=''>
								max
							</span>
						</v-col>
						<v-col cols='3' class='text-right'>
							<span class=''>
								ttl
							</span>
						</v-col>
					</v-row>
					<v-divider />
					<v-row align='center' justify='center' class='no-gutters ma-0 pa-0' >
						<v-col
							v-for='(item,index) in limits'
							:key='index'
							cols='12'
							class=' ma-0 pa-0 my-1'
						>
							<v-row align='center' justify='space-between' :class='item.blocked?"text-pi":""'>
								<v-col cols='5' class=''>
									<span class='small-text'>
										{{ item.key }}
									</span>
								</v-col>
								<v-col cols='2' class='text-right'>
									<span class=''>
										{{ item.points }}
									</span>
								</v-col>
								<v-col cols='2' class='text-right'>
									<span class=''>
										{{ item.max }}
									</span>
								</v-col>
								<v-col cols='3' class='text-right'>
									<span class=''>
										{{ secondsToDays(item.ttl *1000) }}
									</span>
									<span class='ml-3'>
										<v-icon @click='remove_key(item.key)' color='pi' :icon='mdiCloseCircle' size='small' />
									</span>
								</v-col>
							</v-row>
							<v-divider class='' v-if='(index!== limits.length -1)'/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import { axios_admin } from '@/services/axios';
import { mdiCloseCircle } from '@mdi/js';
import { secondsToDays } from '@/vanillaTS/convert_seconds';
import { useDisplay } from 'vuetify';
import type { TAdminLimit } from '@/types';

const { mdAndDown } = useDisplay();

const text_class = computed(() => mdAndDown.value ? 'small-text' : '');

const emit = defineEmits(['update']);

const remove_key = async (key: string): Promise<void> => {
	await axios_admin.limit_delete(key);
	emit('update');
};

defineProps<{ limits: Array<TAdminLimit> }>();
</script>
