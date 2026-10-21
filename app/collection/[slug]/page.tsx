import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductGrid } from "@/components/sections/product-grid";
import { ShopStrip } from "@/components/shop-strip";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { plainText } from "@/lib/display";
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

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	const description = plainText(collection.description);
	return (
		<section className="relative bg-hero">
			{collection.image && (
				<YNSMedia
					src={collection.image}
					alt=""
					fill
					sizes="100vw"
					priority
					className="object-cover object-[100%_40%] md:object-[center_35%]"
				/>
			)}
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-linear-to-r from-hero via-hero/80 to-transparent md:via-hero/40"
			/>
			<div className="relative flex min-h-64 flex-col justify-center gap-3 px-4 py-12 md:mx-16 md:min-h-80 md:px-0">
				<h1 className="max-w-3xl font-extrabold text-4xl text-bar uppercase leading-none wrap-break-word md:text-6xl">
					{collection.name}
				</h1>
				{description && <p className="max-w-md text-[#374151] text-lg">{description}</p>}
			</div>
		</section>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="min-h-svh px-3 py-8 md:px-20">
			<div className="flex h-12 items-center pb-4">
				<div className="h-5 w-24 animate-pulse bg-secondary" />
			</div>
			<ProductGridSkeleton className="lg:grid-cols-4" />
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

async function getShopFallback() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 4 });
	return data;
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	if (products.length === 0) {
		const fallback = await getShopFallback();
		return (
			<section className="min-h-svh px-3 pt-12 pb-16 md:px-20">
				<div className="text-center">
					<p className="font-bold text-2xl">Nothing here yet</p>
					<p className="mt-2 text-muted-foreground">
						This collection is still being put together.{" "}
						<Link href="/products" className="text-foreground underline underline-offset-4">
							Browse the whole shop
						</Link>
						.
					</p>
				</div>
				<ProductGrid title="Meanwhile, in the shop" products={fallback} className="mx-0 md:mx-0" />
			</section>
		);
	}

	return (
		<section className="min-h-svh px-3 py-8 md:px-20">
			<p className="flex h-12 items-center pb-4">
				{products.length} {products.length === 1 ? "product" : "products"}
			</p>
			<div className={cn(LISTING_GRID, "lg:grid-cols-4")}>
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 2} />
				))}
			</div>
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<>
			<section className="bg-hero">
				<div className="flex min-h-64 flex-col justify-center px-4 py-12 md:mx-16 md:min-h-80 md:px-0">
					<div className="h-10 w-72 animate-pulse bg-secondary" />
				</div>
			</section>
			<CollectionProductsSkeleton />
		</>
	);
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the params-dependent content streams inside Suspense.
export default function CollectionPage(props: PageProps<"/collection/[slug]">) {
	return (
		<>
			<ShopStrip />
			<Suspense fallback={<CollectionPageSkeleton />}>
				<CollectionContent params={props.params} />
			</Suspense>
		</>
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

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} />
			<Suspense fallback={<CollectionProductsSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</>
	);
};
