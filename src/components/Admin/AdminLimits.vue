<template>
	<AppCard
		heading='rate limits'
		heading-class='ml-2'
		heading-justify='start'
		heading-size='text-h6'
		lg='11'
		md='12'
		my=''
		sm='12'
		xl='11'
	>
		<template #body>
			<v-row align='center' class='no-gutters py-2' :class='text_class' justify='center'>
				<v-col cols='12'>
					<v-row align='center' class='font-weight-bold text-caption' justify='space-between'>
						<v-col class='' cols='5'>
							<span class=''>
								key
							</span>
						</v-col>
						<v-col class='text-right' cols='2'>
							<span class=''>
								points
							</span>
						</v-col>
						<v-col class='text-right' cols='2'>
							<span class=''>
								max
							</span>
						</v-col>
						<v-col class='text-right' cols='3'>
							<span class=''>
								ttl
							</span>
						</v-col>
					</v-row>
					<v-divider />
					<v-row align='center' class='no-gutters ma-0 pa-0' justify='center'>
						<v-col
							v-for='(item,index) in limits'
							:key='index'
							class=' ma-0 pa-0 my-1'
							cols='12'
						>
							<v-row align='center' :class='item.blocked?"text-pi":""' justify='space-between'>
								<v-col class='' cols='5'>
									<span class='small-text'>
										{{ item.key }}
									</span>
								</v-col>
								<v-col class='text-right' cols='2'>
									<span class=''>
										{{ item.points }}
									</span>
								</v-col>
								<v-col class='text-right' cols='2'>
									<span class=''>
										{{ item.max }}
									</span>
								</v-col>
								<v-col class='text-right' cols='3'>
									<span class=''>
										{{ secondsToDays(item.ttl *1000) }}
									</span>
									<span class='ml-3'>
										<v-icon color='pi' :icon='mdiCloseCircle' size='small' @click='remove_key(item.key)' />
									</span>
								</v-col>
							</v-row>
							<v-divider v-if='(index!== limits.length -1)' class='' />
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</AppCard>
</template>

<script setup lang="ts">
import type { TAdminLimit } from '@/types'
import { mdiCloseCircle } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { axios_admin } from '@/services/axios'
import { secondsToDays } from '@/vanillaTS/convert_seconds'

const { mdAndDown } = useDisplay()

const text_class = computed(() => mdAndDown.value ? 'small-text' : '')

const emit = defineEmits(['update'])

async function remove_key (key: string): Promise<void> {
	await axios_admin.limit_delete(key)
	emit('update')
}

defineProps<{ limits: Array<TAdminLimit> }>()
</script>
