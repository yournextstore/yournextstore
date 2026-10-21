import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { type Chip, EmptyListing, ListingSkeleton, PageHead, ShopTools } from "@/components/garden/listing";
import { ProductCard } from "@/components/product-card";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getLinkableCollections, plainText } from "@/lib/garden";
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
			<div className="page-head">
				<div className="wrap">
					<div className="h-4 w-40 rounded bg-[var(--paper-3)]" />
					<div className="mt-5 h-12 w-72 max-w-full rounded bg-[var(--paper-3)]" />
					<div className="mt-6 h-5 w-[min(36rem,100%)] rounded bg-[var(--paper-3)]" />
				</div>
			</div>
			<div className="wrap">
				<ListingSkeleton />
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

	const [products, collections] = await Promise.all([
		getCollectionProducts(collection),
		getLinkableCollections(8),
	]);
	const description = plainText(collection.description);
	const chips: Chip[] = [
		{ href: "/products", label: "Everything", active: false },
		...[collection, ...collections.filter((c) => c.id !== collection.id)].slice(0, 6).map((c) => ({
			href: `/collection/${c.slug}`,
			label: c.name,
			active: c.id === collection.id,
		})),
	];

	return (
		<div className="min-h-svh pb-[clamp(3rem,6vw,5rem)]">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<PageHead
				crumbs={[
					{ href: "/", label: "Home" },
					{ href: "/products", label: "Shop" },
					{ label: collection.name },
				]}
				title={collection.name}
				lede={
					description.length > 40
						? description
						: `A small edit of ${products.length === 1 ? "one item" : `${products.length} items`}, chosen to go well together.`
				}
				note={
					<>
						Picked to live
						<br />
						side by side.
					</>
				}
			/>
			<div className="wrap">
				<ShopTools chips={chips} shown={products.length} total={products.length} sortable={false} />
				{products.length === 0 ? (
					<EmptyListing message="This collection is still being put together." />
				) : (
					<div className="shop-grid">
						{products.map((product, index) => (
							<ProductCard
								key={product.id}
								product={product}
								priority={index === 0}
								showNote
								headingLevel="h2"
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
