/** Collection descriptions are plain text or TipTap JSON; flatten either to one line of copy. */
export function plainText(value: unknown): string {
	if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
	if (value && typeof value === "object") {
		const node = value as { text?: unknown; content?: unknown };
		const own = typeof node.text === "string" ? node.text : "";
		const children = Array.isArray(node.content) ? node.content.map(plainText).join(" ") : "";
		return `${own} ${children}`.replace(/\s+/g, " ").trim();
	}
	return "";
}

/** "CoreX": the original's wordmark ends on a red letter. Split any store name the same way. */
export function splitWordmark(name: string) {
	const trimmed = name.trim();
	return { head: trimmed.slice(0, -1), tail: trimmed.slice(-1) };
}

export const optionsLabel = (count: number) =>
	count > 1 ? `Available in ${count} options` : "One option available";
