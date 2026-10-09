type OrderedVariant = {
	combinations: { variantValue: { position: number | null } }[];
};

const UNPOSITIONED = Number.MAX_SAFE_INTEGER;

/**
 * Variants in the merchant's option order: Bone before Sand, then 10 cm before 15 cm. The API
 * returns variants in no set order, and the default variant, the swatch order and the gallery
 * all follow the order of this list. Each variant lists its options in the same order, so the
 * positions compare option by option.
 */
export function sortVariantsByOptions<V extends OrderedVariant>(variants: readonly V[]): V[] {
	const positions = (variant: V) =>
		variant.combinations.map(({ variantValue }) => variantValue.position ?? UNPOSITIONED);
	return variants.toSorted((a, b) => {
		const pa = positions(a);
		const pb = positions(b);
		const index = pa.findIndex((position, i) => position !== pb[i]);
		return index === -1 ? 0 : (pa[index] ?? UNPOSITIONED) - (pb[index] ?? UNPOSITIONED);
	});
}
