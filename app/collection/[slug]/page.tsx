import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { CatalogGrid } from "@/components/njx/catalog-grid";
import { CollectionPills } from "@/components/njx/collection-pills";
import { cardSortPrice, ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCollections, plainText } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";
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

/** The original's catalogue header: big title, intro line and a pill per collection. */
function CollectionHeader({
	title,
	description,
	collections,
	activeSlug,
}: {
	title: string;
	description: string;
	collections: { slug: string; name: string }[];
	activeSlug: string;
}) {
	return (
		<section className="mx-auto max-w-6xl px-5 pt-5 md:pt-6">
			<h1 className="font-display text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight wrap-break-word">
				{title}
			</h1>
			{description ? (
				<p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">{description}</p>
			) : null}
			<CollectionPills collections={collections} activeSlug={activeSlug} />
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

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const [products, { taxBehavior }] = await Promise.all([
		getCollectionProducts(collection),
		getStoreConfig(),
	]);

	if (products.length === 0) {
		return (
			<p className="py-10 text-center text-muted-foreground sm:py-16">
				Nothing here yet — check the other collections.
			</p>
		);
	}

	return (
		<CatalogGrid
			items={products.map((product) => ({
				id: product.id,
				name: product.name,
				price: cardSortPrice(product, taxBehavior),
				tag: product.category?.name ?? null,
			}))}
		>
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index < 2} headingLevel="h2" />
			))}
		</CatalogGrid>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh">
			<section className="mx-auto max-w-6xl px-5 pt-5 md:pt-6">
				<div className="h-12 w-64 animate-pulse rounded-md bg-tile sm:h-14" />
				<div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded-md bg-tile" />
				<div className="mt-7 flex gap-2 pb-6">
					<div className="h-11 w-28 animate-pulse rounded-md bg-tile" />
					<div className="h-11 w-28 animate-pulse rounded-md bg-tile" />
				</div>
			</section>
			<section className="mx-auto max-w-6xl px-5">
				<div className="mb-6 h-16 animate-pulse rounded-2xl border border-line" />
				<ProductGridSkeleton count={4} />
			</section>
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

	const collections = await getCollections();

	return (
		<div className="min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader
				title={collection.name}
				description={plainText(collection.description)}
				collections={collections}
				activeSlug={collection.slug}
			/>
			<section className="mx-auto max-w-6xl px-5 pb-4 sm:pb-8">
				<CollectionProducts collection={collection} />
			</section>
		</div>
	);
};
