<template>
	<ThePage :fillHeight='true' justify='center'>
		<template v-slot:body>
			<v-row justify='center' align='center' class='ma-0 pa-0' no-gutters>
				<v-col cols='11' class='ma-0 pa-0'>
					<v-row align='center' justify='center'>
						<v-img :eager='true' :height='"50vh"' :max-width='mdAndUp ? "55vw" : "95vw"'
							src='@/assets/svg/404.svg' contain />
					</v-row>
					<section @click='goHome' class='cl'>
						<v-row align='center' justify='center' no-gutters class='mt-6 ma-0 pa-0'>
							<v-col cols='auto' class='pa-0 ma-0'>
								<span class='text-pi text-h3'>
									static<span class='font-weight-black'>Pi</span>
								</span>
							</v-col>
						</v-row>
						<v-row align='center' justify='center' no-gutters class='ma-0 pa-0'>
							<v-col cols='auto' class='pa-0 ma-0'>
								<span class='text-black text-h5'>return to home page</span>
							</v-col>
						</v-row>
						<v-row justify='center' align='center' class='mt-2 ma-0 pa-0'>
							<v-col cols='auto' class='pa-0 ma-0'>
								<v-btn :size='buttonSize' class='align-self-end elevation-0 cl fab-fix' color='primary'
									icon>
									<v-icon color='white' :size='iconSize' :icon='mdiHome' />
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

import { FrontEndNames, FrontEndRoutes } from '@/types/const_routes';
import { mdiHome } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndDown } = useDisplay();

const authenticated = computed(() => userModule().authenticated);

const iconSize = computed(() => mdAndUp.value ? 'large' : 'default');

const buttonSize = computed(() => smAndDown.value ? 'small' : 'default');

const pageTitle = 'page not found';

onMounted(() => {
	const browserStore = browserModule();
	browserStore.set_title(pageTitle);
	browserStore.set_description('staticPi error page - the content was not found');
});

const router = useRouter();
const route = useRoute();

const goHome = (): void => {
	if (authenticated.value && route.name !== FrontEndNames.USER_DEVICES) router.push(FrontEndRoutes.USER_DEVICES);
	if (!authenticated.value && route.name !== FrontEndNames.HOME) router.push(FrontEndRoutes.BASE);
};
</script>
