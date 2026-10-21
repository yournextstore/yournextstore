/** Flattens TipTap JSON (or a plain string) into text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") {
		return value;
	}
	if (!value || typeof value !== "object") {
		return "";
	}
	const node = value as { text?: unknown; content?: unknown };
	const own = typeof node.text === "string" ? node.text : "";
	const children = Array.isArray(node.content) ? node.content.map(richTextToPlain).join(" ") : "";
	return `${own}${children}`.replace(/\s+/g, " ").trim();
}

/** Sentence-case shouty catalogue words ("CHASEN WHISK 茶筅 Dark Bamboo" → "Chasen whisk 茶筅 Dark Bamboo"). */
export function displayName(name: string) {
	const words = name.split(/(\s+)/);
	const shouty = words.filter((word) => /^[\p{Lu}][\p{Lu}\d'-]+$/u.test(word));
	const hasLowercase = /\p{Ll}/u.test(name);
	if (shouty.length === 0 || (shouty.length < 2 && hasLowercase)) {
		return name;
	}
	const lowered = words
		.map((word) => (/^[\p{Lu}][\p{Lu}\d'-]+$/u.test(word) ? word.toLocaleLowerCase() : word))
		.join("");
	return lowered.charAt(0).toLocaleUpperCase() + lowered.slice(1);
}
