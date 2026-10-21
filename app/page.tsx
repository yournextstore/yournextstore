import type { Metadata } from "next";
import {
	CategoryBento,
	FeaturedSplit,
	Hero,
	OfferBand,
	ProductRail,
	TrustStrip,
} from "@/components/bento/home-sections";
import { getCatalogProducts, getCategoryTiles, picturedFirst } from "@/lib/aqua";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const [{ products, count }, tiles] = await Promise.all([getCatalogProducts(), getCategoryTiles()]);

	// Two picks for the split (bundles first, else the most substantial pieces), and the newest
	// of the rest for the rail.
	// Only pictured, priced products qualify, so a photo-less bundle or a $0 set never leads.
	const ready = picturedFirst(products).filter(
		(product) => (product.images?.length ?? 0) > 0 && product.variants.some((v) => Number(v.price) > 0),
	);
	const byPrice = ready.toSorted(
		(a, b) => Number(b.variants[0]?.price ?? 0) - Number(a.variants[0]?.price ?? 0),
	);
	const featured = [
		...ready.filter((product) => product.type === "bundle"),
		...byPrice.filter((product) => product.type !== "bundle"),
	].slice(0, 2);
	const featuredIds = new Set(featured.map((product) => product.id));
	const rail = picturedFirst(products.filter((product) => !featuredIds.has(product.id))).slice(0, 10);

	return (
		<div className="aq-grain">
			<Hero categories={tiles} total={count} />
			<TrustStrip />
			<CategoryBento tiles={tiles} />
			<FeaturedSplit products={featured} />
			<ProductRail products={rail} />
			<OfferBand />
		</div>
	);
}
