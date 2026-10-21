// Pure display helpers: no SDK import, so client components can use them too.

type RichNode = { text?: string; content?: RichNode[] };

/** Flattens a TipTap/ProseMirror description (or a plain string) to one line of text. */
export function richToText(value: unknown): string {
	if (typeof value === "string") {
		return value.trim();
	}
	if (!value || typeof value !== "object") {
		return "";
	}
	const node = value as RichNode;
	const own = node.text ?? "";
	const children = (node.content ?? []).map(richToText).filter(Boolean).join(" ");
	return [own, children].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export type ChipTone = "plain" | "lavender" | "peach" | "mint" | "pink";

export type Chip = { label: string; tone: ChipTone };

type ChipProduct = {
	category?: { name: string } | null;
	variants?: {
		combinations?: { variantValue: { value: string } }[];
	}[];
};

/**
 * The attribute chips FRNTR prints over every product photo: variant values on white,
 * the room (category) on lavender, like "Livingroom" and "Bathroom" in the original.
 */
export function productChips(product: ChipProduct, max = 4): Chip[] {
	const values = (product.variants ?? []).flatMap((variant) =>
		(variant.combinations ?? []).map((combination) => combination.variantValue.value),
	);
	const unique = [...new Set(values)];
	const room = product.category?.name;
	return [
		...unique.map((label) => ({ label, tone: "plain" as const })),
		...(room ? [{ label: room, tone: "lavender" as const }] : []),
	].slice(0, max);
}

export const chipToneClass: Record<ChipTone, string> = {
	plain: "bg-white text-foreground",
	lavender: "bg-lavender text-lavender-ink",
	peach: "bg-peach text-foreground",
	mint: "bg-mint text-mint-ink",
	pink: "bg-pink text-foreground",
};

/** Ends a merchant-written phrase with exactly one full stop, so copy can be appended after it. */
export const sentence = (text: string) => `${text.trim().replace(/[.!?…]+$/, "")}.`;
