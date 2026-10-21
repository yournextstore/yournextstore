import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import {
	BannerSkeleton,
	ListingBanner,
	ListingResults,
	ListingResultsSkeleton,
	ListingShell,
	PriceChips,
	presentBuckets,
} from "@/components/bento/listing";
import type { TileProduct } from "@/components/product-card";
import { editorialPhoto, richText } from "@/lib/aqua";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { getListingSort, getPriceBucket, inBucket, lowestPrice, sortProducts } from "@/lib/listing";
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
		richText(collection.description) ?? `Shop the ${collection.name} collection at ${storeName}.`;
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

async function CollectionProducts({
	collection,
	searchParams,
}: {
	collection: APICollectionGetByIdResult;
	searchParams: Promise<{ sort?: string; price?: string }>;
}) {
	const [{ sort: sortSlug, price }, products] = await Promise.all([
		searchParams,
		getCollectionProducts(collection),
	]);
	const sort = getListingSort(sortSlug);
	const bucket = getPriceBucket(price);
	const priced: Array<TileProduct & { variants: ReadonlyArray<{ price: string }> }> = products;
	const shown = sortProducts(priced, sort).filter((product) => inBucket(lowestPrice(product), bucket));
	const basePath = `/collection/${collection.slug}`;
	const query = { sort: sortSlug, price: bucket?.slug };
	const image = collection.image ?? editorialPhoto(collection.name, 1);

	return (
		<ListingResults
			products={shown}
			basePath={basePath}
			sort={sort}
			query={query}
			empty={
				products.length === 0
					? "No products found in this collection."
					: "No products match these filters. Try clearing one."
			}
			before={
				<>
					<ListingBanner
						title={collection.name}
						description={richText(collection.description)}
						image={image}
						count={products.length}
					/>
					<PriceChips
						basePath={basePath}
						buckets={presentBuckets(products.map(lowestPrice).filter((price) => price > 0))}
						query={query}
					/>
				</>
			}
		/>
	);
}

function CollectionPageSkeleton() {
	return (
		<ListingShell activePath="">
			<ListingResultsSkeleton before={<BannerSkeleton />} />
		</ListingShell>
	);
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the params-dependent content streams inside Suspense.
export default function CollectionPage(props: PageProps<"/collection/[slug]">) {
	return (
		<Suspense fallback={<CollectionPageSkeleton />}>
			<CollectionContent params={props.params} searchParams={props.searchParams} />
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

const CollectionContent = async ({
	params,
	searchParams,
}: {
	params: PageProps<"/collection/[slug]">["params"];
	searchParams: Promise<{ sort?: string; price?: string }>;
}) => {
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		notFound();
	}

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<ListingShell activePath={`/collection/${collection.slug}`}>
				<Suspense fallback={<ListingResultsSkeleton before={<BannerSkeleton />} />}>
					<CollectionProducts collection={collection} searchParams={searchParams} />
				</Suspense>
			</ListingShell>
		</>
	);
};
