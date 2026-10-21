import type { Metadata } from "next";
import { CategoriesMarquee } from "@/components/sections/categories-marquee";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { OurSpecs } from "@/components/sections/our-specs";
import { ProductGrid } from "@/components/sections/product-grid";
import { getHomeProducts, getMarqueeChips, getStoreInfo } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

const showing = (shown: number, total: number) => `Showing ${Math.min(shown, total)} of ${total} products`;

export default async function Home() {
	const [home, chips, info] = await Promise.all([getHomeProducts(), getMarqueeChips(), getStoreInfo()]);
	const tile = (p: (typeof home)["tileA"]) => (p?.images[0] ? { name: p.name, image: p.images[0] } : null);

	return (
		<>
			<Hero
				startsFrom={home.startsFrom}
				tileA={tile(home.tileA)}
				tileB={tile(home.tileB)}
				freeShipping={info.freeShipping}
				marquee={<CategoriesMarquee chips={chips} />}
			/>
			{home.latest.length > 0 && (
				<ProductGrid
					title="Latest Products"
					description={showing(home.latest.length, home.count)}
					products={home.latest}
					viewAllHref="/products?sort=newest"
				/>
			)}
			{home.featured.length > 0 && (
				<ProductGrid
					title="Featured"
					description={showing(home.featured.length, home.count)}
					products={home.featured}
					viewAllHref="/products"
				/>
			)}
			<OurSpecs freeShipping={info.freeShipping} />
			<Newsletter />
		</>
	);
}
