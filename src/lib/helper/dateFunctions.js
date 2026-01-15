/**
 * Determines whether 2 date strings provided by pocketbase are the same day
 * @param { string | null | undefined } date1
 * @param { string | null | undefined } date2
 */
export function datesAreOnTheSameDay(date1, date2) {
	if (!date1 || !date2) {
		throw new Error('One of the dates is null for isSameDate');
	}
	const d1 = new Date(date1);
	const d2 = new Date(date2);

	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDay() === d2.getDay()
	);
}
