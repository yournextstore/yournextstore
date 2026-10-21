/** Plain text of a TipTap document (collection/category descriptions), or the string itself. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value.trim();
	if (!value || typeof value !== "object") return "";
	const node = value as { text?: unknown; content?: unknown };
	const own = typeof node.text === "string" ? node.text : "";
	const children = Array.isArray(node.content) ? node.content.map(richTextToPlain).filter(Boolean) : [];
	return [own, ...children].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
