export const formatDate = (date: string | Date | null | undefined, locale = 'en-US'): string => {
	if (!date) return 'Never';
	const d = typeof date === 'string' ? new Date(date) : date;
	if (isNaN(d.getTime())) return 'Invalid date';

	return d.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

export const formatDateTime = (date: string | Date | null | undefined, locale = 'en-US'): string => {
	if (!date) return 'Never';
	const d = typeof date === 'string' ? new Date(date) : date;
	if (isNaN(d.getTime())) return 'Invalid date';

	return d.toLocaleString(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const formatNumber = (num: number | null | undefined, locale = 'en-US'): string => {
	if (num === null || num === undefined) return '0';
	return num.toLocaleString(locale);
};
