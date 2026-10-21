/** Sentence-cases catalogue labels typed in lower case ("summer bags" → "Summer bags"). */
export function sentenceCase(text: string) {
	const trimmed = text.trim();
	return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}

/** "1 product", "12 products": the original's count badge, in English. */
export function productCount(count: number) {
	return `${count} ${count === 1 ? "product" : "products"}`;
}
