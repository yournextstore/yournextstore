import type { APICollectionGetByIdResult } from "commerce-kit";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingBanner, ListingBannerSkeleton } from "@/components/listing-banner";
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
import { plainText } from "@/lib/display";
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

function CollectionProductsSkeleton() {
	return (
		<div className="mx-auto mt-12 mb-40 max-w-7xl">
			<div className="h-8 w-48 animate-pulse rounded bg-slate-100" />
			<ProductGridSkeleton className="mt-5" />
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

async function getFallbackProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 4 }).catch(() => ({ data: [] }));
	return data;
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);
	const fallback = products.length === 0 ? await getFallbackProducts() : [];

	return (
		<div className="mx-auto mt-12 mb-40 max-w-7xl">
			{products.length > 0 ? (
				<>
					<h2 className="text-2xl text-slate-500">
						Shop <span className="font-medium text-slate-800">Products</span>
					</h2>
					<div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-12">
						{products.map((product, index) => (
							<ProductCard key={product.id} product={product} priority={index === 0} />
						))}
					</div>
				</>
			) : (
				<>
					<div className="rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center">
						<p className="text-xl font-semibold text-slate-500">This collection is being restocked</p>
						<Link
							href="/products"
							className="mt-3 inline-flex items-center gap-1 text-sm text-go-green-ink hover:gap-2"
						>
							Browse all products <ArrowRight className="size-3.5" aria-hidden />
						</Link>
					</div>
					{fallback.length > 0 && (
						<>
							<h2 className="mt-16 text-2xl text-slate-500">
								Meanwhile, <span className="font-medium text-slate-800">in the shop</span>
							</h2>
							<div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-12">
								{fallback.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh px-6">
			<div className="mx-auto mt-8 max-w-7xl">
				<div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
			</div>
			<ListingBannerSkeleton />
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

	const description = plainText(collection.description);

	return (
		<div className="min-h-svh px-6">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<div className="mx-auto mt-8 max-w-7xl">
				<Breadcrumb>
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
			</div>
			<ListingBanner name={collection.name} description={description || null} image={collection.image} />
			<CollectionProducts collection={collection} />
		</div>
	);
};
