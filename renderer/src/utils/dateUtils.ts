/**
 * Formats an ISO date string to a localized string.
 * Uses the user's browser locale.
 * 
 * @param dateString - The ISO date string (e.g., "2023-10-27T10:00:00.000Z")
 * @param options - Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string, options?: Intl.DateTimeFormatOptions): string => {
	if (!dateString) return '';

	const date = new Date(dateString);

	// Default options if none provided
	const defaultOptions: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		...options
	};

	return new Intl.DateTimeFormat(undefined, defaultOptions).format(date);
};

/**
 * Formats an ISO date string to a relative time string (e.g., "5 minutes ago").
 * 
 * @param dateString - The ISO date string
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString?: string): string => {
	if (!dateString) return '';

	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

	if (diffInSeconds < 60) {
		return rtf.format(-diffInSeconds, 'second');
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return rtf.format(-diffInMinutes, 'minute');
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return rtf.format(-diffInHours, 'hour');
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return rtf.format(-diffInDays, 'day');
	}

	// For older dates, fallback to standard date format
	return formatDate(dateString, { month: 'short', day: 'numeric' });
};

/**
 * Checks if a date is from today
 */
export const isToday = (dateString?: string): boolean => {
	if (!dateString) return false;
	const date = new Date(dateString);
	const today = new Date();
	return date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear();
}
