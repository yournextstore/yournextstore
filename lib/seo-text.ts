import type { JSONContent } from "commerce-kit";

const META_DESCRIPTION_MAX = 160;

/** Text on one line: line breaks a merchant typed into a summary end up inside meta tags and Markdown list items. */
export function singleLine(text: string): string {
	return text.replace(/\s+/g, " ").trim();
}

/**
 * At most `max` characters, cut at a word and ended with an ellipsis. Search engines and AI previews
 * cut a longer description mid-word on their own.
 */
export function truncateAtWord(text: string, max: number): string {
	const line = singleLine(text);
	if (line.length <= max) return line;
	const cut = line.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(" ");
	const atWord = lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut;
	return `${atWord.replace(/[\s,;:.–—-]+$/, "")}…`;
}

export function metaDescription(text: string | null | undefined): string | undefined {
	return truncateAtWord(text ?? "", META_DESCRIPTION_MAX) || undefined;
}

// Text runs inside a block join as typed (a bold syllable is its own run); blocks and line breaks part words.
const nodeText = (node: JSONContent): string => {
	if (typeof node.text === "string") return node.text;
	if (node.type === "hardBreak") return " ";
	const children: JSONContent[] = Array.isArray(node.content) ? node.content : [];
	const inline = children.some((child) => typeof child.text === "string");
	return children.map(nodeText).join(inline ? "" : " ");
};

/** The readable text of TipTap rich content, blocks separated by spaces. */
export function richTextPlain(content: JSONContent | string | null | undefined): string {
	if (!content) return "";
	return singleLine(typeof content === "string" ? content : nodeText(content));
}
