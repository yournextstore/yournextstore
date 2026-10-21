import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { FieldBanner } from "@/components/field/field-banner";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { GRID_REFS } from "@/lib/field";
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
	const description = collectionLead(collection) ?? `Shop the ${collection.name} collection at ${storeName}.`;
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

function collectionLead(collection: APICollectionGetByIdResult) {
	// Typed as rich text, but demo stores send plain strings ("Summer Collection\r\n").
	const raw: unknown = collection.description;
	return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

function CollectionHeader({ collection, count }: { collection: APICollectionGetByIdResult; count: number }) {
	return (
		<FieldBanner
			image={collection.image}
			gridRef={GRID_REFS[1]}
			eyebrow={`COLLECTION // ${String(count).padStart(2, "0")} ITEMS`}
			title={collection.name}
			lead={collectionLead(collection)}
		/>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="section-x section-y">
			<div className="frame">
				<ProductGridSkeleton count={3} />
			</div>
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
	const { data } = await commerce.productBrowse({ active: true, limit: 12 });
	return data
		.filter((p) => (p.images?.length ?? 0) > 0 && p.variants.some((v) => Number(v.price) > 0))
		.slice(0, 3);
}

async function CollectionProducts({
	products,
}: {
	products: Awaited<ReturnType<typeof getCollectionProducts>>;
}) {
	if (products.length > 0) {
		return (
			<ProductGrid
				gridRef={GRID_REFS[3]}
				eyebrow="IN THIS COLLECTION"
				title="The edit"
				products={products}
				showViewAll={false}
				id="collection-products"
			/>
		);
	}
	// A collection can be empty by data (manual, no members yet): show the shop instead of a bare heading.
	const fallback = await getFallbackProducts();
	return (
		<ProductGrid
			gridRef={GRID_REFS[3]}
			eyebrow="NOTHING HERE YET"
			title={
				<>
					Meanwhile,
					<br />
					in the shop.
				</>
			}
			description="Nothing in this collection just yet. Here is the rest of the range."
			products={fallback}
			id="collection-products"
		/>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh">
			<section className="section-x relative flex min-h-[clamp(340px,52vh,560px)] items-end bg-panel pt-24 pb-[clamp(40px,7vh,72px)]">
				<div className="frame">
					<div className="h-4 w-48 animate-pulse bg-panel-2" />
					<div className="mt-6 h-20 w-3/4 animate-pulse bg-panel-2" />
				</div>
			</section>
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

	const products = await getCollectionProducts(collection);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} count={products.length} />
			<nav aria-label="Breadcrumb" className="section-x border-b border-line">
				<ol className="frame font-field flex flex-wrap gap-2 py-3 text-[0.72rem] tracking-[0.08em] text-dim uppercase">
					<li>
						<Link href="/" className="hover:text-ink">
							Base
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li>
						<Link href="/products" className="hover:text-ink">
							Shop
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li aria-current="page" className="text-signal">
						{collection.name}
					</li>
				</ol>
			</nav>
			<CollectionProducts products={products} />
		</div>
	);
};
