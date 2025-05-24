import type { ConstT } from '@/types';

export const UserLevel = {
	FREE: 'free',
	PRO: 'pro',
	ADMIN: 'admin'
} as const;

export type UserLevel = ConstT<typeof UserLevel>;
