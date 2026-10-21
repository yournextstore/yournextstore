import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingBanner } from "@/components/listing-banner";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getProducts, PHOTOS } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { plainText } from "@/lib/display";
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

function CollectionHeader({ collection, count }: { collection: APICollectionGetByIdResult; count: number }) {
	const description = plainText(collection.description);
	return (
		<ListingBanner image={PHOTOS.collection}>
			<h1 className="font-montserrat text-[2.5rem] leading-tight font-bold text-white sm:text-[3.5rem]">
				{collection.name}
			</h1>
			{description && (
				<p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{description}</p>
			)}
			<p className="mt-5 text-sm text-white/85">
				{count} {count === 1 ? "product" : "products"} available
			</p>
		</ListingBanner>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="mx-auto min-h-svh max-w-[68rem] px-4 py-10 sm:px-6">
			<ProductGridSkeleton />
		</section>
	);
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
	products,
}: {
	products: Awaited<ReturnType<typeof getCollectionProducts>>;
}) {
	if (products.length === 0) {
		// A manual collection with no members yet: say so, then keep the shopper moving.
		const fallback = await getProducts(3);
		return (
			<section className="mx-auto min-h-svh max-w-[68rem] px-4 py-14 sm:px-6">
				<p className="text-center text-lg text-steel">Nothing in this collection yet.</p>
				{fallback.length > 0 && (
					<>
						<h2 className="section-title mt-14 mb-10 text-center text-[2rem] text-ink lg:text-heading-md">
							Meanwhile, <span className="stroke-word">in</span> the shop
						</h2>
						<div className={LISTING_GRID}>
							{fallback.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</>
				)}
			</section>
		);
	}

	return (
		<section className="mx-auto min-h-svh max-w-[68rem] px-4 py-10 sm:px-6 lg:py-14">
			<h2 className="sr-only">Products</h2>
			<div className={LISTING_GRID}>
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} headingLevel="h3" />
				))}
			</div>
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<>
			<section
				data-skeleton
				className="flex min-h-[19rem] items-center justify-center bg-[#1d2233] lg:min-h-96"
			>
				<div className="h-14 w-72 animate-pulse rounded bg-white/10" />
			</section>
			<CollectionProductsSkeleton />
		</>
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

	const products = await getCollectionProducts(collection);

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} count={products.length} />
			<CollectionProducts products={products} />
		</>
	);
};
