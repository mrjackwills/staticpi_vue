import type { TDialogData } from '@/types';

export const dialoger = (data: TDialogData): void => {
	const dialog_store = dialogModule();
	dialog_store.set_confirmButton(data.buttonText);
	dialog_store.set_message(data.message);
	dialog_store.set_icon(data.icon);
	dialog_store.set_passwordRequired(data.passwordrequired);
	dialog_store.set_confirmMethod(data.confirmMethod);
	dialog_store.set_title(data.title);
	dialog_store.set_twoFABackup(data.twoFABackup);
	dialog_store.set_twoFARequired(data.twoFARequired);
	if (data.timeout) dialog_store.set_timeout(data.timeout);
	dialog_store.set_visible(data.visible ?? true);
};
