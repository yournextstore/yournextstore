/** Flatten a TipTap JSON (or plain string) description to text. Pure: safe in client bundles. */
export function plainText(value: unknown): string {
	if (typeof value === "string") {
		return value;
	}
	if (!value || typeof value !== "object") {
		return "";
	}
	const node = value as { text?: unknown; content?: unknown };
	const own = typeof node.text === "string" ? node.text : "";
	const children = Array.isArray(node.content) ? node.content.map(plainText).join(" ") : "";
	return `${own}${children}`.replace(/\s+/g, " ").trim();
}
