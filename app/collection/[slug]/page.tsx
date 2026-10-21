import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { FloatPhoto, SectionHead } from "@/components/sections/home";
import { firstStill, richTextToPlain, sentenceCase } from "@/lib/catalog";
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
		richTextToPlain(collection.description) || `Shop the ${collection.name} collection at ${storeName}.`;
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

/** The collection as one of the original's text-and-can panels: copy on the left, its photo floating on the right. */
function CollectionHeader({
	collection,
	image,
	count,
}: {
	collection: APICollectionGetByIdResult;
	image: string | null;
	count: number;
}) {
	const description = richTextToPlain(collection.description);
	return (
		<section className="bg-lilac">
			<div className="shell grid items-center gap-8 py-[clamp(40px,7vh,80px)] md:min-h-[460px] md:grid-cols-2">
				<div className="min-w-0">
					<SectionHead
						as="h1"
						eyebrow={`Collection · ${count} ${count === 1 ? "find" : "finds"}`}
						title={sentenceCase(collection.name)}
						lede={description || "A handful of favourites that go well together. Take one, or take the lot."}
					/>
				</div>
				{image && (
					<FloatPhoto
						src={image}
						tilt={8}
						priority
						sizes="(max-width: 768px) 80vw, 420px"
						className="mx-auto w-full max-w-[420px]"
					/>
				)}
			</div>
		</section>
	);
}

function CollectionProductsSkeleton() {
	return <ProductGridSkeleton />;
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
		<div className="min-h-svh pb-[100px]">
			<div className="h-[760px] bg-lilac md:h-[460px]" />
			<div className="shell mt-16">
				<CollectionProductsSkeleton />
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

	const products = await getCollectionProducts(collection);
	const image = collection.image ?? firstStill(products[0]?.images);

	return (
		<div className="min-h-svh pb-[100px]">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} image={image} count={products.length} />
			<div className="shell">
				{products.length > 0 ? (
					<>
						<div className="mb-10 mt-16 flex flex-wrap items-end justify-between gap-6">
							<h2 className="display text-section text-ink">In this collection</h2>
							<Link href="/products" className="btn btn-ghost btn-sm shrink-0">
								Shop all
							</Link>
						</div>
						<div className={LISTING_GRID}>
							{products.map((product) => (
								<ProductCard key={product.id} product={product} className=" " />
							))}
						</div>
					</>
				) : (
					<div className="py-24 text-center">
						<p className="display text-section text-flame">Nothing here yet</p>
						<Link href="/products" className="btn mt-6">
							Shop all
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};
