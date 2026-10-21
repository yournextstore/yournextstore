/** Sentence-cases catalogue labels typed in lower case ("summer bags" → "Summer bags"). */
export function sentenceCase(text: string) {
	const trimmed = text.trim();
	return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}

/** First letter of the store name, for the square monogram that stands in for a logo. */
export function monogramLetter(storeName: string) {
	return (storeName.trim().match(/\p{L}|\p{N}/u)?.[0] ?? "S").toLocaleUpperCase();
}
