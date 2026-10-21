import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingToolbar, ListingToolbarSkeleton } from "@/components/gf/listing";
import { PageBar, PageBarSkeleton } from "@/components/gf/page-bar";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { TiptapRenderer } from "@/components/tiptap-renderer";
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
	const { description } = collection;
	if (!collection.image && !description) {
		return null;
	}
	return (
		<section className="mt-[22px] overflow-hidden rounded-[30px] bg-white gf-shadow">
			{collection.image && (
				<div className="relative aspect-[2/1] bg-flash-white">
					<YNSMedia
						src={collection.image}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, 592px"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				</div>
			)}
			{/* The API sends rich text (TipTap); older payloads sent a plain string. */}
			{typeof description === "string" ? (
				<p className="p-5 text-gf-h6 text-muted-foreground">{description}</p>
			) : description ? (
				<div className="prose max-w-none p-5 text-gf-h6 text-muted-foreground tiptap-content">
					<TiptapRenderer content={description} />
				</div>
			) : null}
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
		<>
			<ListingToolbar count={`${products.length} ${products.length === 1 ? "product" : "products"}`} />
			<h2 className="sr-only">Products</h2>
			{products.length === 0 ? (
				<div className="py-16 text-center">
					<p className="text-gf-h5 text-muted-foreground">Nothing on this shelf yet.</p>
				</div>
			) : (
				<div className={PRODUCT_GRID}>
					{products.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={!collection.image && index < 2} />
					))}
				</div>
			)}
		</>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="min-h-[calc(100svh+160px)]">
			<PageBarSkeleton />
			<div className="mt-[22px] aspect-[2/1] rounded-[30px] bg-flash-white" />
			<ListingToolbarSkeleton controls={0} />
			<ProductGridSkeleton />
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
		<div className="min-h-[calc(100svh+160px)]">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<PageBar title={collection.name} fallbackHref="/products" />
			<CollectionHeader collection={collection} />
			<CollectionProducts collection={collection} />
		</div>
	);
};
