import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import {
	CenteredText,
	CollectionFeature,
	CollectionList,
	FeaturedRow,
	Hero,
	Marquee,
	MediaText,
} from "@/components/sections/home";
import {
	EDITORIAL,
	getCatalogProducts,
	getCollectionTiles,
	getHomeCollections,
	getNavCategories,
	getStoreName,
	photographedFirst,
} from "@/lib/catalog";
import { meGetCached } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [collections, tiles, categories, storeName, me, catalog] = await Promise.all([
		getHomeCollections(),
		getCollectionTiles(6),
		getNavCategories(),
		getStoreName(),
		meGetCached().catch(() => null),
		getCatalogProducts(),
	]);
	return {
		storeName,
		description: me?.store.settings?.storeDescription?.trim() || null,
		collections,
		catalog: photographedFirst(catalog),
		tiles,
		categories,
	};
}

// A set or bundle priced 0 reads as "free" in the feature's short list, so priced products lead it.
const isPriced = (product: { variants?: { price: string }[] }) =>
	product.variants?.some((variant) => Number(variant.price) > 0) ?? false;

export default async function Home() {
	const data = await getHomeData();
	const [featured, second] = data.collections;
	// The feature block shows a second collection when there is one, otherwise the whole catalog.
	const feature = second
		? {
				title: second.collection.name,
				href: `/collection/${second.collection.slug}`,
				products: second.products,
			}
		: { title: "Shop all", href: "/products", products: data.catalog.filter(isPriced) };

	return (
		<>
			<Hero
				image={EDITORIAL.hero}
				title="Cozy up with a warm cookie"
				cta={{
					href: featured ? `/collection/${featured.collection.slug}` : "/products",
					label: "Shop now",
				}}
			/>
			{featured ? (
				<FeaturedRow
					title={featured.collection.name}
					products={featured.products.slice(0, 12)}
					cta={{ href: "/products", label: "Shop all" }}
				/>
			) : (
				data.catalog.length > 0 && (
					<FeaturedRow
						title="New in"
						products={data.catalog.slice(0, 8)}
						cta={{ href: "/products", label: "Shop all" }}
					/>
				)
			)}
			<CollectionFeature
				title={feature.title}
				image={EDITORIAL.feature}
				href={feature.href}
				products={feature.products}
			/>
			{data.description && <CenteredText text={data.description} />}
			<Marquee words={[data.storeName, ...data.categories.map((category) => category.name)]} />
			<CollectionList title="Shop our collections" tiles={data.tiles} />
			<MediaText
				label={`About ${data.storeName}`}
				text="Thick cookies, fudgy brownies and chewy blondies, baked in small batches with real butter and plenty of chocolate."
				image={EDITORIAL.media}
			/>
		</>
	);
}
