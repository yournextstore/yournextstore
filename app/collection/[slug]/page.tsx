import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Crumbs } from "@/components/crumbs";
import { EmptyListing, ListingGrid, ListingSkeleton, ListingToolbar } from "@/components/listing";
import { ProductCard } from "@/components/product-card";
import { getCatalogProducts, picturedFirst, richTextToPlain } from "@/lib/catalog";
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

/** The home page's promo banner, page-sized: title and copy on the left, the photograph fading in on the right. */
function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	const description = richTextToPlain(collection.description);
	return (
		<div className="relative mb-6 flex flex-col-reverse overflow-hidden rounded-lg bg-[#f3efeb] sm:block">
			{collection.image ? (
				<div className="relative aspect-[3/2] w-full [mask-image:linear-gradient(to_bottom,transparent,black_30%)] sm:absolute sm:inset-y-0 sm:right-0 sm:aspect-auto sm:w-1/2 sm:[mask-image:linear-gradient(to_right,transparent,black_40%)]">
					<YNSMedia
						src={collection.image}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, 660px"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				</div>
			) : null}
			<div className="relative max-w-xl px-6 pt-8 pb-2 sm:px-8 sm:py-14 md:w-3/5">
				<span className="mb-4 inline-block rounded-lg bg-sun p-2 text-fc-sm leading-none font-semibold text-gray-900">
					Collection
				</span>
				<h1 className="text-fc-xl font-bold break-words sm:text-fc-3xl">{collection.name}</h1>
				{description ? (
					<p className="mt-3 max-w-md text-fc-md font-light text-gray-700">{description}</p>
				) : null}
			</div>
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
		const { products: fallback } = await getCatalogProducts();
		return (
			<>
				<EmptyListing text="This collection is empty for now." />
				{fallback.length > 0 ? (
					<section className="mt-10">
						<h2 className="mb-6 text-fc-lg">Meanwhile, in the shop</h2>
						<div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
							{fallback.slice(0, 4).map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</section>
				) : null}
			</>
		);
	}

	return (
		<>
			<ListingToolbar count={products.length} />
			<ListingGrid className="lg:grid-cols-4 xl:grid-cols-5">
				{picturedFirst<(typeof products)[number]>(products).map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</ListingGrid>
		</>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="fc-container min-h-svh">
			<div className="mt-4 h-[21px] w-48 animate-pulse rounded bg-gray-100" />
			<div className="mt-8 mb-14">
				<div className="mb-6 h-[420px] animate-pulse rounded-lg bg-gray-100 sm:h-[246px]" />
				<ListingSkeleton count={5} className="lg:grid-cols-4 xl:grid-cols-5" />
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

	return (
		<div className="fc-container min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<Crumbs
				items={[
					{ href: "/", label: "Home" },
					{ href: "/products", label: "Shop" },
					{ label: collection.name },
				]}
			/>
			<div className="mt-8 mb-14">
				<CollectionHeader collection={collection} />
				{/* No boundary of its own: the products are cached and land with the header (no shift). */}
				<CollectionProducts collection={collection} />
			</div>
		</div>
	);
};
