import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Crumbs } from "@/components/crumbs";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { rowCardClass } from "@/components/sections/home";
import { TiptapRenderer } from "@/components/tiptap-renderer";
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
	const { data } = await commerce.productBrowse({ active: true, limit: 5 });
	return data;
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	if (products.length === 0) {
		const fallback = await getFallbackProducts();
		return (
			<div>
				<p className="mb-10 text-muted-foreground">This shelf is being restocked. Check back soon.</p>
				{fallback.length > 0 ? (
					<section>
						<h2 className="font-serif text-2xl font-medium">Meanwhile, on Our Shelves</h2>
						<div className="shelf-grid my-4">
							{fallback.map((product, index) => (
								<ProductCard
									key={product.id}
									product={product}
									className={rowCardClass(index, fallback.length)}
								/>
							))}
						</div>
					</section>
				) : null}
			</div>
		);
	}

	return (
		<>
			<p className="mb-4 text-sm text-muted-foreground">
				{products.length} {products.length === 1 ? "item" : "items"} in this collection
			</p>
			<div className="shelf-grid">
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 2} />
				))}
			</div>
		</>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="shelf-container min-h-svh py-6">
			<div className="mb-2 h-6 w-48 animate-pulse rounded bg-muted" />
			<div className="mb-6 h-8 w-56 animate-pulse rounded bg-muted" />
			<div className="mb-4 h-5" />
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

	return (
		<div className="shelf-container min-h-svh py-6">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<Crumbs
				items={[
					{ label: "Home", href: "/" },
					{ label: "Products", href: "/products" },
					{ label: collection.name },
				]}
			/>
			<h1 className="font-serif text-2xl font-semibold">{collection.name}</h1>
			{/* The API sends rich text (TipTap); older payloads sent a plain string. */}
			{typeof collection.description === "string" ? (
				<p className="mt-2 max-w-2xl leading-relaxed">{collection.description}</p>
			) : collection.description ? (
				<div className="prose mt-2 max-w-2xl leading-relaxed text-foreground tiptap-content">
					<TiptapRenderer content={collection.description} />
				</div>
			) : null}
			<div className="mt-6">
				<CollectionProducts collection={collection} />
			</div>
		</div>
	);
};
