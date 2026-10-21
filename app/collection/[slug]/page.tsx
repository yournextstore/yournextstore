import type { APICollectionGetByIdResult } from "commerce-kit";
import { ChevronRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { CatalogNav, EmptyResults, ListingShell } from "@/components/listing";
import { PageHeading } from "@/components/page-heading";
import { LISTING_CELLS, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductCells } from "@/components/sections/product-grid";
import { getCatalogEntries, getProducts } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { itemsLabel } from "@/lib/display";
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

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const [products, entries, fallback] = await Promise.all([
		getCollectionProducts(collection),
		getCatalogEntries(),
		getProducts(3),
	]);
	const href = `/collection/${collection.slug}`;
	const hasCategories = entries.some((entry) => entry.href.startsWith("/category/"));

	return (
		<div className="min-h-svh">
			<PageHeading
				crumbs={[
					{ href: "/", label: "Home" },
					{ href: "/products", label: "Catalog" },
					{ label: collection.name },
				]}
				title={collection.name}
				subtitle={itemsLabel(products.length)}
			/>
			<ListingShell
				sidebar={
					<CatalogNav
						entries={entries}
						activeHref={href}
						title={hasCategories ? "Categories" : "Collections"}
					/>
				}
			>
				{products.length > 0 ? (
					<ProductCells headingLevel="h2" products={products} className={LISTING_CELLS} />
				) : (
					<>
						<EmptyResults>
							<p className="text-foreground">This collection is being restocked.</p>
							<p className="mt-[5px] text-uk-sm">Meanwhile, these are in the shop right now.</p>
						</EmptyResults>
						<ProductCells
							headingLevel="h2"
							products={fallback}
							className={`${LISTING_CELLS} border-t border-border`}
						/>
						<p className="border-t border-border py-5 text-center">
							<Link href="/products" className="uk-link-all">
								Shop all
								<ChevronRightIcon aria-hidden className="size-3" strokeWidth={1.5} />
							</Link>
						</p>
					</>
				)}
			</ListingShell>
		</div>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="px-[15px] pt-5 pb-5 text-center sm:pt-10 lg:pb-[30px]">
				<div className="mx-auto h-5 w-48 animate-pulse rounded-[2px] bg-border" />
				<div className="mx-auto mt-[10px] h-12 w-72 max-w-full animate-pulse rounded-[2px] bg-border" />
				<div className="mx-auto mt-[5px] h-5 w-16 animate-pulse rounded-[2px] bg-border" />
			</div>
			<ListingShell sidebar={<div className="h-64" />}>
				<ProductGridSkeleton count={6} className={LISTING_CELLS} />
			</ListingShell>
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
			<CollectionProducts collection={collection} />
		</>
	);
};
