import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Crumbs } from "@/components/halfstep/crumbs";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { plainText } from "@/lib/catalog";
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
		<section className="grid items-center gap-8 pb-10 pt-6 sm:pb-14 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
			<div className="max-w-[60ch]">
				<p className="hs-kicker mb-4">[ Collection ]</p>
				<h1 className="hs-display hs-h1">{collection.name}</h1>
				{description && <p className="hs-lede mt-4">{description}</p>}
			</div>
			{collection.image && (
				<div className="hs-card p-2.5">
					<div className="hs-plate relative aspect-[16/10] overflow-hidden rounded-[10px]">
						<YNSMedia
							src={collection.image}
							alt=""
							fill
							sizes="(max-width: 1024px) 100vw, 45vw"
							className="object-cover"
							priority
						/>
					</div>
				</div>
			)}
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

async function getFallbackProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 3 });
	return data;
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	if (products.length === 0) {
		const fallback = await getFallbackProducts();
		return (
			<section className="border-t border-line pt-8">
				<p className="hs-label">[ 00 parts in this collection — yet ]</p>
				<h2 className="hs-display hs-h3 mb-6 mt-3">Meanwhile, in the shop.</h2>
				<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
					{fallback.map((product, index) => (
						<ProductCard key={product.id} product={product} index={index} />
					))}
				</div>
			</section>
		);
	}

	return (
		<section className="border-t border-line pt-8">
			<p className="hs-label mb-6">
				[ {String(products.length).padStart(2, "0")} {products.length === 1 ? "part" : "parts"} ]
			</p>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} index={index} priority={index === 0} />
				))}
			</div>
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="hs-wrap min-h-svh pb-20 pt-10 sm:pt-16">
			<div className="h-4 w-48 animate-pulse rounded bg-secondary" />
			<div className="grid items-center gap-8 pb-10 pt-6 sm:pb-14 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
				<div>
					<div className="h-4 w-32 animate-pulse rounded bg-secondary" />
					<div className="mt-4 h-14 w-3/4 animate-pulse rounded bg-secondary" />
				</div>
				<div className="aspect-[16/10] animate-pulse rounded-[14px] bg-secondary" />
			</div>
			<ProductGridSkeleton className="lg:grid-cols-3" count={3} />
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

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<div className="hs-wrap min-h-svh pb-20 pt-10 sm:pt-16">
				<Crumbs
					items={[
						{ href: "/", label: "Home" },
						{ href: "/products", label: "Catalogue" },
						{ label: collection.name },
					]}
				/>
				<CollectionHeader collection={collection} />
				<CollectionProducts collection={collection} />
			</div>
		</>
	);
};
