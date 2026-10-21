import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Patch } from "@/components/sections/patch";
import { ProductGrid } from "@/components/sections/product-grid";
import { Specs } from "@/components/sections/specs";
import { Systems } from "@/components/sections/systems";
import { getRackCatalog } from "@/lib/rack";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

const COUNT_WORDS = [
	"Zero",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
];

// Every section reads one cached catalogue call, so the whole page prerenders (no Suspense, no shift).
export default async function Home() {
	const { products, productCount } = await getRackCatalog();
	// Photographed, priced pieces lead, so the grid never opens on an empty frame or a $0 entry.
	const rank = (p: (typeof products)[number]) =>
		(p.images.length > 0 ? 0 : 2) + (p.variants.some((v) => Number(v.price) > 0) ? 0 : 1);
	const shown = [...products].sort((a, b) => rank(a) - rank(b)).slice(0, 6);
	const count = COUNT_WORDS[productCount] ?? String(productCount);
	return (
		<>
			<Hero />
			<ProductGrid
				watermark="OUT"
				kicker="The line"
				title={`${count} ways to bend a volt.`}
				description="Every card prints its own spec line — price, options and stock — because guessing is for oscillators."
				products={shown}
			/>
			<Patch />
			<Specs />
			<Systems />
		</>
	);
}
