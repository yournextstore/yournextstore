/** Catalogue names arrive lower-case ("summer bags"); labels read best sentence-cased. */
export function sentenceCase(value: string) {
	const trimmed = value.trim();
	return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}
