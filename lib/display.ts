/** Catalogue names sometimes arrive lower-case; show them sentence-cased. */
export function sentenceCase(value: string) {
	const trimmed = value.trim();
	return trimmed ? trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1) : trimmed;
}
