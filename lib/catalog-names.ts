/** Catalogue names are sometimes lower case: sentence-case them for the UI. */
export function sentenceCase(text: string) {
	const trimmed = text.trim();
	return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}
