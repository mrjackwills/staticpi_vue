export const UserLevel =  {
	FREE: 'free' as const,
	PRO: 'pro' as const,
	ADMIN: 'admin' as const
};
export type UserLevel = (typeof UserLevel)[keyof typeof UserLevel]; 