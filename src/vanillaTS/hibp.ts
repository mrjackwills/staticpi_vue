import { pwnedPassword } from 'hibp';

/**
 ** Check given password in hibp db
 * @param {String} password
 * @return {Promise <Boolean>} If seen true, else false
 */
export const passwordCheck = async (password: string): Promise<boolean> => {
	//Maybe throw here
	if (!password) return false;
	const numberSeen = await pwnedPassword(password);
	return numberSeen > 0 ? true : false;
};