<template>
	<v-snackbar
		v-model='visible'
		:class='[margin, {"mr-2":isDesktop}]'
		:location='snack_location'
		:multi-line='isDesktop'
		:timeout='timeoutValue'
		:top='position.y === "top"'
		class='ma-0 pa-0'
		content-class='tooltip_bottom'
	>
		<v-row
			align='center'
			class='no-gutters ma-0 pa-0'
			justify='center'
			style='height:100%'
		>
			<v-col cols='12' class='ma-0 pa-0  px-2 unselectable'>
				<v-row justify='center' align='center' class='no-gutters px-1'>
					<v-col cols='auto' class='pa-0 mr-2' v-if='loading'>
						<v-progress-circular
							indeterminate
							:size='18'
							:width='3'
							color='primary'
						/>
					</v-col>
					<v-col v-if='icon && isDesktop && !loading' cols='auto' class='pa-0 ma-0'>
						<v-icon :color='color' class='mr-2' :icon='icon' />
					</v-col>
					<v-col cols='auto' class='pa-0'>
						<div class='text-center text-white'> {{ message }}</div>
					</v-col>
					<v-col v-if='closable && isDesktop' cols='auto' class='pa-0 ma-0' >
						<v-icon @click='visible = false' size='small' color='white' class='ml-2' :icon='mdiClose' />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-snackbar>
</template>

<script setup lang='ts'>
import { mdiClose } from '@mdi/js';
import { useDisplay } from 'vuetify';
import type { VDialog } from 'vuetify/components';

const { mdAndUp, smAndDown } = useDisplay();

const [ snackbarStore, userStore ] = [ snackbarModule(), userModule() ];
onBeforeUnmount(() => {
	clearInterval(localInterval.value);
	clearInterval(reloadTimeout.value);
});
const authenticated = computed(()=> userStore.authenticated);
const closable = computed(() => snackbarStore.closable);
const color = computed(() => snackbarStore.color);
const icon = computed(() => snackbarStore.icon);
const isDesktop = computed(() => mdAndUp.value);
const loading = computed(() => snackbarStore.loading);

// Not sure if this is correct, but satisfies the type checker
const snack_location = computed((): VDialog['$props']['location']=> {
	if (mdAndUp.value) {
		return `${snackbarStore.position.x} ${snackbarStore.position.y}`;
	}
	else {
		return `bottom center`;
	}
});
const margin = computed(() => smAndDown.value || !authenticated.value ? '' : navDrawerModule().mini ? 'mini_margin' : 'margin');
const message = computed({
	get (): string {
		return snackbarStore.message;
	},
	set (s: string): void {
		snackbarStore.set_message(s);
	}
});
const position = computed(() => snackbarStore.position);
const timeoutValue = computed(() => snackbarStore.timeout);

const visible = computed({
	get (): boolean {
		return snackbarStore.visible;
	},
	set (b: boolean): void {
		snackbarStore.set_visible(b);
	}
});

const localInterval = ref(0);
const reloadTimeout = ref(0);

</script>

<style>
.v-snack__content{
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.margin{
	margin-left: 90px!important
}
.mini_margin{
	margin-left:28px!important
}

.tooltip_bottom{
	bottom: 10px!important
}
</style>