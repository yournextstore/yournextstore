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

// The SDK throws on a 404 despite its `| null` type. Without the null, the `!collection`
// branches never run and an unknown slug answers 200 with the error page.
const getCollectionData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		return { title: "Collection Not Found — Vela", robots: { index: false, follow: true } };
	}

	const { storeName } = await getStoreSeo();
	const description =
		typeof collection.description === "string"
			? collection.description
			: `Shop the ${collection.name} collection at ${storeName}.`;
	const canonical = `/collection/${collection.slug}`;

	return {
		title: `${collection.name} — Vela`,
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
		<section className="pt-4 sm:pt-6">
			<div className="page-shell">
				<div
					className={`grid overflow-hidden border border-border/80 bg-[var(--surface-soft)] ${
						collection.image ? "lg:grid-cols-[0.78fr_1.22fr]" : ""
					}`}
				>
					<div className="flex items-end p-6 sm:p-8 lg:p-10">
						<div className="max-w-xl space-y-4">
							<p className="editorial-kicker">Collection</p>
							<h1 className="editorial-title text-foreground">{collection.name}</h1>
							{/* The API sends rich text (TipTap); older payloads sent a plain string. */}
							{typeof collection.description === "string" ? (
								<p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
									{collection.description}
								</p>
							) : collection.description ? (
								<div className="prose tiptap-content max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
									<TiptapRenderer content={collection.description} />
								</div>
							) : (
								<p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
									A quieter edit of considered pieces, selected to work together without asking for too much
									attention.
								</p>
							)}
						</div>
					</div>
					{collection.image ? (
						<div className="relative min-h-[18rem] lg:min-h-[26rem]">
							<YNSMedia
								src={collection.image}
								alt={collection.name}
								fill
								sizes="(max-width: 1024px) 100vw, 58vw"
								className="object-cover"
								priority
								fetchPriority="high"
							/>
							<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,241,234,0.14)_0%,rgba(21,17,15,0.14)_100%)]" />
						</div>
					) : null}
				</div>
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

	return (
		<ProductGrid
			title={`Inside ${collection.name}`}
			description={`${products.length} pieces selected for this edit.`}
			products={products}
			showViewAll={false}
		/>
	);
}

// Every known address prerenders in full; one added later renders on its first visit (lib/catalog-paths.ts).
export const generateStaticParams = () => slugParams(getAllCollections(), (collection) => collection.slug);

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
			<div className="page-shell pt-6">
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
