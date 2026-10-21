import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { CalloutModule } from "@/components/modules/callout";
import { ProductHero } from "@/components/modules/product-hero";
import { ProductListing } from "@/components/product-listing";
import { richTextToPlain } from "@/lib/catalog";
import { colorThemeFor } from "@/lib/color-theme";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { encodeVts } from "@/lib/vts";

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		return { title: "Collection Not Found", robots: { index: false, follow: true } };
	}

	const { storeName } = await getStoreSeo();
	const description =
		richTextToPlain(collection.description) || `Shop the ${collection.name} collection at ${storeName}.`;
	const canonical = `/collection/${collection.slug}`;

	return {
		title: collection.name,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: collection.name,
			description,
			url: canonical,
			images: collection.image ? [{ url: collection.image, alt: collection.name }] : undefined,
		},
		twitter: {
			card: collection.image ? "summary_large_image" : "summary",
			title: collection.name,
			description,
			images: collection.image ? [collection.image] : undefined,
		},
	};
}

// Only a `manual` collection keeps its members in the join table that `collectionGet` returns —
// the smart filters are evaluated against the whole catalog when the storefront asks for them.
// Re-expressing each one as the equivalent product browse is what keeps those collections from
// rendering as an empty grid. Cached like the collection itself, which also pins the
// `Date.now()` below to the cache entry.
async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { filter } = collection;

	if (filter.type === "manual") {
		const ids = collection.productCollections.map((pc) => pc.product.id);
		// The SDK throws on a 404: one product deleted since it joined must not fail the page.
		return (
			await Promise.all(ids.map((id) => commerce.productGet({ idOrSlug: id }).catch(() => null)))
		).filter((product) => product !== null);
	}

	if (filter.type === "variantValues") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			vts: encodeVts(filter.values),
		});
		return data;
	}

	if (filter.type === "dynamicPrice") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			priceMin: filter.min ?? undefined,
			priceMax: filter.max ?? undefined,
		});
		return data;
	}

	const { data } = await commerce.productBrowse({
		active: true,
		limit: SMART_COLLECTION_LIMIT,
		orderBy: "createdAt",
		orderDirection: "desc",
	});

	// A rolling "new arrivals" window has no browse equivalent, so the age bound is applied here.
	if (typeof filter.days !== "number") {
		return data;
	}
	const cutoff = Date.now() - filter.days * MS_PER_DAY;
	return data.filter((product) => new Date(product.createdAt).getTime() >= cutoff);
}

function CollectionPageSkeleton() {
	return (
		<div data-flush className="rounded-b-xl bg-lightgray px-4 pt-24 pb-4 md:px-8 md:pt-34 md:pb-8">
			<div className="mx-auto mb-7 h-[3.375rem] w-72 rounded-md bg-gray md:h-[6.875rem]" />
			<div className="mt-6 aspect-[1300/768] w-full rounded-md bg-gray md:mt-12" />
		</div>
	);
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the params-dependent content streams inside Suspense.
export default function CollectionPage(props: PageProps<"/collection/[slug]">) {
	return (
		<Suspense fallback={<CollectionPageSkeleton />}>
			<CollectionContent params={props.params} />
		</Suspense>
	);
}

// The SDK throws on a 404 despite its `| null` type. Without the null, the `!collection`
// branches never run and an unknown slug answers 200 with the error page.
const getCollectionData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
};

const CollectionContent = async ({ params }: { params: PageProps<"/collection/[slug]">["params"] }) => {
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		notFound();
	}

	const theme = colorThemeFor(collection.slug);
	const products = await getCollectionProducts(collection);
	const [heroProduct] = products;
	// Placeholder copy ("IVAR collection") repeats the title; show only a real description.
	const description = richTextToPlain(collection.description);
	const showDescription =
		description.length > 0 && description.toLowerCase() !== `${collection.name} collection`.toLowerCase();

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			{/* The original's collection hero: the collection's own pastel ground and ink. */}
			<section
				data-flush
				className="rounded-b-xl px-4 pt-24 pb-4 md:px-8 md:pt-34 md:pb-8"
				style={{ background: theme.background }}
			>
				<h1
					className="mx-auto mb-7 max-w-[60rem] text-center text-ui-3xl whitespace-pre-line md:text-ui-5xl"
					style={{ color: theme.text }}
				>
					{collection.name}
				</h1>
				{showDescription && (
					<p
						className="mx-auto mb-8 max-w-[40rem] text-center leading-paragraph whitespace-pre-line"
						style={{ color: theme.text }}
					>
						{description}
					</p>
				)}
				{heroProduct && (
					<div className="mt-6 md:mt-12">
						<ProductHero product={heroProduct} priority />
					</div>
				)}
			</section>
			<div className="mt-8 mb-32 px-4 md:px-8">
				{products.length === 0 ? (
					<div className="mt-16 text-center text-ui-lg text-darkgray">
						No products in this collection yet.
					</div>
				) : (
					<ProductListing products={products} priorityFirst={false} />
				)}
				<div className="mt-[7.5vw]">
					<CalloutModule
						text={`Every piece in ${collection.name} is chosen to be used, loved and kept for years.`}
						link={{ href: "/products", label: "Shop all products" }}
						color={theme.text}
					/>
				</div>
			</div>
		</>
	);
};
