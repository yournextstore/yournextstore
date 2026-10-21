// Pure display helpers: no SDK imports, so client components can use them too.

type RichNode = { type?: string; text?: string; content?: RichNode[] };

/** Flattens a TipTap document (or plain string) into one line of text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value.trim();
	if (!value || typeof value !== "object") return "";
	const walk = (node: RichNode): string =>
		node.text ?? (node.content ?? []).map(walk).join(node.type === "doc" ? " " : "");
	return walk(value as RichNode)
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Picks `count` items, preferring ones whose first photo hasn't been shown yet, so a catalogue
 * that reuses one picture across products doesn't fill a row of four with the same shot.
 */
export function pickVisuallyDistinct<T extends { images?: string[] | null }>(items: T[], count: number): T[] {
	const seen = new Set<string>();
	const distinct = items.filter((item) => {
		const key = item.images?.[0] ?? "";
		if (!key || seen.has(key)) return false;
		seen.add(key);
		return true;
	});
	const rest = items.filter((item) => !distinct.includes(item));
	return [...distinct, ...rest].slice(0, count);
}

/** Products with a photograph (their own or a variant's) first, in their original order. */
export function picturedFirst<T extends { images?: readonly string[] | null; variants?: unknown }>(
	items: readonly T[],
): T[] {
	const pictured = (item: T) =>
		(item.images?.length ?? 0) > 0 ||
		(Array.isArray(item.variants) &&
			item.variants.some(
				(variant: unknown) =>
					typeof variant === "object" &&
					variant !== null &&
					"images" in variant &&
					Array.isArray(variant.images) &&
					variant.images.length > 0,
			));
	return [...items.filter(pictured), ...items.filter((item) => !pictured(item))];
}
