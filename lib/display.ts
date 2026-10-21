/** Pure display helpers (no SDK import), safe for client components. */

/** Prefer items whose first image has not been used yet: demo catalogues reuse one photo across products. */
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

/** Flattens a TipTap JSON document (or plain string) into text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const node = value as { text?: unknown; content?: unknown };
	const own = typeof node.text === "string" ? node.text : "";
	const children = Array.isArray(node.content) ? node.content.map(richTextToPlain).join(" ") : "";
	return `${own}${children}`.replace(/\s+/g, " ").trim();
}

export function pluralize(count: number, one: string, many = `${one}s`) {
	return `${count} ${count === 1 ? one : many}`;
}

/** The original's page frame: 1440px wide, 16px gutters on phones, 40px from 600px up. */
export const PAGE = "mx-auto w-full max-w-[90rem] px-4 mobile:px-10";
