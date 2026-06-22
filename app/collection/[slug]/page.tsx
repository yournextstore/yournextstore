import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductGrid } from "@/components/sections/product-grid";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { getAllCollections, slugParams } from "@/lib/catalog-paths";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";

const COLLECTION_PRODUCTS_LIMIT = 100;

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

function CollectionHeader({ collection, count }: { collection: APICollectionGetByIdResult; count: number }) {
	return (
		<section className="bg-background border-b border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<nav
					aria-label="Breadcrumb"
					className="pt-8 sm:pt-10 flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground"
				>
					<Link href="/" className="hover:text-foreground transition-colors">
						Home
					</Link>
					<span aria-hidden>—</span>
					<Link href="/products" className="hover:text-foreground transition-colors">
						Collections
					</Link>
					<span aria-hidden>—</span>
					<span className="text-foreground">{collection.name}</span>
				</nav>

				<div className="pt-6 sm:pt-8 pb-10 flex items-end gap-3 sm:gap-4">
					<h1 className="font-display text-5xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-[-0.01em] text-foreground uppercase">
						{collection.name}
					</h1>
					<span className="font-display text-base sm:text-lg text-muted-foreground mb-3 sm:mb-5">
						<sup>{count}</sup>
					</span>
				</div>

				{/* The API sends rich text (TipTap); older payloads sent a plain string. */}
				{typeof collection.description === "string" ? (
					<p className="pb-10 max-w-xl text-sm leading-relaxed text-muted-foreground">
						{collection.description}
					</p>
				) : collection.description ? (
					<div className="prose pb-10 max-w-xl text-sm leading-relaxed text-muted-foreground tiptap-content">
						<TiptapRenderer content={collection.description} />
					</div>
				) : null}
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

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	return <ProductGrid title={collection.name} products={products} showViewAll={false} />;
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

	const count = collection.productCollections.length;

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} count={count} />
			<CollectionProducts collection={collection} />
		</>
	);
}
