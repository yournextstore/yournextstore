export function invariant(
	condition: unknown,
	message: string,
	ErrorClass?: {
		new (message: string): unknown;
	},
): asserts condition {
	if (!condition) {
		if (ErrorClass) {
			throw new ErrorClass(message);
		}
		throw new Error(message);
	}
}
