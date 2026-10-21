import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
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

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	const text = richTextToPlain(collection.description);
	return (
		<section className="relative overflow-hidden bg-[hsl(160_27%_14%)]">
			{collection.image && (
				<YNSMedia
					src={collection.image}
					alt=""
					fill
					sizes="100vw"
					className="object-cover"
					priority
					fetchPriority="high"
				/>
			)}
			<div className="absolute inset-0 bg-linear-to-r from-[hsl(160_27%_8%/0.8)] via-[hsl(160_27%_8%/0.5)] to-[hsl(160_27%_8%/0.2)]" />
			<div className="wrapper relative py-16 sm:py-20 lg:py-24">
				<p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">Collection</p>
				<h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-hero-ink sm:text-5xl">
					{collection.name}
				</h1>
				{text && <p className="mt-4 max-w-lg text-lg font-light text-hero-ink/85">{text}</p>}
			</div>
		</section>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="wrapper min-h-svh py-12">
			<div className="mb-5 flex min-h-8 items-center">
				<div className="h-4 w-24 animate-pulse rounded bg-secondary" />
			</div>
			<ProductGridSkeleton count={8} className="lg:grid-cols-4 xl:grid-cols-4" />
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

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	return (
		<section className="wrapper min-h-svh py-12">
			<p className="mb-5 flex min-h-8 items-center text-sm text-muted-foreground">
				{products.length} {products.length === 1 ? "product" : "products"}
			</p>
			{products.length === 0 ? (
				<p className="py-16 text-center text-muted-foreground">
					Nothing here yet.{" "}
					<Link href="/products" className="text-gold-ink underline underline-offset-4">
						Browse all products
					</Link>
				</p>
			) : (
				<>
					<h2 className="sr-only">Products</h2>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</>
			)}
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<>
			<div className="wrapper py-4">
				<div className="h-5 w-40 animate-pulse rounded bg-secondary" />
			</div>
			<section className="bg-[hsl(160_27%_14%)]">
				<div className="wrapper py-16 sm:py-20 lg:py-24">
					<div className="h-4 w-24 rounded bg-hero-ink/20" />
					<div className="mt-4 h-12 w-72 rounded bg-hero-ink/20" />
				</div>
			</section>
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

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<div className="wrapper py-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{collection.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<CollectionHeader collection={collection} />
			<CollectionProducts collection={collection} />
		</>
	);
};
