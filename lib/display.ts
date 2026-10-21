// Pure display helpers: no SDK import, so client components can use them too.

type TiptapNode = { text?: string; content?: TiptapNode[] };

/** Flattens a TipTap JSON document (or a plain string) into one line of text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value.trim();
	if (!value || typeof value !== "object") return "";
	const walk = (node: TiptapNode): string =>
		node.text ?? (node.content ?? []).map(walk).join(node.content?.every((c) => c.text) ? "" : " ");
	return walk(value as TiptapNode)
		.replace(/\s+/g, " ")
		.trim();
}

/** The merchant's product badge text (`badge.content`), if any. */
export function badgeText(badge: unknown): string | null {
	if (!badge || typeof badge !== "object" || !("content" in badge)) return null;
	const { content } = badge as { content: unknown };
	return typeof content === "string" && content.trim() ? content.trim() : null;
}
