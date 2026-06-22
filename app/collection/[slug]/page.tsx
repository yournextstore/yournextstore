import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductGrid } from "@/components/sections/product-grid";
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

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#2d5016]/90 via-[#3a6b1e]/80 to-[#4a7c28]/70">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-10 sm:py-14 lg:py-18 relative z-10">
					<div className="max-w-2xl">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
							{collection.name}
						</h1>
						{/* The API sends rich text (TipTap); older payloads sent a plain string. */}
						{typeof collection.description === "string" ? (
							<p className="mt-3 text-base text-white/80 leading-relaxed">{collection.description}</p>
						) : collection.description ? (
							// prose-invert: the header sits on the dark green gradient, so the rich text takes light colours.
							<div className="prose prose-invert mt-3 max-w-none text-base leading-relaxed tiptap-content">
								<TiptapRenderer content={collection.description} />
							</div>
						) : null}
					</div>
				</div>
			</div>
			{collection.image && (
				<div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
					<YNSMedia
						src={collection.image}
						alt={collection.name}
						fill
						sizes="50vw"
						className="object-cover opacity-20"
						priority
						fetchPriority="high"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-[#2d5016] to-transparent" />
				</div>
			)}
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

	return (
		<ProductGrid
			title={`${collection.name} Collection`}
			description={`${products.length} products`}
			products={products}
			showViewAll={false}
		/>
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

	return (
		<>
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
			<CollectionHeader collection={collection} />
			<CollectionProducts collection={collection} />
		</>
	);
}
