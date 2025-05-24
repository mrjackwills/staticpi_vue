
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
	'December'
];

export const token_regex = /^[0-9]{6}$|^[a-fA-F0-9]{16}$/;
