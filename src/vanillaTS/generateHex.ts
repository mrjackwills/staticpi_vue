export const generateRandomHex = (size = 32): string => {
	let result = '';
	const hexChars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];
	for (const _i of new Array(size)) result += hexChars[Math.floor(Math.random() * 16)];
	return result;

};