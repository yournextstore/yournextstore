import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProducts } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { plainText } from "@/lib/display";
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

/** The collection as one of the home page's pastel banners: serif title, one line, its picture. */
function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	const description = plainText(collection.description);
	return (
		<section className="mb-10 grid overflow-hidden rounded-lg bg-pastel-3 sm:grid-cols-12 lg:mb-14 lg:h-[320px]">
			<div className="flex items-center px-6 py-10 sm:col-span-7 sm:px-10 lg:pl-20">
				<div className="min-w-0">
					<h1 className="mb-3 font-display text-[2.5rem] leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
						{collection.name}
					</h1>
					{description && <p className="max-w-md text-primary">{description}</p>}
				</div>
			</div>
			{collection.image && (
				<div className="packshot relative h-56 sm:col-span-5 sm:h-auto sm:min-h-64">
					<YNSMedia
						src={collection.image}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, 40vw"
						className="object-contain object-right"
						priority
					/>
				</div>
			)}
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

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	if (products.length === 0) {
		// A collection the merchant has not filled yet still leads somewhere.
		const suggestions = await getProducts(4);
		return (
			<div className="min-h-[50svh]">
				<p className="mb-12 text-muted-foreground">Nothing in this collection just yet.</p>
				{suggestions.length > 0 && (
					<section aria-labelledby="collection-suggestions" className="flex flex-col gap-6">
						<h2 id="collection-suggestions" className="text-2xl font-medium">
							Meanwhile, in the shop
						</h2>
						<div className={PRODUCT_GRID}>
							{suggestions.map((product) => (
								<ProductCard key={product.id} product={product} headingLevel="h3" />
							))}
						</div>
					</section>
				)}
			</div>
		);
	}

	return (
		<div className="min-h-[50svh]">
			<h2 className="mb-4 text-xl font-semibold">Products ({products.length})</h2>
			<div className={PRODUCT_GRID}>
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} headingLevel="h3" priority={index < 2} />
				))}
			</div>
		</div>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="layout min-h-svh pt-6 pb-24">
			<div className="mb-6 h-5 w-48 animate-pulse rounded bg-secondary" />
			<div className="mb-10 h-[19rem] animate-pulse rounded-lg bg-secondary sm:h-64 lg:mb-14 lg:h-[320px]" />
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
		<div className="layout min-h-svh pt-6 pb-24">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
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
						<BreadcrumbPage>{collection.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<CollectionHeader collection={collection} />
			<CollectionProducts collection={collection} />
		</div>
	);
};
