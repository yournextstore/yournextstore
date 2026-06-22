import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductCard } from "@/components/product-card";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllCollections, slugParams } from "@/lib/catalog-paths";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

const COLLECTION_PRODUCTS_LIMIT = 100;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		return { title: "Collection Not Found — Your Next Store" };
	}

	const { storeName } = await getStoreSeo();
	const description =
		typeof collection.description === "string"
			? collection.description
			: `Shop the ${collection.name} collection at ${storeName}.`;

	return {
		title: `${collection.name} — Your Next Store`,
		description,
		openGraph: {
			title: collection.name,
			description,
			images: collection.image ? [collection.image] : undefined,
		},
	};
}

function CollectionHeader({ collection, count }: { collection: APICollectionGetByIdResult; count: number }) {
	return (
		<section className="bg-[var(--color-primary-container)] border-b border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
				<div>
					<span className="label-caps text-[var(--color-on-primary-container)]">Collection</span>
					<h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] leading-[1.05] mt-3 text-[var(--color-on-primary-container)]">
						{collection.name}
					</h1>
					{collection.description && (
						<div className="mt-6 text-base md:text-lg leading-relaxed text-[var(--color-on-surface-variant)] prose max-w-xl">
							{typeof collection.description === "string" ? (
								<p>{collection.description}</p>
							) : (
								<TiptapRenderer content={collection.description} />
							)}
						</div>
					)}
					<div className="mt-6 inline-block label-caps neo-border px-3 py-2 bg-[var(--color-surface-container-lowest)]">
						{count} {count === 1 ? "product" : "products"}
					</div>
				</div>
				{collection.image && (
					<div className="relative w-full aspect-[4/3] neo-border bg-[var(--color-surface-container-lowest)] hover:neo-shadow transition-shadow">
						<YNSMedia
							src={collection.image}
							alt={collection.name}
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							priority
							fetchPriority="high"
						/>
					</div>
				)}
			</div>
		</section>
	);
}

// The platform resolves the collection: a hand-picked one from its members, an automatic one from its rule, both in
// the sort order the merchant set on it. The page has no pagination, so it renders one page; 100 is the API's max.
async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.request<APIProductsBrowseResult>(
		`/collections/${encodeURIComponent(collection.slug)}/products`,
		{ query: { limit: COLLECTION_PRODUCTS_LIMIT } },
	);
	return data;
}

function CollectionProducts({ products }: { products: APIProductsBrowseResult["data"] }) {
	if (products.length === 0) {
		return (
			<div className="neo-border bg-[var(--color-surface-container-lowest)] py-24 text-center">
				<p className="font-serif text-2xl mb-2">Empty collection</p>
				<p className="text-[var(--color-on-surface-variant)]">No products are assigned here yet.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}

// Every known address prerenders in full; one added later renders on its first visit (lib/catalog-paths.ts).
export const generateStaticParams = () => slugParams(getAllCollections(), (collection) => collection.slug);

// The SDK throws on a 404 despite its `| null` type. Without the null, the `!collection`
// branches never run and an unknown slug answers 200 with the error page.
const getCollectionData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
};

// An address added after the build renders in full on its first request before anything is sent, so a missing one
// answers 404 with the not-found page inside the layout, not a 200 behind an already-sent shell (AGENTS.md).
export const ensureStatic = "navigation";

// Listed addresses prerender in full: the boundary resolves at build time, so no fallback ever shows.
export default function CollectionPage(props: Parameters<typeof CollectionPageContent>[0]) {
	return (
		<Suspense fallback={null}>
			<CollectionPageContent {...props} />
		</Suspense>
	);
}

async function CollectionPageContent({ params }: { params: PageProps<"/collection/[slug]">["params"] }) {
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		notFound();
	}

	const products = await getCollectionProducts(collection);

	return (
		<main>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
			<CollectionHeader collection={collection} count={products.length} />
			<section className="px-5 md:px-20 py-12 md:py-16 border-b border-foreground">
				<div className="max-w-[1280px] mx-auto">
					<CollectionProducts products={products} />
				</div>
			</section>
		</main>
	);
}
