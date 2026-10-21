type RichNode = { text?: unknown; content?: unknown };

/** Flattens TipTap JSON (collection/category descriptions) to plain text; strings pass through. */
export function richToText(value: unknown): string {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const node = value as RichNode;
	const own = typeof node.text === "string" ? node.text : "";
	const children = Array.isArray(node.content) ? node.content.map(richToText) : [];
	return [own, ...children]
		.filter(Boolean)
		.join(own ? "" : " ")
		.replace(/\s+/g, " ")
		.trim();
}
