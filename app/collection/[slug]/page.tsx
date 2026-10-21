import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductGrid } from "@/components/sections/product-grid";
import { richTextToPlain } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
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

const BANDS = [
	"bg-photon-yellow text-black",
	"bg-photon-blue text-white",
	"bg-photon-pink text-black",
	"bg-photon-green text-white",
] as const;

/** Picks one of Photon's colour fields from the slug, so a collection keeps its colour. */
function bandFor(slug: string) {
	const hash = [...slug].reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return BANDS[hash % BANDS.length] ?? BANDS[0];
}

function CollectionHeader({ collection, count }: { collection: APICollectionGetByIdResult; count: number }) {
	const description = richTextToPlain(collection.description);
	return (
		<section
			className={cn(
				"relative h-[45vh] min-h-64 overflow-hidden",
				collection.image ? "bg-black text-white" : bandFor(collection.slug),
			)}
		>
			{collection.image && (
				<>
					<YNSMedia src={collection.image} alt="" fill sizes="100vw" className="object-cover" priority />
					<div aria-hidden className="absolute inset-0 bg-black/25" />
				</>
			)}
			<div className="absolute inset-x-0 top-1/2 max-w-[60rem] p-[var(--main-padding)]">
				<h1 className="text-photon-title">{collection.name}</h1>
				{description && <p>{description}</p>}
				<p>
					{count} {count === 1 ? "product" : "products"}
				</p>
			</div>
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
			<div className="h-[45vh] min-h-64 bg-photon-wash" />
			<div className="py-[var(--main-padding)]">
				<ProductGridSkeleton count={3} />
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

	return (
		<div className="min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} count={products.length} />
			{products.length > 0 ? (
				<ProductGrid products={products} showViewAll={false} />
			) : (
				<p className="px-[var(--main-gap)] py-24 text-center">This collection is empty for now.</p>
			)}
			<nav aria-label="More" className="flex justify-between px-[var(--main-gap)] pb-[var(--main-padding)]">
				<Link href="/collections" className="inline-flex h-6 items-center">
					All Collections
				</Link>
				<Link href="/products" className="inline-flex h-6 items-center">
					All Products ↗
				</Link>
			</nav>
		</div>
	);
};
