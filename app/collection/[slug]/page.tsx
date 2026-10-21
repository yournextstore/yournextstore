import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { richTextToPlain } from "@/lib/display";
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

/** The original's single-hero variant: a picture on the pale wall, the name and an underlined link. */
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
		<section className="relative mx-auto flex h-[26rem] w-full max-w-[1600px] overflow-hidden bg-stage md:h-[32rem]">
			{image && (
				<div className="absolute inset-x-0 bottom-0 h-[55%] [mask-image:linear-gradient(to_bottom,transparent,#000_32%)] md:inset-y-0 md:left-auto md:h-full md:w-[64%] md:[mask-image:linear-gradient(to_right,transparent,#000_30%)]">
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 64vw"
						className="object-cover"
						priority
					/>
				</div>
			)}
			<div className="relative container mx-auto flex pt-10 md:items-center md:pt-0">
				<div className="flex w-full flex-col items-start px-6 tracking-wide md:ml-16 lg:w-1/2">
					<h1 className="my-4 text-2xl text-black">{collection.name}</h1>
					{description && description.toLowerCase() !== collection.name.toLowerCase() && (
						<p className="mb-4 max-w-md text-gray-600 line-clamp-3">{description}</p>
					)}
					<a href="#products" className="nordic-link text-xl text-gray-600">
						{count === 1 ? "1 product" : `${count} products`}
					</a>
				</div>
			</div>
		</section>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="bg-background py-8">
			<div className="container mx-auto min-h-svh pt-4 pb-12">
				<div className="h-[3.75rem]" />
				<ProductGridSkeleton className="px-6 pt-6" />
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

function CollectionPageSkeleton() {
	return (
		<>
			<section className="mx-auto h-[26rem] w-full max-w-[1600px] bg-stage md:h-[32rem]" />
			<CollectionProductsSkeleton />
		</>
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
	const image = collection.image ?? products.flatMap((product) => product.images ?? [])[0] ?? null;

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} image={image} count={products.length} />
			<div className="min-h-svh">
				<ProductGrid title="In this collection" products={products} />
			</div>
		</>
	);
};
