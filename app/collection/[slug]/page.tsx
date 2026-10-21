import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { SortSelect } from "@/app/products/products-sort-select";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { richTextParagraphs } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { encodeVts } from "@/lib/vts";
import { YNSMedia } from "@/lib/yns-media";

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const sortOptions = [
	{ value: "newest", label: "Latest arrivals" },
	{ value: "price-asc", label: "Lowest price" },
	{ value: "price-desc", label: "Highest price" },
	{ value: "name", label: "Name: A–Z" },
] as const;

type Sortable = { name: string; createdAt: string; variants: readonly { price: string }[] };

const lowestPrice = (product: Sortable) =>
	product.variants.reduce<bigint | null>((min, variant) => {
		const price = BigInt(variant.price);
		return min === null || price < min ? price : min;
	}, null) ?? 0n;

// A collection is one fetched list, so its sort runs here rather than in the browse query.
function sortProducts<T extends Sortable>(products: T[], sort: string | undefined): T[] {
	const sorted = [...products];
	if (sort === "price-asc" || sort === "price-desc") {
		const direction = sort === "price-asc" ? 1 : -1;
		return sorted.sort((a, b) => {
			const diff = lowestPrice(a) - lowestPrice(b);
			return diff === 0n ? 0 : diff > 0n ? direction : -direction;
		});
	}
	if (sort === "name") return sorted.sort((a, b) => a.name.localeCompare(b.name));
	if (sort === "newest") {
		return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}
	return sorted;
}

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
		typeof collection.description === "string"
			? collection.description
			: `Shop the ${collection.name} collection at ${storeName}.`;
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

/**
 * Full-bleed photograph, a full viewport tall from md, under the transparent header. The
 * collection's own image when it has one, the theme's lifestyle photograph otherwise.
 */
function CollectionHero({ collection }: { collection: APICollectionGetByIdResult }) {
	return (
		<div data-hero className="relative mb-8 aspect-[2/1] w-full md:mb-19 md:aspect-auto md:h-screen">
			{collection.image ? (
				<YNSMedia
					src={collection.image}
					alt={collection.name}
					fill
					sizes="100vw"
					className="object-cover"
					priority
					fetchPriority="high"
				/>
			) : (
				<Image
					src="/images/interiors/collection-dining-chair.jpg"
					alt="An oak dining chair with a linen throw against a warm grey plaster wall"
					fill
					sizes="100vw"
					className="object-cover"
					priority
					fetchPriority="high"
				/>
			)}
		</div>
	);
}

/** The statement row: the description's first paragraph large on the left, the rest beside it. */
function CollectionIntro({ collection }: { collection: APICollectionGetByIdResult }) {
	const [lead, ...rest] = richTextParagraphs(collection.description);
	if (!lead) return null;

	return (
		<div className="layout mb-26 md:mb-36">
			<p className="col-span-full font-medium text-title-md max-md:mb-6 md:text-title-2xl lg:col-span-6">
				{lead}
			</p>
			{rest.length > 0 && (
				<div className="col-span-full flex flex-col gap-5 md:mt-18 md:gap-9 md:text-title-md lg:col-start-8 lg:col-end-13">
					{rest.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
			)}
		</div>
	);
}

function CollectionProductsSkeleton() {
	return <ProductGridSkeleton />;
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
	searchParams: Promise<{ sort?: string }>;
}) {
	const [products, { sort }] = await Promise.all([getCollectionProducts(collection), searchParams]);
	const sorted = sortProducts<(typeof products)[number]>(products, sort);

	if (sorted.length === 0) {
		return <p className="py-16 md:text-title-md">This collection has no products yet.</p>;
	}

	return (
		<div className="grid grid-cols-12 gap-x-4 gap-y-10 md:gap-x-12 md:gap-y-16">
			{sorted.map((product) => (
				<div key={product.id} className="col-span-6 md:col-span-4">
					<ProductCard product={product} />
				</div>
			))}
		</div>
	);
}

function CollectionPageSkeleton() {
	return (
		<>
			<div className="mb-8 aspect-[2/1] w-full animate-pulse bg-grayscale-50 md:mb-19 md:aspect-auto md:h-screen" />
			<div className="layout pb-26 md:pb-36">
				<div className="col-span-full">
					<div className="mb-6 h-10 w-56 animate-pulse bg-grayscale-50 md:mb-7 md:h-16" />
					<ProductGridSkeleton />
				</div>
			</div>
		</>
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
	searchParams: Promise<{ sort?: string }>;
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
			<CollectionHero collection={collection} />
			<CollectionIntro collection={collection} />
			<div className="layout pb-26 md:pb-36">
				<div className="col-span-full">
					<h1 className="mb-6 text-title-md md:mb-7 md:text-title-2xl">{collection.name}</h1>
					<div className="mb-6 flex justify-end md:mb-8">
						<SortSelect options={sortOptions} />
					</div>
					<Suspense fallback={<CollectionProductsSkeleton />}>
						<CollectionProducts collection={collection} searchParams={searchParams} />
					</Suspense>
				</div>
			</div>
		</>
	);
};
