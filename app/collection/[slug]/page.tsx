import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { CollectionPills, ListingBanner, ListingToolbar } from "@/components/listing";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductGrid } from "@/components/sections/product-grid";
import { editorial, flattenDescription, getHomeData } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { encodeVts } from "@/lib/vts";
import { SortSelect } from "../../products/products-sort-select";

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

const sortOptions = [
	{ value: "featured", label: "Featured" },
	{ value: "price-asc", label: "Price: low to high" },
	{ value: "price-desc", label: "Price: high to low" },
	{ value: "name", label: "Name A–Z" },
] as const;

type CollectionProduct = Awaited<ReturnType<typeof getCollectionProducts>>[number];

async function sortProducts(products: CollectionProduct[], sort: string | undefined) {
	if (sort === "name") {
		return products.toSorted((a, b) => a.name.localeCompare(b.name));
	}
	if (sort !== "price-asc" && sort !== "price-desc") {
		return products;
	}
	const { taxBehavior } = await getStoreConfig();
	const priceOf = (p: CollectionProduct) => {
		const v = p.variants[0];
		return v ? Number(displayPrice(v, taxBehavior)) : 0;
	};
	const sign = sort === "price-asc" ? 1 : -1;
	return products.toSorted((a, b) => sign * (priceOf(a) - priceOf(b)));
}

function CollectionPageSkeleton() {
	return (
		<>
			<section data-hero className="h-[42vh] min-h-[300px] animate-pulse bg-card" />
			<div className="shell pt-8 pb-6">
				<div className="h-[46px]" />
			</div>
			<div className="shell min-h-svh">
				<div className="mb-6 h-[58px] rounded-2xl border border-border" />
				<ProductGridSkeleton />
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
	searchParams: PageProps<"/collection/[slug]">["searchParams"];
}) => {
	const [{ slug }, query] = await Promise.all([params, searchParams]);
	const collection = await getCollectionData(slug);

	if (!collection) {
		notFound();
	}

	const products = await sortProducts(
		await getCollectionProducts(collection),
		typeof query.sort === "string" ? query.sort : undefined,
	);
	const image =
		(await getHomeData()).tiles.find((tile) => tile.href === `/collection/${collection.slug}`)?.image ??
		editorial.hero;

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<ListingBanner
				title={collection.name}
				description={flattenDescription(collection.description)}
				image={image}
			/>
			<CollectionPills active={collection.slug} />
			<section aria-labelledby="collection-products" className="shell min-h-svh pb-4 sm:pb-8">
				<h2 id="collection-products" className="sr-only">
					{collection.name} products
				</h2>
				{products.length === 0 ? (
					<div className="py-10 text-center sm:py-16">
						<p className="text-muted-foreground">Nothing here yet — the other shelves are fuller.</p>
						<Link
							href="/products"
							className="mt-6 inline-block rounded-md border border-border px-7 py-3 text-[14px] font-semibold transition hover:border-brass hover:text-brass"
						>
							Shop all products
						</Link>
					</div>
				) : (
					<>
						<ListingToolbar>
							<p className="px-1 text-[13px] text-muted-foreground">
								{products.length} {products.length === 1 ? "product" : "products"}
							</p>
							<span className="flex items-center gap-2 text-[13px] text-muted-foreground">
								Sort
								<SortSelect options={sortOptions} />
							</span>
						</ListingToolbar>
						<ProductGrid products={products} kicker={collection.name} />
					</>
				)}
			</section>
		</>
	);
};
