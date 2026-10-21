import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { CountLabel, FeatureRow, SideNav, shopEntries } from "@/components/listing";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getShelf, plainText } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
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
		plainText(collection.description) || `Shop the ${collection.name} collection at ${storeName}.`;
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

// Fallback shelf for an empty collection, so the page never ends in a bare heading.
async function getShopPicks() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 3 }).catch(() => ({ data: [] }));
	return data;
}

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh px-6 pb-20 pt-6 lg:px-8">
			<div className="h-5 w-48 animate-pulse rounded bg-sand" />
			<div className="-mx-6 mt-4 flex gap-6 overflow-hidden px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
				{[0, 1, 2].map((i) => (
					<div key={i} className="w-[54vw] max-w-[17rem] shrink-0 lg:w-auto lg:max-w-none">
						<div className="aspect-[1104/1230] animate-pulse rounded-image bg-sand" />
						<div className="mt-3 h-6 w-40 animate-pulse rounded bg-sand lg:mt-4" />
					</div>
				))}
			</div>
			<div className="mt-6 border-t border-rule pt-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
				<div className="hidden lg:block" />
				<div>
					<div className="mb-6 flex min-h-9 items-center">
						<span className="h-4 w-28 animate-pulse rounded bg-sand" />
					</div>
					<ProductGridSkeleton />
				</div>
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

	const [products, facets, shelf] = await Promise.all([
		getCollectionProducts(collection),
		getFilterFacets(),
		getShelf(),
	]);
	const href = `/collection/${collection.slug}`;
	const entries = shopEntries(facets);
	const navEntries = entries.some((entry) => entry.href === href)
		? entries
		: [...entries, { href, label: collection.name }];
	const description = plainText(collection.description);
	const picks = products.length === 0 ? await getShopPicks() : [];

	return (
		<div className="min-h-svh px-6 pb-20 pt-6 lg:px-8">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<nav aria-label="Breadcrumb" className="text-copy font-semibold text-ink">
				<Link href="/products" className="transition-opacity hover:opacity-70">
					Collections
				</Link>
				<span aria-hidden className="mx-1">
					/
				</span>
				<h1 className="inline">{collection.name}</h1>
			</nav>
			{description && <p className="mt-1 max-w-[40rem] text-copy text-plum">{description}</p>}
			<FeatureRow cards={shelf} activeHref={href} />

			<div className="mt-6 border-t border-rule pt-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
				<aside>
					<SideNav entries={navEntries} active={href} />
				</aside>
				<div className="min-w-0">
					<div className="mb-6 flex min-h-9 items-center">
						<CountLabel label={collection.name} count={products.length} />
					</div>
					{products.length > 0 ? (
						<div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
							{products.map((product, index) => (
								<ProductCard key={product.id} product={product} priority={index === 0} />
							))}
						</div>
					) : (
						<div>
							<div className="rounded-image bg-sand px-6 py-10 text-center">
								<p className="text-label font-semibold text-ink">Nothing here yet.</p>
								<p className="mt-2 text-copy text-plum">
									This collection is still being put together. Meanwhile, in the shop:
								</p>
							</div>
							{picks.length > 0 && (
								<div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
									{picks.map((product) => (
										<ProductCard key={product.id} product={product} />
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
