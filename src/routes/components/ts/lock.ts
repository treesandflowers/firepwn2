export function lock() {
	let locked = false;
	return async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
		if (locked) {
			return;
		}

		locked = true;

		try {
			return await fn();
		} finally {
			locked = false;
		}
	};
}
