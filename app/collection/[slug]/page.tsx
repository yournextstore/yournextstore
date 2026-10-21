import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { PageMasthead } from "@/components/sections/home";
import { COLLECTION_PHOTO, pieces, richTextToPlain } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
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

/**
 * The masthead for one collection: its photograph dimmed behind the glow, a caps count, the name in
 * tracked Playfair caps and its note in brass italic.
 */
function CollectionHeader({
	collection,
	image,
	count,
}: {
	collection: APICollectionGetByIdResult;
	image: string;
	count: number;
}) {
	const description = richTextToPlain(collection.description);
	return (
		<PageMasthead
			kicker={`Collection · ${pieces(count)}`}
			title={collection.name}
			line={description || "A small set of bottles and tools, chosen to go together."}
			backdrop={
				image ? (
					<>
						<Image
							src={image}
							alt=""
							fill
							sizes="100vw"
							className="aged object-cover opacity-20"
							priority
							fetchPriority="high"
						/>
						<span
							aria-hidden="true"
							className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,26,24,0.55),rgba(26,26,24,0.95))]"
						/>
					</>
				) : null
			}
		/>
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
		<div className="min-h-svh">
			<PageMasthead
				kicker={"\u00a0"}
				title={
					<span className="inline-block h-[1.2em] w-48 animate-pulse rounded-[2px] bg-panel align-middle" />
				}
				line={"\u00a0"}
			/>
			<div className="container-x section-y">
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
	const image = COLLECTION_PHOTO;

	return (
		<div className="min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} image={image} count={products.length} />
			<div className="container-x section-y">
				{products.length > 0 ? (
					<>
						<h2 className="section-title">In This Collection</h2>
						<div
							className={cn(
								LISTING_GRID,
								products.length < 3 && "mx-auto max-w-[380px] sm:grid-cols-1 lg:grid-cols-1",
							)}
						>
							{products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
						<div className="mt-12 text-center">
							<Link href="/products" className="btn">
								The full menu <span aria-hidden="true">→</span>
							</Link>
						</div>
					</>
				) : (
					<p className="serif py-16 text-center text-[1.5rem] text-cream italic">
						This collection is empty for now.{" "}
						<Link href="/products" className="text-gold underline underline-offset-4 hover:text-cream">
							See the whole shelf
						</Link>
						.
					</p>
				)}
			</div>
		</div>
	);
};
