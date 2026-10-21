import type { Metadata } from "next";
import {
	BrandRow,
	CategoryTiles,
	EventCards,
	FeatureBanner,
	Hero,
	type HeroSlide,
	PhoneShortcuts,
	ProductCarousel,
	TrustRow,
} from "@/components/home-sections";
import { getBrandMap, getCatalogProducts, getCategoryTiles, getCollectionTiles } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { bannerPhoto, heroPhoto } from "@/lib/editorial";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every read here is cached, so the whole home page is part of the prerendered shell.
export default async function Home() {
	const [products, collections, categories, brands, { storeDescription }] = await Promise.all([
		getCatalogProducts(),
		getCollectionTiles(),
		getCategoryTiles(),
		getBrandMap(),
		getStoreSeo(),
	]);
	const productsOf = (ids: string[] | undefined) => products.filter((p) => ids?.includes(p.id));
	const categoryRows = categories
		.map((category) => ({
			...category,
			items: products.filter((p) => category.href === `/category/${p.category?.slug}`),
		}))
		.sort((a, b) => b.items.length - a.items.length);
	// The original's homepage rhythm: hero, trust row, tiles, a carousel, event cards, brands,
	// a second carousel, the forest-green banner and a closing carousel. Collections fill the
	// carousels; the largest category takes the middle one so no two rows repeat each other.
	const withProducts = collections.filter((c) => c.productIds.length > 1);
	const [bannerCollection, closingCollection, openingCollection] = withProducts;
	const opening = openingCollection ?? (closingCollection ? undefined : bannerCollection);
	const topCategory = categoryRows[0];
	const slides: HeroSlide[] = [
		{
			id: "intro",
			title: "Find your next favourite",
			description: storeDescription,
			href: collections[0]?.href ?? "/products",
			cta: collections[0] ? `Explore ${collections[0].name.toLowerCase()}` : "Browse the shop",
			photo: heroPhoto,
		},
		...collections.slice(1, 4).map((c) => ({
			id: c.id,
			title: c.name,
			description: c.description,
			href: c.href,
			cta: `Shop ${c.name.toLowerCase()}`,
			photo: c.photo,
		})),
	];
	// Two editorial cards: collections first, then the fullest categories.
	const events = [...collections, ...categoryRows.filter((c) => c.items.length > 0)].slice(0, 2);

	return (
		<div className="store-width home-page">
			<Hero slides={slides} />
			<PhoneShortcuts tiles={categories} />
			<TrustRow />
			<CategoryTiles title="Shop by category" tiles={[...categories, ...collections].slice(0, 4)} />
			{opening ? (
				<ProductCarousel title={opening.name} href={opening.href} products={productsOf(opening.productIds)} />
			) : (
				<ProductCarousel title="New in" href="/products" products={products.slice(0, 8)} />
			)}
			<EventCards title="Explore" tiles={events.length === 2 ? events : []} />
			<BrandRow brands={Object.values(brands)} />
			{topCategory && topCategory.items.length > 1 && (
				<ProductCarousel title={topCategory.name} href={topCategory.href} products={topCategory.items} />
			)}
			<FeatureBanner tile={bannerCollection ?? collections[0] ?? topCategory} photo={bannerPhoto} />
			{closingCollection && closingCollection !== opening ? (
				<ProductCarousel
					title={closingCollection.name}
					href={closingCollection.href}
					products={productsOf(closingCollection.productIds)}
				/>
			) : (
				opening && <ProductCarousel title="New in" href="/products" products={products.slice(0, 8)} />
			)}
		</div>
	);
}
