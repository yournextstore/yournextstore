import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductGrid } from "@/components/sections/product-grid";
import { plainText, splitTitle } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { encodeVts } from "@/lib/vts";
import { YNSMedia } from "@/lib/yns-media";

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
		plainText(collection.description) || `Shop the ${collection.name} collection at ${storeName}.`;
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
	const [lead, gilt] = splitTitle(collection.name);
	const description = plainText(collection.description);
	return (
		<section data-hero className="relative isolate overflow-hidden border-b border-hairline">
			<div aria-hidden="true" className="stage-backdrop pointer-events-none absolute inset-0" />
			<div className="container-stage relative grid grid-cols-1 items-center gap-14 pb-16 pt-28 md:pb-24 md:pt-36 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-x-12">
				<div className="animate-rise">
					<p className="text-kicker font-medium uppercase tracking-[0.42em] text-warm">Collection</p>
					<h1 className="mt-5 break-words font-display text-[clamp(2.6rem,9vw,4.75rem)] font-light leading-[0.95] tracking-[-0.03em] text-ink">
						{lead && <span>{lead} </span>}
						<span className="title-gilt">{gilt}</span>
					</h1>
					{description && (
						<p className="mt-6 max-w-md text-[15px] leading-[1.75] text-ink-soft md:text-lg">{description}</p>
					)}
					<p className="mt-8 text-[12px] text-muted-foreground">
						{count} {count === 1 ? "product" : "products"}
					</p>
				</div>
				{collection.image && (
					<div className="relative min-w-0 lg:translate-x-8">
						<div
							aria-hidden="true"
							className="absolute -inset-4 rounded-sm border border-hairline bg-gradient-to-br from-[var(--panel-from)] to-transparent md:-inset-6"
						/>
						<div className="frame relative aspect-[3/2] overflow-hidden rounded-sm">
							<YNSMedia
								src={collection.image}
								alt={collection.name}
								fill
								sizes="(max-width: 1024px) 92vw, 56vw"
								className="object-cover [filter:var(--photo-filter)]"
								priority
							/>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="container-wide py-20 sm:py-28">
			<div className="mb-14 h-[5.5rem]" />
			<ProductGridSkeleton className="lg:grid-cols-3" />
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

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh">
			<section data-hero className="relative overflow-hidden border-b border-hairline">
				<div aria-hidden="true" className="stage-backdrop pointer-events-none absolute inset-0" />
				<div className="container-stage relative grid grid-cols-1 items-center gap-14 pb-16 pt-28 md:pb-24 md:pt-36 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-x-12">
					<div className="space-y-6">
						<div className="h-4 w-28 animate-pulse rounded-sm bg-muted" />
						<div className="h-16 w-72 max-w-full animate-pulse rounded-sm bg-muted" />
						<div className="h-5 w-64 max-w-full animate-pulse rounded-sm bg-muted" />
					</div>
					<div className="frame aspect-[3/2] rounded-sm" />
				</div>
			</section>
			<CollectionProductsSkeleton />
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

	const products = await getCollectionProducts(collection);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} count={products.length} />
			{products.length > 0 ? (
				<>
					<ProductGrid
						title="In this collection"
						description={collection.name}
						products={products}
						showViewAll={false}
					/>
					<div className="container-wide -mt-8 pb-24">
						<Link href="/products" className="btn-ghost-line btn-sm">
							Shop the whole range
						</Link>
					</div>
				</>
			) : (
				// An empty collection still reads as a stage being set, and points into the shop.
				<ProductGrid
					title="Meanwhile, in the shop"
					description="This collection is still being lit"
					limit={3}
					viewAllHref="/products"
				/>
			)}
		</div>
	);
};
