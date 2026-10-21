/** Catalogue names may arrive lower-case; show them sentence-cased. */
export function sentenceCase(name: string) {
	const trimmed = name.trim();
	return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}

/** Store names read as the original's wordmark: one uppercase line. */
export function wordmark(name: string) {
	return name.trim().toLocaleUpperCase();
}
