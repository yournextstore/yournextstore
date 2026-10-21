import { SectionHead } from "@/components/brew/section-head";
import { ProductCard } from "@/components/product-card";
import { getCatalog, pickTiers } from "@/lib/brew";

/** The original's three priced machines: here the lightest entry, a mid pick (flagged) and the top of the range. */
export async function Tiers() {
	const { products } = await getCatalog();
	const tiers = pickTiers(products);
	if (tiers.length === 0) return null;

	return (
		<section id="picks" className="section-x section-y scroll-mt-16">
			<SectionHead
				eyebrow="Three picks"
				title={
					<>
						Pick the one <em>you&rsquo;ll come back to.</em>
					</>
				}
				lead="From a first tamper to a dual-boiler machine: three readings of the same counter, each with its own spec page."
			/>
			<div className="frame grid grid-cols-1 md:grid-cols-3">
				{tiers.map((product, i) => (
					<div
						key={product.id}
						className="border-line not-first:border-t md:not-first:border-t-0 md:not-first:border-l"
					>
						<ProductCard
							product={product}
							index={i}
							layout="tier"
							flag={i === 1 ? "House pick" : undefined}
							sizes="(max-width: 768px) 340px, 380px"
						/>
					</div>
				))}
			</div>
		</section>
	);
}
