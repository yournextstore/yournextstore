import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Pitch } from "@/components/sections/pitch";
import { ProductGrid } from "@/components/sections/product-grid";
import { Support } from "@/components/sections/support";
import { Terrain } from "@/components/sections/terrain";
import { Tiers } from "@/components/sections/tiers";
import { GRID_REFS, getFieldCatalog, pickTiers } from "@/lib/field";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads one cached catalogue call, so the whole page prerenders (no Suspense, no shift).
export default async function Home() {
	const { products } = await getFieldCatalog();
	const tierIds = new Set(pickTiers(products).map((p) => p.id));
	const rest = products.filter((p) => !tierIds.has(p.id));
	const kit = (rest.length >= 3 ? rest : products).slice(0, 6);
	return (
		<>
			<Hero />
			<Terrain />
			<Pitch />
			<Tiers />
			<ProductGrid
				gridRef={GRID_REFS[5]}
				eyebrow="THE FULL RANGE"
				title={
					<>
						Everything
						<br />
						in the kit.
					</>
				}
				description="Each item carries its spec sheet. Quick-add from the card, or open it for the full readout."
				products={kit}
			/>
			<Support />
		</>
	);
}
