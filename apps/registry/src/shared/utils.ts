type ClassValue = string | undefined | null | false | Record<string, boolean>;

export function clasnames(...inputs: ClassValue[]) {
	return inputs
		.flatMap((input) => {
			if (!input) return [];
			if (typeof input === 'string') return [input];
			return Object.entries(input)
				.filter(([, value]) => value)
				.map(([key]) => key);
		})
		.join(' ');
}

export async function withMinimumDelay<T>(promise: Promise<T>, delayMs: number = 500): Promise<T> {
	const [result] = await Promise.all([promise, new Promise((resolve) => setTimeout(resolve, delayMs))]);

	return result;
}
