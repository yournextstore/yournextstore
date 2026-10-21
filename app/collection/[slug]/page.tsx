import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { TrendingNow } from "@/components/sections/home";
import { richTextToPlain } from "@/lib/catalog";
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

/** The original's collection banner: copy on a blush panel, the collection photograph beside it. */
function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	const description = richTextToPlain(collection.description);
	return (
		<section className="container-page pt-6 md:pt-8">
			<div className="grid overflow-hidden rounded-xl bg-[#ecdeda] md:grid-cols-2">
				<div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-14">
					<h1 className="text-title-xl text-foreground">{collection.name}</h1>
					{description && (
						<p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground">{description}</p>
					)}
				</div>
				{collection.image && (
					<div className="relative aspect-[16/9] md:aspect-auto md:min-h-[300px]">
						<YNSMedia
							src={collection.image}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							priority
							fetchPriority="high"
						/>
					</div>
				)}
			</div>
		</section>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="container-page py-8 md:py-10">
			<div className="mb-6 h-10" />
			<ProductGridSkeleton />
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
	const products = await getCollectionProducts(collection);

	return (
		<section aria-label={`${collection.name} products`} className="container-page py-8 md:py-10">
			<div className="mb-6 flex h-10 items-center border-b border-border pb-0">
				<p className="text-sm">
					{products.length} {products.length === 1 ? "product" : "products"}
				</p>
			</div>
			{products.length === 0 ? (
				<div className="rounded-2xl bg-card px-6 py-20 text-center">
					<p className="font-heading text-title-sm text-foreground">This collection is being restocked.</p>
					<Link
						href="/products"
						className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
					>
						Shop all products
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
					{products.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index < 4} />
					))}
				</div>
			)}
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<>
			<section className="container-page pt-6 md:pt-8">
				<div className="h-[300px] animate-pulse rounded-xl bg-[#ecdeda]" />
			</section>
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
			<CollectionHeader collection={collection} />
			<Suspense fallback={<CollectionProductsSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
			<TrendingNow />
		</>
	);
};
