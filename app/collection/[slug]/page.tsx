import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { TiptapRenderer } from "@/components/tiptap-renderer";
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

/** The API sends rich text (TipTap); older payloads sent a plain string. */
function CollectionDescription({
	description,
	className,
}: {
	description: APICollectionGetByIdResult["description"];
	className: string;
}) {
	if (typeof description === "string") {
		return description ? <p className={cn("text-base", className)}>{description}</p> : null;
	}
	return description ? (
		<div className={cn("prose text-base tiptap-content", className)}>
			<TiptapRenderer content={description} />
		</div>
	) : null;
}

/** Blueprint's half hero: copy on the paper half, the collection photograph on the other. */
function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	if (!collection.image) {
		return (
			<div className="bp-container pt-8 md:pt-10">
				<h1 className="text-2xl font-bold md:text-3xl">{collection.name}</h1>
				<CollectionDescription description={collection.description} className="mt-3 max-w-2xl" />
			</div>
		);
	}
	return (
		<section className="grid md:grid-cols-2">
			<div className="relative aspect-[4/3] bg-neutral-lightest md:order-last md:aspect-auto md:min-h-[26rem]">
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
			<div className="flex flex-col justify-center px-4 py-10 md:px-14">
				<p className="bp-superheading mb-2">Collection</p>
				<h1 className="bp-h2">{collection.name}</h1>
				<CollectionDescription description={collection.description} className="mt-4 max-w-lg" />
			</div>
		</section>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="bp-container py-10 md:py-12">
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
		<section className="bp-container py-10 md:py-12">
			<p className="mb-6 text-sm">
				{products.length} {products.length === 1 ? "product" : "products"}
			</p>
			{products.length === 0 ? (
				<p className="py-16 text-center text-lg">This collection is empty for now.</p>
			) : (
				<div className={LISTING_GRID}>
					{products.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index < 2} />
					))}
				</div>
			)}
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="bp-container pt-8 md:pt-10">
				<div className="h-9 w-64 animate-pulse bg-neutral-lightest" />
			</div>
			<CollectionProductsSkeleton />
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
		<div className="min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} />
			<Suspense fallback={<CollectionProductsSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</div>
	);
};
