import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { firstStill, richTextToPlain } from "@/lib/catalog";
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

/** A ledger page header for one collection: kicker, name in gold italic and its note, beside a framed photograph. */
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
	return (
		<section className="grid items-center gap-[clamp(28px,5vw,70px)] md:grid-cols-[1fr_1.1fr]">
			<div className="min-w-0">
				<p className="kicker mb-[1.2rem]">
					Collection — {count} {count === 1 ? "entry" : "entries"}
				</p>
				<h1 className="display wrap-break-word text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.04] text-cream">
					<em>{collection.name}</em>
				</h1>
				<p className="mt-[1.2rem] max-w-[58ch] text-[1.06rem] text-dim">
					{description || "A small, considered page of the ledger, entered to sit together."}
				</p>
			</div>
			<figure className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-panel">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 600px"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				)}
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(42,10,20,.85))]"
				/>
				<figcaption className="ledger absolute bottom-4 left-5 right-5 text-[0.62rem] tracking-[0.22em] text-dim">
					In the ledger · {count} {count === 1 ? "entry" : "entries"}
				</figcaption>
			</figure>
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
		<div className="container-x min-h-svh pb-[clamp(80px,12vh,150px)] pt-[clamp(40px,8vh,90px)]">
			<div className="grid items-center gap-[clamp(28px,5vw,70px)] md:grid-cols-[1fr_1.1fr]">
				<div className="space-y-5">
					<div className="h-3 w-40 animate-pulse rounded-[2px] bg-panel" />
					<div className="h-14 w-3/4 animate-pulse rounded-[2px] bg-panel" />
					<div className="h-12 w-full animate-pulse rounded-[2px] bg-panel" />
				</div>
				<div className="aspect-[4/3] animate-pulse rounded-[4px] bg-panel" />
			</div>
			<div className="mt-[clamp(48px,7vh,80px)]">
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
	const image = collection.image ?? firstStill(products[0]?.images);

	return (
		<div className="container-x min-h-svh pb-[clamp(80px,12vh,150px)] pt-[clamp(40px,8vh,90px)]">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} image={image} count={products.length} />
			{products.length > 0 ? (
				<section className="ledger-rule mt-[clamp(48px,7vh,80px)] pt-[clamp(40px,6vh,64px)] [--rule-inset:0px]">
					<div className="mb-8 flex items-end justify-between gap-6">
						<h2 className="display text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.1] text-cream">
							In this <em>collection</em>
						</h2>
						<div className="hidden shrink-0 sm:block">
							<Link href="/products" className="btn [--btn-px:18px] [--btn-py:10px]">
								The whole ledger <span aria-hidden="true">→</span>
							</Link>
						</div>
					</div>
					<div className={LISTING_GRID}>
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			) : (
				<p className="serif py-24 text-center text-[1.8rem] text-cream italic">
					This page of the ledger is blank for now.{" "}
					<Link href="/products" className="text-gold-2 underline-offset-4 hover:underline">
						Read the whole ledger
					</Link>
					.
				</p>
			)}
		</div>
	);
};
