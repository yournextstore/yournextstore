import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Banner, FeatureGrid, RailSection } from "@/components/sections/frntr";
import { EDITORIAL, getCatalog, getCategories, getCollections, picturedFirst } from "@/lib/catalog";
import { sentence } from "@/lib/display";
import { displayPrice } from "@/lib/pricing";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

const lowest = (product: Awaited<ReturnType<typeof getCatalog>>[number]) =>
	product.variants.reduce(
		(min, variant) => {
			const price = BigInt(displayPrice(variant, "exclusive"));
			return min === null || price < min ? price : min;
		},
		null as bigint | null,
	) ?? 0n;

// Fully cached: the home page has no request-time reads, so it prerenders whole (CLS 0).
export default async function Home() {
	"use cache";
	cacheLife("minutes");

	const [allProducts, categories, collections] = await Promise.all([
		getCatalog(),
		getCategories(),
		getCollections(),
	]);
	// Pictured products lead every row; a zero-priced set would print "$0.00" on its tile.
	const catalog = picturedFirst(
		allProducts.filter((product) => product.variants.some((variant) => Number(variant.price) > 0)),
	);

	const lead = collections[0];
	const feature = collections[1] ?? lead;

	const featureProducts = [
		...(feature?.productIds ?? [])
			.map((id) => catalog.find((product) => product.id === id))
			.filter((product) => product !== undefined),
		...catalog,
	]
		.filter((product, index, list) => list.findIndex((p) => p.id === product.id) === index)
		.slice(0, 5);

	const roomRails = categories
		.map((category) => ({
			category,
			products: catalog.filter((product) => product.category?.slug === category.slug),
		}))
		.filter(({ products }) => products.length >= 3)
		.slice(0, 2);

	const statement = catalog
		.slice()
		.sort((a, b) => (lowest(b) > lowest(a) ? 1 : lowest(b) < lowest(a) ? -1 : 0))
		.slice(0, 9);

	return (
		<div className="pb-8">
			<div className="frame pt-6 lg:pt-10">
				<Banner
					as="h1"
					priority
					image={EDITORIAL.hero}
					title={lead ? `${lead.name}, picked for every day` : "Make every day feel like you"}
					text={
						lead?.description || "Everyday pieces picked to be used and loved. Add some colour to your life."
					}
					href={lead ? `/collection/${lead.slug}` : "/products"}
					cta={lead ? `See all ${lead.name.toLowerCase()}` : "Shop all"}
				/>
			</div>

			<RailSection
				title="New in"
				text="The newest pieces in the shop. Take a look around and stay a while."
				products={catalog.slice(0, 12)}
			/>

			{feature && (
				<FeatureGrid
					title={`Today's ${feature.name.toLowerCase()}`}
					text={
						feature.description
							? `${sentence(feature.description)} The pieces everyone is reaching for this week.`
							: "The pieces everyone is reaching for this week."
					}
					story={{
						image: EDITORIAL.story,
						title: `Explore ${feature.name}`,
						href: `/collection/${feature.slug}`,
					}}
					products={featureProducts}
				/>
			)}

			{roomRails.map(({ category, products }) => (
				<RailSection
					key={category.id}
					title={`This year's ${category.name.toLowerCase()}`}
					text={
						category.description
							? sentence(category.description)
							: `Everything in ${category.name.toLowerCase()}, in one place.`
					}
					products={products}
				/>
			))}

			<RailSection
				title="Our statement pieces"
				text="Our standout pieces: the ones the rest of the shop is built around."
				products={statement}
			/>
		</div>
	);
}
