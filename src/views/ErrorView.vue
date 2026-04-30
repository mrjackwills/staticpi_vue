<template>
	<ThePage class='justify-center' :fill-height='true'>
		<template #body>
			<v-row class='align-center ma-0 pa-0 justify-center' density='compact'>
				<v-col class='ma-0 pa-0' cols='11'>
					<v-row align-center class='justify-center'>
						<v-img
							contain
							:eager='true'
							:height='"50vh"'
							:max-width='mdAndUp ? "55vw" : "95vw"'
							src='@/assets/svg/404.svg'
						/>
					</v-row>

					<section class='cl' @click='goHome'>
						<v-row class='align-center mt-6 ma-0 pa-0 justify-center' density='compact'>
							<v-col class='pa-0 ma-0' cols='auto'>
								<span class='text-pi text-display-small'>
									static<span class='font-weight-black'>Pi</span>
								</span>
							</v-col>
						</v-row>

						<v-row class='align-center ma-0 pa-0 justify-center' density='compact'>
							<v-col class='pa-0 ma-0' cols='auto'>
								<span class='text-black text-headline-medium'>return to home page</span>
							</v-col>
						</v-row>

						<v-row class='align-center mt-2 ma-0 pa-0 justify-center'>
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
