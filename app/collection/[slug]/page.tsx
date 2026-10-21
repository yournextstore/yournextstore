import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { PageHeader, PageHeaderSkeleton } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { commerce, getStoreSeo } from "@/lib/commerce";
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

function CollectionProductsSkeleton() {
	return (
		<section className="shell min-h-svh py-14 xl:py-20">
			<ProductGridSkeleton count={4} className="grid-cols-2 lg:grid-cols-4" />
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

const getFallbackProducts = async () => {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 4 }).catch(() => ({ data: [] }));
	return data;
};

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	if (products.length === 0) {
		const fallback = await getFallbackProducts();
		return (
			<section className="shell min-h-svh py-14 xl:py-20">
				<div className="mx-auto mb-14 max-w-xl text-center">
					<h2 className="cp-h2 mb-4">No Product Found!</h2>
					<p>Nothing has been added to this collection yet. Meanwhile, here is what is in the shop.</p>
				</div>
				{fallback.length > 0 ? (
					<>
						<div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
							{fallback.map((product) => (
								<ProductCard key={product.id} product={product} compact />
							))}
						</div>
						<div className="mt-8 flex justify-center md:mt-14">
							<Link href="/products" className="cp-btn cp-btn-sm md:cp-btn-lg font-medium">
								+ See All Products
							</Link>
						</div>
					</>
				) : null}
			</section>
		);
	}

	return (
		<section className="shell min-h-svh py-14 xl:py-20">
			<p className="mb-6 text-sm text-soft-text">
				{products.length} {products.length === 1 ? "product" : "products"}
			</p>
			<div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} heading="h2" compact priority={index < 4} />
				))}
			</div>
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<>
			<PageHeaderSkeleton />
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

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<PageHeader
				title={collection.name}
				crumbs={[{ href: "/products", label: "Products" }, { label: collection.name }]}
			/>
			<Suspense fallback={<CollectionProductsSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</>
	);
};
