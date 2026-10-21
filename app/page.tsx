import type { Metadata } from "next";
import { Ruler } from "@/components/brew/section-head";
import { Hero } from "@/components/sections/hero";
import { Method } from "@/components/sections/method";
import { Process } from "@/components/sections/process";
import { ProductGrid } from "@/components/sections/product-grid";
import { Support } from "@/components/sections/support";
import { Tiers } from "@/components/sections/tiers";
import { getCatalog, pickTiers } from "@/lib/brew";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads one cached catalogue call, so the whole page prerenders (no Suspense, no shift).
export default async function Home() {
	const { products } = await getCatalog();
	const tierIds = new Set(pickTiers(products).map((p) => p.id));
	const rest = products.filter((p) => !tierIds.has(p.id));
	// Photographed, priced pieces lead, so the grid never opens on an empty frame or a $0 entry.
	const rank = (p: (typeof products)[number]) =>
		(p.images.length > 0 ? 0 : 2) + (p.variants.some((v) => Number(v.price) > 0) ? 0 : 1);
	const counter = [...(rest.length >= 3 ? rest : products)].sort((a, b) => rank(a) - rank(b)).slice(0, 6);
	return (
		<>
			<Hero />
			<Ruler />
			<Method />
			<Ruler />
			<Process />
			<Ruler />
			<Tiers />
			<Ruler />
			<ProductGrid
				eyebrow="The full counter"
				title={
					<>
						New on <em>the counter.</em>
					</>
				}
				description="Quick-add a tool from the card, or open a machine for its full spec sheet."
				products={counter}
			/>
			<Ruler />
			<Support />
		</>
	);
}
