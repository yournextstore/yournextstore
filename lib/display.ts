/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value.trim();
	if (!value || typeof value !== "object") return "";
	const text = "text" in value && typeof value.text === "string" ? value.text : null;
	if (text !== null) return text;
	const content = "content" in value && Array.isArray(value.content) ? value.content : [];
	const type = "type" in value ? value.type : null;
	const inline = type === "paragraph" || type === "heading";
	return content
		.map(richTextToPlain)
		.filter(Boolean)
		.join(inline ? "" : " ")
		.trim();
}
