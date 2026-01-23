<template>
	<ThePage :fill-height='true' justify='center'>
		<template #body>
			<v-row align='center' class='ma-0 pa-0' justify='center' no-gutters>
				<v-col class='ma-0 pa-0' cols='11'>
					<v-row align='center' justify='center'>
						<v-img
							contain
							:eager='true'
							:height='"50vh"'
							:max-width='mdAndUp ? "55vw" : "95vw"'
							src='@/assets/svg/404.svg'
						/>
					</v-row>
					<section class='cl' @click='goHome'>
						<v-row align='center' class='mt-6 ma-0 pa-0' justify='center' no-gutters>
							<v-col class='pa-0 ma-0' cols='auto'>
								<span class='text-pi text-h3'>
									static<span class='font-weight-black'>Pi</span>
								</span>
							</v-col>
						</v-row>
						<v-row align='center' class='ma-0 pa-0' justify='center' no-gutters>
							<v-col class='pa-0 ma-0' cols='auto'>
								<span class='text-black text-h5'>return to home page</span>
							</v-col>
						</v-row>
						<v-row align='center' class='mt-2 ma-0 pa-0' justify='center'>
							<v-col class='pa-0 ma-0' cols='auto'>
								<v-btn
									class='align-self-end elevation-0 cl fab-fix'
									color='primary'
									icon
									:size='buttonSize'
								>
									<v-icon color='white' :icon='mdiHome' :size='iconSize' />
								</v-btn>
							</v-col>
						</v-row>
					</section>
				</v-col>
			</v-row>
		</template>
	</ThePage>
</template>

<script setup lang='ts'>

import { mdiHome } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { FrontEndNames, FrontEndRoutes } from '@/types/const_routes'

const { mdAndUp, smAndDown } = useDisplay()

const authenticated = computed(() => userModule().authenticated)

const iconSize = computed(() => mdAndUp.value ? 'large' : 'default')

const buttonSize = computed(() => smAndDown.value ? 'small' : 'default')

const pageTitle = 'page not found'

onMounted(() => {
	const browserStore = browserModule()
	browserStore.set_title(pageTitle)
	browserStore.set_description('staticPi error page - the content was not found')
})

const router = useRouter()
const route = useRoute()

function goHome (): void {
	if (authenticated.value && route.name !== FrontEndNames.USER_DEVICES) router.push(FrontEndRoutes.USER_DEVICES)
	if (!authenticated.value && route.name !== FrontEndNames.HOME) router.push(FrontEndRoutes.BASE)
}
</script>
