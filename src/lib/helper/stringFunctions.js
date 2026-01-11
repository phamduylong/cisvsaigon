/**
 * Get initials for avatar fallback
 * @param {string} name
 */
export function getInitials(name) {
	let initials = '';
	const names = name.split(' ');
	for (let part in names) {
		if (part && part.length) initials += part[0];
	}

	return initials;
}

/**
 * Convert a number to day of week
 * @param {number} day
 * @param {boolean} short
 * @returns {string | undefined}
 */
export function toDayOfWeek(day, short) {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	if (short) {
		return days[day].substring(0, 3);
	}
	return days[day];
}

/**
 * Process date string to human readable format
 * Shows day, month and year if the year is not the current year
 * @param date {Date}
 */
export function processDateString(date) {
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	let displayYear = false;
	const newDate = new Date();

	if (
		newDate.getFullYear() - year > 1 ||
		(newDate.getFullYear() - year <= 1 &&
			(newDate.getMonth() > month || (newDate.getMonth() === month && newDate.getDate() < day)))
	) {
		displayYear = true;
	}
	return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()} ${displayYear ? date.getFullYear() : ''}`;
}

/**
 * Calculate the average reading time for the blog post.
 * @param {string | undefined | null} postContent
 */
export function calculateAverageReadingTime(postContent) {
	if (!postContent) return 'Nothing to read';
	let nrOfWords = postContent.split(' ').length;
	const readingTimeInMinutes = nrOfWords / 250;
	if (readingTimeInMinutes < 0.5) {
		return 'Less than a minute read';
	} else {
		const roundedTime = Math.round(readingTimeInMinutes);
		if (roundedTime === 1) {
			return '1 minute read';
		} else {
			return `${roundedTime} minutes read`;
		}
	}
}