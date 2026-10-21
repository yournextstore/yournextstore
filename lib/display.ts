/** Pure display helpers (no SDK import, so client components can use them). */

const squash = (text: string) => text.replace(/\s+/g, " ").trim().toLowerCase();

/** A paragraph that only restates the product name (in full or shortened) is a title line. */
const isTitleLine = (paragraph: string, name: string) => {
	const p = squash(paragraph);
	const n = squash(name);
	return p === n || n.startsWith(p) || (p.length < 60 && p.startsWith(n));
};

/**
 * The first real paragraph of a product summary. Imported catalogues often open the summary
 * with the product name again, so a leading paragraph that repeats the name is skipped.
 */
export function blurb(summary: string | null | undefined, name: string): string | null {
	if (!summary) return null;
	const paragraphs = summary
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
		.filter(Boolean);
	const first = paragraphs.find((paragraph) => !isTitleLine(paragraph, name));
	return first ?? null;
}

/** Sentence-case a lower-case catalogue label ("summer bags" → "Summer bags"). */
export function sentenceCase(label: string): string {
	return label.charAt(0).toLocaleUpperCase() + label.slice(1);
}

/** "1 product" / "12 products". */
export function pieces(count: number): string {
	return `${count} ${count === 1 ? "product" : "products"}`;
}

/** Every paragraph of a product summary except a leading one that only repeats the name. */
export function descriptionParagraphs(summary: string | null | undefined, name: string): string[] {
	if (!summary) return [];
	const paragraphs = summary
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.replace(/[ \t]+/g, " ").trim())
		.filter(Boolean);
	return paragraphs.filter((paragraph, index) => index > 0 || !isTitleLine(paragraph, name));
}
