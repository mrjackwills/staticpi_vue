
/**
 ** password length minimum
*/
export const minPassLength: Readonly<number> = 12;

/**
 ** Object of months, where key is JS month value
 */
export const months: Readonly<Array<string>> = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export const nonce: Readonly<string> ='f73ba6133da5dc5d985b5ab9388e2beef532f43cff754fffce7e57b2046cc22ed8542f6f29408e7c';

export const token_regex = /^[0-9]{6}$|^[a-fA-F0-9]{16}$/;