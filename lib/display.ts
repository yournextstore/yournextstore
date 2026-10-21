/** Catalogue names may arrive lower-case; labels read best sentence-cased. */
export function sentenceCase(name: string) {
	const trimmed = name.trim();
	return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}

/** Splits a plain-text summary into paragraphs, dropping a first line that only repeats the name. */
export function summaryParagraphs(summary: string | null | undefined, productName: string) {
	const name = productName.replace(/\s+/g, " ").trim().toLowerCase();
	return (summary ?? "")
		.split(/\n\s*\n|\r\n\s*\r\n|\n/)
		.map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
		.filter((paragraph) => paragraph && paragraph.toLowerCase() !== name);
}
