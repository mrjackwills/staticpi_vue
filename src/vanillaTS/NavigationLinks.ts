import {
	mdiAccountCircle,
	mdiAccountCogOutline,
	mdiAccountPlus,
	mdiBookOpenPageVariant,
	mdiEmailFastOutline,
	mdiLayers,
	mdiLoginVariant,
	mdiRouterWirelessSettings,
	mdiWan,
} from '@mdi/js';
import type { TNavigationLink } from '@/types';
import { FrontEndRoutes } from '@/types/enum_routes';

export const notAuthenticatedLinks: Array<TNavigationLink> = [
	{
		icon: mdiLayers,
		message: 'plans',
		route: FrontEndRoutes.PLANS
	},
	{
		icon: mdiBookOpenPageVariant,
		message: 'documentation',
		route: FrontEndRoutes.DOCUMENTATION
	},

	{	icon: mdiWan,
		message: 'status',
		route: FrontEndRoutes.STATUS
	},
	{
		icon: mdiEmailFastOutline,
		message: 'contact',
		route: FrontEndRoutes.CONTACT
	},
	{
		icon: mdiAccountPlus,
		message: 'register',
		route: FrontEndRoutes.REGISTER
	},
	{
		icon: mdiLoginVariant,
		message: 'login',
		route: FrontEndRoutes.LOGIN
	},
];

export const authenticatedLinks: Array<TNavigationLink> = [
	{
		icon: mdiRouterWirelessSettings,
		message: 'devices',
		route: FrontEndRoutes.USER_DEVICES
	},
	{	icon: mdiBookOpenPageVariant,
		message: 'documentation',
		route: FrontEndRoutes.DOCUMENTATION
	},
	{
		icon: mdiAccountCircle,
		message: 'settings',
		route: FrontEndRoutes.USER_SETTINGS
	},
	{
		icon: mdiEmailFastOutline,
		message: 'contact',
		route: FrontEndRoutes.CONTACT
	},
	{	icon: mdiWan,
		message: 'status',
		route: FrontEndRoutes.STATUS
	},
];

export const adminLinks: Array<TNavigationLink> = [
	{
		icon: mdiAccountCogOutline,
		message: 'admin',
		route: FrontEndRoutes.ADMIN
	},
];