import type { TSnack } from '@/types'
import { mdiAlertCircle, mdiCheckCircleOutline } from '@mdi/js'

function snacker (data: TSnack): void {
	const snackbar_store = snackbarModule()
	snackbar_store.$reset()
	snackbar_store.set_closable(!!data.closable)
	snackbar_store.set_color(data.type ?? '')
	snackbar_store.set_icon(data.icon ?? '')
	snackbar_store.set_message(data.message ?? '')
	snackbar_store.set_loading(!!data.loading)
	snackbar_store.set_position({
		x: data.x || 'right',
		y: data.y || 'bottom',
	})

	snackbar_store.set_timeout(data.timeout ?? 0)
	snackbar_store.set_visible(true)
}

export function snackSuccess ({ message = 'Success', icon = mdiCheckCircleOutline, timeout = 7500, x = 'right', y = undefined, type = 'success', closable = true, loading = false }: TSnack): void {
	snacker({
		message,
		icon,
		timeout,
		x,
		type,
		closable,
		loading,
		...y ? { y } : {},
	})
}

export function snackError ({ message = 'error', icon = mdiAlertCircle, timeout = 12_500, x = 'right', y = undefined, type = 'error', closable = true }: TSnack): void {
	snacker({
		message,
		icon,
		timeout,
		x,
		type,
		closable,
		...y ? { y } : {},
	})
}
