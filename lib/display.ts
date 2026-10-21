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

/** Flat category names written as paths ("Lamps > Desk") read best as their last segment. */
export const shortName = (name: string) => name.split(">").at(-1)?.trim() || name;

export const productsLabel = (count: number) => `${count} ${count === 1 ? "product" : "products"}`;
