import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

function CollectionHeader({
	collection,
	image,
	count,
}: {
	collection: APICollectionGetByIdResult;
	image: string | null;
	count: number | null;
}) {
	return (
		<section className="flex flex-col-reverse gap-6 pb-12 lg:flex-row lg:items-center lg:gap-16 lg:pb-20">
			<div className="flex flex-1 flex-col gap-3 lg:gap-6">
				<h1 className="font-serif text-heading-4xl font-bold wrap-break-word lg:text-heading-5xl">
					{collection.name}
				</h1>
				{/* The API sends rich text (TipTap); older payloads sent a plain string. */}
				{typeof collection.description === "string" ? (
					<p className="font-sans text-body-md text-muted-foreground lg:text-body-lg">
						{collection.description}
					</p>
				) : collection.description ? (
					<div className="prose max-w-none font-sans text-body-md text-muted-foreground lg:text-body-lg tiptap-content">
						<TiptapRenderer content={collection.description} />
					</div>
				) : (
					<p className="font-sans text-body-md text-muted-foreground lg:text-body-lg">
						A little selection from our shop, gathered on one shelf.
					</p>
				)}
				{count !== null ? (
					<p className="font-serif text-heading-xl text-brand">
						{count} {count === 1 ? "item" : "items"}
					</p>
				) : null}
			</div>
			<div className="blob-shadow relative aspect-video w-full overflow-hidden rounded-md lg:aspect-square lg:max-w-md lg:overflow-visible xl:max-w-lg">
				{image ? (
					<div className="blob-mask absolute inset-0">
						<YNSMedia
							src={image}
							alt=""
							fill
							priority
							fetchPriority="high"
							sizes="(max-width: 1024px) 100vw, 512px"
							className="object-cover"
						/>
					</div>
				) : null}
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

async function CollectionProducts({
	products,
}: {
	products: Awaited<ReturnType<typeof getCollectionProducts>>;
}) {
	if (products.length === 0) {
		return (
			<p className="py-16 text-center font-sans text-body-lg text-muted-foreground">
				This shelf is empty for now.{" "}
				<Link href="/products" className="text-brand underline">
					See the whole shop
				</Link>
				.
			</p>
		);
	}
	return (
		<ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product, index) => (
				<li key={product.id}>
					<ProductCard product={product} priority={index === 0} headingLevel="h2" />
				</li>
			))}
		</ul>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="bake-container min-h-svh pt-4 pb-16 lg:pt-0 lg:pb-24">
			<div className="mb-8 h-5 w-48 animate-pulse rounded bg-surface" />
			<div className="flex flex-col-reverse gap-6 pb-12 lg:flex-row lg:items-center lg:gap-16 lg:pb-20">
				<div className="flex flex-1 flex-col gap-4">
					<div className="h-12 w-3/4 animate-pulse rounded bg-surface" />
					<div className="h-16 w-full animate-pulse rounded bg-surface" />
				</div>
				<div className="aspect-video w-full animate-pulse rounded-md bg-surface lg:aspect-square lg:max-w-md xl:max-w-lg" />
			</div>
			<ProductGridSkeleton />
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
	const image = collection.image ?? products.flatMap((product) => product.images ?? [])[0] ?? null;

	return (
		<div className="bake-container min-h-svh pt-4 pb-16 lg:pt-0 lg:pb-24">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<Breadcrumb className="mb-8">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link href="/products" />}>Shop</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{collection.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<CollectionHeader collection={collection} image={image} count={products.length} />
			<CollectionProducts products={products} />
		</div>
	);
};
