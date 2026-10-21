// Pure display helpers, safe to import from client components (no SDK import here).

/** "Brew & Glow – Szklany czajnik" → ["Brew & Glow", "Szklany czajnik"]; names without a dash stay whole. */
export function splitProductName(name: string): [string, string | null] {
	const match = name.match(/^(.+?)\s+[–—-]\s+(.+)$/);
	return match?.[1] && match[2] ? [match[1], match[2]] : [name, null];
}

type UnitSource = {
	variants?: readonly { combinations?: readonly { variantValue: { value: string } }[] }[] | null;
	category?: { name: string } | null;
};

/** The small line under a card title: the single variant's values, an option count, or the category. */
export function unitLabel(product: UnitSource): string | null {
	const variants = product.variants ?? [];
	if (variants.length > 1) {
		return `${variants.length} options`;
	}
	const values = variants[0]?.combinations?.map((c) => c.variantValue.value) ?? [];
	if (values.length > 0) {
		return values.join(" · ");
	}
	return product.category?.name ?? null;
}
