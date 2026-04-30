<template>
	<SettingSection :disabled>
		<template #title>
			<span>User Level</span>
		</template>

		<template #titleIcon>
			<v-icon class='mr-2' color='pi' :icon='mdiCardAccountDetails' :size='smAndDown ? "small" : "default"' />
		</template>

		<template #body>

			<v-row class='ma-0 pa-0 align-center justify-center' density='compact'>

				<v-col class='pa-0 ma-0 text-body-large' cols='12' md='6'>
					<span class='font-weight-bold' :class='text_size'>current user level: </span>
					<span class='text-primary font-weight-black' :class='text_size'> {{ userLevel }}</span>
				</v-col>

				<v-col class='ma-0 pa-0' cols='12' md='6'>
					<v-row class='align-center ma-0 pa-0 ' density='compact'>
						<v-col v-if='timestamp' class='pa-0 ma-0 text-body-large' cols='auto'>
							<span class='font-weight-bold' :class='text_size'>member since:</span>

							<span
								:class='text_size'
							>{{ new Date(timestamp).toISOString().substring(0, 10) }}</span>
						</v-col>

						<v-col v-if='birthday' class='ma-0 pa-0 ml-2' cols='auto'>
							<v-icon class='mb-1' color='primary' :icon='mdiCakeVariant' size='small' />

							<v-tooltip
								v-if='show_tooltip'
								activator='parent'
								content-class='tooltip'
								location='top center'
							>
								<span>{{ birthday_tooltip }}</span>
							</v-tooltip>

						</v-col>
					</v-row>
				</v-col>

				<v-col class='pa-0 ma-0 text-body-large' cols='12'>
					<NumberOfDevices row-cols='6' />
				</v-col>
			</v-row>
		</template>

		<template #action_button>
			<v-row class='align-center ma-0 pa-0 justify-center'>
				<v-col class='ma-0 pa-0' cols='12'>

					<ActionButton
						:block='true'
						class=''
						:disabled='true'
						:icon='mdiProgressUpload'
						small
						text='upgrade account'
						@click='upgradeAccount'
					/>

					<v-tooltip
						v-if='show_tooltip'
						v-model='show_tooltip'
						activator='parent'
						content-class='tooltip'
						location='top center'
					>
						<span>work-in-progress</span>
					</v-tooltip>

				</v-col>
			</v-row>
		</template>
	</SettingSection>
</template>

<script setup lang='ts'>
import type { TSettingSection, u } from '@/types'
import { mdiCakeVariant, mdiCardAccountDetails, mdiProgressUpload } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { zero_pad } from '@/vanillaTS/convert_seconds'

const { smAndDown } = useDisplay()
const [settingSectionStore, userStore] = [settingSectionModule(), userModule()]

onBeforeMount(() => {
	if (settingSectionStore.beforemount_open && settingSectionStore.current_section === 'userlevel') {
		settingSectionStore.set_beforemount_open(false)
		settingSectionStore.set_current_section(undefined)
	}
})

const birthday_tooltip = computed((): string => {
	if (!timestamp.value) return ''
	const number = now.getFullYear() - timestamp.value.getFullYear()
	return number === 0 ? 'joined today!' : `member for ${number} year${number > 1 ? 's' : ''}`
})
// Do not like this
const birthday = computed((): boolean => {
	if (!timestamp.value) return false
	const month_day = timestamp.value.toISOString().slice(5, 10)
	const now_day = now.getDate()
	const now_month = now.getMonth() + 1
	return `${month_day}` === `${zero_pad(now_month)}-${zero_pad(now_day)}`
})

const text_size = computed(() => smAndDown.value ? 'small-text' : '')
const timestamp = computed(() => userStore.timestamp ? new Date(userStore.timestamp.slice(0, 10)) : new Date())
const userLevel = computed(() => userStore.userLevel)
const disabled = computed(() => settingSectionStore.current_section && settingSectionStore.current_section !== 'userlevel' ? true : false)

const now = new Date()
const emitter: Ref<u<TSettingSection>> = ref(undefined)
const show_tooltip = ref(false)

function upgradeAccount (): void {
	emitter.value = emitter.value ? undefined : 'userlevel'
	settingSectionStore.set_current_section(emitter.value)
}

</script>
