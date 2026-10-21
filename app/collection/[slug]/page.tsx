import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingHeader } from "@/components/listing-header";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { autoGrid } from "@/lib/grid";
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
		<div className="pt-8">
			<ProductGridSkeleton />
		</div>
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

	if (products.length === 0) {
		const { data: browse } = await commerce
			.productBrowse({ active: true, limit: 12 })
			.catch(() => ({ data: [] as Awaited<ReturnType<typeof commerce.productBrowse>>["data"] }));
		const others = browse.filter((product) => (product.images ?? []).length > 0).slice(0, 4);
		return (
			<div className="pt-8">
				<p className="py-12 text-center text-lg text-muted-foreground">This collection is empty for now.</p>
				{others.length > 0 && (
					<section aria-labelledby="collection-others">
						<h2 id="collection-others" className="pb-6 text-2xl">
							Browse the shop
						</h2>
						<div className={`${autoGrid} gap-y-8`}>
							{others.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</section>
				)}
			</div>
		);
	}

	return (
		<div className={`${autoGrid} gap-y-8 pt-8`}>
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index < 4} />
			))}
		</div>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="shell min-h-svh">
			<div className="border-b border-border pb-8">
				<div className="mt-2 h-5 w-48 animate-pulse rounded bg-secondary" />
				<div className="mx-auto mt-10 h-9 w-56 animate-pulse rounded bg-secondary" />
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
		<div className="shell min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<ListingHeader
				crumbs={[{ href: `/collection/${collection.slug}`, label: collection.name }]}
				title={collection.name}
				description={
					// The API sends rich text (TipTap); older payloads sent a plain string.
					typeof collection.description === "string" ? (
						collection.description
					) : collection.description ? (
						<div className="prose max-w-none text-muted-foreground tiptap-content">
							<TiptapRenderer content={collection.description} />
						</div>
					) : undefined
				}
			/>
			<Suspense fallback={<CollectionProductsSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</div>
	);
};
