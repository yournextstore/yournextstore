import { expect, test } from "bun:test";
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";

const variant = (sku: string, ...positions: (number | null)[]) => ({
	sku,
	combinations: positions.map((position) => ({ variantValue: { position } })),
});

test("sortVariantsByOptions orders by the first option, then the next", () => {
	const variants = [
		variant("CHA-10", 3, 1),
		variant("BON-20", 1, 3),
		variant("SND-10", 2, 1),
		variant("BON-10", 1, 1),
	];
	expect(sortVariantsByOptions(variants).map(({ sku }) => sku)).toEqual([
		"BON-10",
		"BON-20",
		"SND-10",
		"CHA-10",
	]);
});

test("sortVariantsByOptions puts values without a position last and keeps option-less variants", () => {
	expect(sortVariantsByOptions([variant("B", null), variant("A", 2)]).map(({ sku }) => sku)).toEqual([
		"A",
		"B",
	]);
	expect(sortVariantsByOptions([variant("ONLY")]).map(({ sku }) => sku)).toEqual(["ONLY"]);
});
