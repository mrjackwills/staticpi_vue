import type { TSettingSection } from '@/types'

export function isSettingQuery (arg: string): arg is TSettingSection {
	const queries = ['2fa', 'changepassword', 'userlevel', 'changefullname']
	return queries.includes(arg)
}
