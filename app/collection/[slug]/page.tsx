import type { APICollectionGetByIdResult } from "commerce-kit";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Chip, Stage, tileGridClass } from "@/components/deckle";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { pieces, richTextToPlain } from "@/lib/catalog";
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

function Crumbs({ name }: { name?: string }) {
	return (
		<nav aria-label="Breadcrumb">
			<ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted-foreground">
				<li>
					<Link href="/collections" className="hover:text-foreground">
						Collections
					</Link>
				</li>
				{name && (
					<li className="inline-flex items-center gap-2">
						<ChevronRight aria-hidden="true" className="size-3" />
						<span aria-current="page">{name}</span>
					</li>
				)}
			</ol>
		</nav>
	);
}

function CollectionHeader({ collection, count }: { collection: APICollectionGetByIdResult; count: number }) {
	const description = richTextToPlain(collection.description);
	const generic = description.toLowerCase() === `${collection.name} collection`.toLowerCase();
	return (
		<div className="mt-6 grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
			<div className="grid justify-items-start gap-6">
				<Chip tone="soft">{pieces(count)}</Chip>
				<h1 className="max-w-[20ch] text-title-1 text-balance">{collection.name}</h1>
				<p className="max-w-[52ch] text-lg text-muted-foreground">
					{description && !generic
						? description
						: `${pieces(count)} gathered to sit side by side, each shown on its own sheet below.`}
				</p>
			</div>
			{collection.image && <Stage src={collection.image} alt="" caption={collection.name} priority />}
		</div>
	);
}

function CollectionProductsSkeleton() {
	return (
		<>
			<p className="mt-12 mb-6 min-h-[3.1rem] border-t border-border pt-6">
				<span className="block h-5 w-48 animate-pulse rounded bg-secondary" />
			</p>
			<ProductGridSkeleton />
		</>
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

async function CollectionProducts({
	products,
}: {
	products: Awaited<ReturnType<typeof getCollectionProducts>>;
}) {
	return (
		<>
			<p className="mt-12 mb-6 flex min-h-[3.1rem] flex-wrap items-baseline gap-x-6 border-t border-border pt-6">
				<strong className="font-semibold">
					{products.length === 1 ? "1 product" : `${products.length} products`}
				</strong>
			</p>
			{products.length === 0 ? (
				<p className="py-16 text-lg text-muted-foreground">Nothing in this collection yet.</p>
			) : (
				<ul className={tileGridClass}>
					{products.map((product, index) => (
						<li key={product.id}>
							<ProductCard product={product} priority={index < 2} />
						</li>
					))}
				</ul>
			)}
		</>
	);
}

function CollectionPageSkeleton() {
	// As tall as a screen: the footer must not paint in the viewport and then jump.
	return (
		<section className="band min-h-svh !pt-6">
			<Crumbs />
			<div className="mt-6 grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
				<div className="grid gap-6">
					<div className="h-6 w-24 animate-pulse rounded-full bg-secondary" />
					<div className="h-12 w-72 animate-pulse rounded bg-secondary" />
				</div>
				<div className="aspect-square animate-pulse rounded-frame bg-stage lg:aspect-[6/5]" />
			</div>
			<CollectionProductsSkeleton />
		</section>
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

	// Fetched here, inside the page's one boundary: a nested Suspense would stream the grid in
	// after the footer has painted and push it down.
	const products = await getCollectionProducts(collection);

	return (
		<section aria-label={collection.name} className="band !pt-6">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<Crumbs name={collection.name} />
			<CollectionHeader collection={collection} count={products.length} />
			<CollectionProducts products={products} />
		</section>
	);
};
