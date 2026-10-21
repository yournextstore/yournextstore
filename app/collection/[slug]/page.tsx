import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { CollectionHeader } from "@/components/listing/collection-header";
import { LISTING_GRID } from "@/components/listing/listing-body";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EDITORIAL, richText } from "@/lib/catalog";
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
		richText(collection.description) || `Shop the ${collection.name} collection at ${storeName}.`;
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
	const products = await getCollectionProducts(collection);

	if (products.length === 0) {
		return (
			<div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border p-6 text-center">
				<p className="text-xl font-semibold tracking-tight">Nothing in this collection yet</p>
				<Link href="/products" className="underline underline-offset-4">
					Browse all products
				</Link>
			</div>
		);
	}

	return (
		<div className={LISTING_GRID}>
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index === 0} actions />
			))}
		</div>
	);
}

function Crumbs({ name }: { name?: string }) {
	return (
		<Breadcrumb className="mb-6">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/">Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/products">Products</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>{name ?? "Collection"}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="mx-auto min-h-svh max-w-[1400px] p-6">
			<div className="mb-6 h-5 w-48 animate-pulse rounded bg-secondary" />
			<div className="overflow-hidden rounded-md border border-border">
				<div className="h-36 w-full animate-pulse bg-secondary" />
				<div className="p-6">
					<div className="h-9 w-64 animate-pulse rounded bg-secondary" />
					<div className="mt-2 h-7 w-full max-w-xl animate-pulse rounded bg-secondary" />
				</div>
			</div>
			<div className="mt-12">
				<ProductGridSkeleton className={LISTING_GRID} actions />
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

	const description = richText(collection.description);

	return (
		<div className="mx-auto min-h-svh max-w-[1400px] p-6">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<Crumbs name={collection.name} />
			<CollectionHeader
				heading={collection.name}
				image={collection.image ?? EDITORIAL.listing}
				paragraphs={[description || `Shop the ${collection.name} collection.`]}
			/>
			<div className="mt-12">
				<CollectionProducts collection={collection} />
			</div>
		</div>
	);
};
