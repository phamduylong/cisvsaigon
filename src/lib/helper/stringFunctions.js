/**
 * Get initials for avatar fallback
 * @param {string | undefined | null} name
 */
export function getInitials(name) {
	if (!name) return '';
	let initials = '';
	const names = name.split(' ');
	for (let i = 0; i < names.length; i++) {
		if (names[i] && names[i].length) {
			// if this part of the name is not empty, let's get the first initial character
			initials += names[i][0];
		}
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
 * @param locale {string}
 */
export function processDateString(date, locale) {
	return date.toLocaleDateString(locale ?? 'default', {
		// you can use undefined as first argument
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}

/**
 * Calculate the average reading time for the blog post.
 * @param {string | undefined | null} postContent
 * @param {string} locale
 */
export function calculateAverageReadingTime(postContent, locale) {
	if (!postContent) {
		if (locale === 'vi') return 'Bài viết không có nội dung';
		else return 'Nothing to read';
	}
	let nrOfWords = postContent.split(' ').length;
	const readingTimeInMinutes = nrOfWords / 250;
	if (readingTimeInMinutes < 0.5) {
		if (locale === 'vi') return 'Thời gian đọc: ít hơn 1 phút';
		return 'Less than a minute read';
	} else {
		const roundedTime = Math.round(readingTimeInMinutes);
		if (roundedTime === 1) {
			if (locale === 'vi') return 'Thời gian đọc: 1 phút';
			return '1 minute read';
		} else {
			if (locale === 'vi') return `Thời gian đọc: ${roundedTime} phút`;
			return `${roundedTime} minutes read`;
		}
	}
}

/**
 * Check if the string is a valid HTTP/HTTPS URL
 * @param {string} str
 * @returns
 */
export function isValidHttpUrl(str) {
	let url;

	try {
		url = new URL(str);
	} catch (err) {
		console.error(err);
		return false;
	}

	return url.protocol === 'http:' || url.protocol === 'https:';
}
