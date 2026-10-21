type TextNode = { text?: unknown; content?: unknown };

const isTextNode = (value: unknown): value is TextNode => typeof value === "object" && value !== null;

/** Collection descriptions arrive as a plain string or as TipTap JSON: flatten either to one line. */
export function plainText(value: unknown): string {
	if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
	if (!isTextNode(value)) return "";
	const own = typeof value.text === "string" ? value.text : "";
	const children = Array.isArray(value.content) ? value.content.map(plainText).filter(Boolean).join(" ") : "";
	return `${own} ${children}`.replace(/\s+/g, " ").trim();
}
