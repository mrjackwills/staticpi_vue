
export const zero_pad = (n: number): string => {
	return String(n).padStart(2, '0');
};

/**
  ** convert seconds to day(s), hour(s), minute(s), second(s)
  * @param {Number} ms
  * @param {boolean} short - not required, show either d/m/s or day minute second
  * @return {String} 'xd, xh, xm, xs'
  */
export const secondsToDays = (ms: number, short = true): string => {
	const s = ms / 1000;
	const second = Math.trunc(s % 60);
	const minute = Math.floor(s / 60 % 60);
	const hour = Math.floor(s / 60 / 60 % 24);
	const day = Math.floor(s / 60 / 60 / 24);
	
	return short ?
		`${day > 0 ?
			`${zero_pad(day)}d` : ``}${day > 0 ?
			', ' : ''}${hour > 0 ?
			`${zero_pad(hour)}h` : ``}${hour > 0 ?
			', ' : ''}${minute > 0 ? `${zero_pad(minute)}m` : ``}${minute > 0 ?
			', ' : ''}${zero_pad(second)}s` :
		`${day > 0 ?
			`${day} day${day > 1 ?
				's' : ''}` : ``}${day > 0 ?
			', ' : ''}${hour > 0 ?
			`${zero_pad(hour)} hour${hour > 1 ?
				's' : ''}` : ``}${hour > 0 ? ', ' : ''}${minute > 0 ?
			`${minute} minute${minute > 1 ?
				's' : ''}` : ``}${minute > 0 ?
			', ' : ''}${second > 0 ?
			`${second} second${second > 1 ?
				's' : ''}` : ``}`;

};