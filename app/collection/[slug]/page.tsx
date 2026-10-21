import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { EDITORIAL_IMAGES, richTextToPlain } from "@/lib/catalog";
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

/** The home hero's sage panel, retold for one collection: name and note beside its photograph and a coral count badge. */
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
		<section className="mx-auto grid max-w-[1280px] items-center gap-8 bg-[linear-gradient(90deg,#edf2e7_0%,#f1eae3_100%)] px-[22px] pb-[34px] pt-10 md:min-h-[460px] md:grid-cols-[1fr_1.1fr] md:px-12 md:py-14">
			<div className="min-w-0 md:pl-8">
				<p className="eyebrow mb-5">The collection</p>
				<h1 className="type-display wrap-break-word text-[clamp(2.8rem,6vw,5.2rem)]">
					<i>{collection.name}</i>
				</h1>
				{/* The API sends rich text (TipTap); older payloads sent a plain string. */}
				{collection.description && typeof collection.description !== "string" && description ? (
					<div className="prose mt-6 max-w-[380px] text-[1.03rem] leading-[1.7] text-muted-foreground tiptap-content">
						<TiptapRenderer content={collection.description} />
					</div>
				) : (
					<p className="mt-6 max-w-[380px] text-[1.03rem] leading-[1.7] text-muted-foreground">
						{description || "A small edit of flowers and gifts, chosen to sit beautifully together."}
					</p>
				)}
			</div>
			<div className="relative h-[300px] md:h-[380px]">
				<div className="relative h-full overflow-hidden rounded-tile bg-cream shadow-photo">
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
				</div>
				<p className="serif absolute -right-2 -top-4 flex size-[110px] rotate-[10deg] flex-col items-center justify-center rounded-full bg-coral-deep text-center italic leading-[1.1] text-white md:-right-[22px]">
					<span className="text-[1.7rem] font-semibold not-italic">{count}</span>
					{count === 1 ? "item" : "items"}
				</p>
			</div>
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
		<div className="min-h-svh pb-[100px]">
			<div className="mx-auto h-[674px] max-w-[1280px] animate-pulse bg-sage md:h-[460px]" />
			<div className="container-x mt-16">
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
	const image = collection.image ?? EDITORIAL_IMAGES[3];

	return (
		<div className="min-h-svh pb-[100px]">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} image={image} count={products.length} />
			<div className="container-x">
				{products.length > 0 ? (
					<>
						<div className="mb-10 mt-16 flex items-end justify-between gap-6 border-b border-line pb-4">
							<h2 className="type-display text-[clamp(2rem,4vw,3rem)]">
								In this <i>collection</i>
							</h2>
							<Link href="/products" className="link-underline shrink-0">
								Shop all <span aria-hidden="true">→</span>
							</Link>
						</div>
						<div className={LISTING_GRID}>
							{products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</>
				) : (
					<p className="serif py-24 text-center text-[1.8rem] text-ink">
						Nothing here just yet.{" "}
						<Link href="/products" className="text-coral-text underline-offset-4 hover:underline">
							Browse the whole shop
						</Link>
						.
					</p>
				)}
			</div>
		</div>
	);
};
