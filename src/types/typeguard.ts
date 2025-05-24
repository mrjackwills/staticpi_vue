import type { TSettingSection } from '@/types';

export const isSettingQuery = (arg: string): arg is TSettingSection => {
	const queries = ['2fa', 'changepassword', 'userlevel', 'changefullname'];
	return queries.includes(arg);
};
