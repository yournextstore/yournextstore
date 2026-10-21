import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { getShelfProducts, photographedFirst } from "@/lib/catalog";
import { displayPrice } from "@/lib/pricing";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

const minPrice = (product: Awaited<ReturnType<typeof getShelfProducts>>[number]) =>
	product.variants.reduce(
		(min, variant) => {
			const price = BigInt(displayPrice(variant, "exclusive"));
			return min === null || price < min ? price : min;
		},
		null as bigint | null,
	) ?? 0n;

async function Shelves() {
	const products = await getShelfProducts();
	const newest = photographedFirst(
		[...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
	).slice(0, 4);
	const shown = new Set(newest.map((product) => product.id));
	const littleFinds = products
		.filter((product) => !shown.has(product.id) && product.images.length > 0 && minPrice(product) > 0n)
		.sort((a, b) => (minPrice(a) < minPrice(b) ? -1 : minPrice(a) > minPrice(b) ? 1 : 0))
		.slice(0, 4);

	return (
		<>
			<ProductGrid title="New arrivals" products={newest} viewAllHref="/products" />
			<ProductGrid title="Little finds" products={littleFinds} viewAllHref="/products?sort=price-asc" />
		</>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<div className="mx-3 md:mx-10">
				<section className="pt-10 text-center text-ink-soft lg:px-32 lg:pt-16 lg:pb-5 lg:text-left">
					<div className="grid justify-center gap-6 lg:grid-cols-2 xl:gap-12">
						<div className="lg:text-right">
							<h1 className="font-bold text-5xl tracking-tight md:text-6xl xl:text-7xl">
								Good Design &amp; Quality
							</h1>
						</div>
						<div className="flex flex-col justify-center">
							<p className="text-[#4b5563] text-lg">
								Cases, chargers and cables picked for how they look, how they work and how long they last: the
								things you carry every day, made to be the ones you keep.
							</p>
						</div>
					</div>
				</section>
			</div>
			<Shelves />
			<div className="h-16" />
		</>
	);
}
