import { SectionHead } from "@/components/field/section-head";
import { ProductCard } from "@/components/product-card";
import { GRID_REFS, getFieldCatalog, pickTiers } from "@/lib/field";

/** Three tiers from the catalogue: the lightest entry, a mid pick (flagged) and the top of the range. */
export async function Tiers() {
	const { products } = await getFieldCatalog();
	const tiers = pickTiers(products);
	if (tiers.length === 0) return null;

	return (
		<section id="tiers" className="cut-both section-x section-y">
			<SectionHead
				gridRef={GRID_REFS[3]}
				eyebrow="THREE PRICE POINTS"
				title={
					<>
						Start small.
						<br />
						Or go all in.
					</>
				}
				lead="An easy first pick, a solid middle and the top of the range, each with the same plain spec sheet."
			/>
			<div className="frame grid max-w-[440px] grid-cols-1 gap-5 lg:max-w-[1180px] lg:grid-cols-3">
				{tiers.map((product, i) => (
					<ProductCard
						key={product.id}
						product={product}
						index={i}
						flag={i === 1 ? "Our pick" : undefined}
						sizes="(max-width: 1024px) 440px, 380px"
					/>
				))}
			</div>
		</section>
	);
}
