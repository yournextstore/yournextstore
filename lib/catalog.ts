type DocNode = { text?: string; content?: DocNode[] };

/** Flattens a TipTap/ProseMirror JSON description (or a plain string) to one line of text. */
export function flattenDescription(description: unknown): string {
	if (typeof description === "string") {
		return description.trim();
	}
	if (!description || typeof description !== "object") {
		return "";
	}
	const walk = (node: DocNode): string[] => [
		...(typeof node.text === "string" ? [node.text] : []),
		...(Array.isArray(node.content) ? node.content.flatMap(walk) : []),
	];
	return walk(description as DocNode)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();
}

/** The flattened description, or "" when it only repeats the name ("IVAR collection", "Children products"). */
export function meaningfulDescription(name: string, description: unknown): string {
	const text = flattenDescription(description);
	const lower = text.toLowerCase();
	const base = name.toLowerCase();
	return lower === `${base} collection` || lower === `${base} products` || lower === base ? "" : text;
}
