import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingBanner, ListingBannerSkeleton } from "@/components/listing-banner";
import { ProductCard } from "@/components/product-card";
import { CARD_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCollectionData, getCollectionProducts } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { bannerFor } from "@/lib/editorial";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";

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

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh">
			<ListingBannerSkeleton />
			<div className="py-3">
				<div className="h-8 w-48 animate-pulse rounded bg-secondary" />
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

async function CollectionBody({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	return (
		<>
			<ListingBanner image={collection.image ?? bannerFor(collection.slug)} />
			<section className="flex flex-col justify-between gap-1 py-3 md:flex-row md:items-baseline">
				<h1 className="text-2xl font-bold">{collection.name}</h1>
				<p className="text-sm text-muted-foreground">
					{products.length} {products.length === 1 ? "product" : "products"}
				</p>
			</section>
			{products.length > 0 ? (
				<div className={CARD_GRID}>
					{products.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>
			) : (
				<p className="w-full py-32 text-center text-4xl font-bold tracking-wide text-muted-foreground uppercase">
					Nothing to show!
				</p>
			)}
		</>
	);
}

const CollectionContent = async ({ params }: { params: PageProps<"/collection/[slug]">["params"] }) => {
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		notFound();
	}

	return (
		<div className="min-h-svh">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionBody collection={collection} />
		</div>
	);
};
