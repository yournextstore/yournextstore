import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Notebook } from "@/components/notebook";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { SectionHead } from "@/components/sections/home";
import { pieces, richTextToPlain } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { shelfPhoto } from "@/lib/editorial";
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

/** The home hero, retold for one collection: name and note beside the notebook with its photograph pasted in. */
function CollectionHeader({
	collection,
	image,
	count,
}: {
	collection: APICollectionGetByIdResult;
	image: string | null;
	count: number;
}) {
	const description = richTextToPlain(collection.description);
	const lede =
		description && !/^\S+ collection$/i.test(description)
			? description
			: `A small shelf of pieces that sit well together — ${pieces(count)}, each with a page of its own.`;
	return (
		<section className="wrap grid items-center gap-[clamp(1.6rem,4vw,3.6rem)] pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(2.5rem,6vw,4.5rem)] min-[920px]:grid-cols-[1.02fr_0.98fr]">
			<div className="min-w-0">
				<SectionHead
					as="h1"
					reveal={false}
					kicker="Collection"
					title={<em>{collection.name}</em>}
					lede={lede}
				/>
				<dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-5">
					<div className="flex flex-col gap-1">
						<dt className="label-mono text-[0.68rem] tracking-[0.16em]">On this shelf</dt>
						<dd className="m-0 font-display text-[1.5rem] leading-tight">{pieces(count)}</dd>
					</div>
				</dl>
			</div>
			<Notebook
				priority
				image={image}
				pages={[22, 23]}
				note={
					<>
						filed under —
						<br />
						{collection.name.toLowerCase()}
					</>
				}
				captionStart={<>The shelf — “{collection.name}”</>}
				captionEnd={pieces(count)}
			/>
		</section>
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

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh pb-[clamp(4rem,9vw,7rem)]">
			<div className="wrap grid items-center gap-[clamp(1.6rem,4vw,3.6rem)] pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(2.5rem,6vw,4.5rem)] min-[920px]:grid-cols-[1.02fr_0.98fr]">
				<div className="space-y-4">
					<div className="h-4 w-28 animate-pulse rounded bg-kraft-2" />
					<div className="h-16 w-2/3 animate-pulse rounded bg-kraft-2" />
					<div className="h-20 w-full animate-pulse rounded bg-kraft-2" />
				</div>
				<div className="h-[clamp(260px,32vw,370px)] animate-pulse rounded-lg bg-kraft-2" />
			</div>
			<div className="wrap mt-6">
				<CollectionProductsSkeleton />
			</div>
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
	const image = shelfPhoto(collection.slug);

	return (
		<div className="min-h-svh pb-[clamp(4rem,9vw,7rem)]">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} image={image} count={products.length} />
			<div className="wrap">
				{products.length > 0 ? (
					<>
						<div className="mb-8 flex items-end justify-between gap-6 border-b border-line pb-4">
							<h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">
								On the <em className="swipe">shelf</em>
							</h2>
							<Link href="/products" className="btn btn-ghost shrink-0 py-2 text-[0.85rem]">
								The whole range <span aria-hidden="true">→</span>
							</Link>
						</div>
						<div className={LISTING_GRID}>
							{products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</>
				) : (
					<div className="py-24 text-center">
						<p className="font-display text-[1.8rem] text-ink">A blank page, for now.</p>
						<Link href="/products" className="btn btn-ghost mt-5">
							Browse the whole range <span aria-hidden="true">→</span>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};
