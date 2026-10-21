import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingHeader, listingGridClassName } from "@/components/listing-header";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCollectionProducts, getCollectionTabs, richTextToPlain } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
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
		<div className="page-container pb-20">
			<div className="flex flex-col items-center pt-8 pb-8 lg:pt-10">
				<div className="h-16 w-72 animate-pulse rounded bg-muted lg:h-24" />
				<div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded bg-muted" />
			</div>
			<ProductGridSkeleton count={8} />
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

	const [products, collections] = await Promise.all([getCollectionProducts(collection), getCollectionTabs()]);
	const description = richTextToPlain(collection.description);

	return (
		<div className="page-container pb-20">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<ListingHeader
				title={collection.name}
				tabs={[
					{ href: "/products", label: "All" },
					...collections.map((tab) => ({
						href: `/collection/${tab.slug}`,
						label: tab.name,
						active: tab.slug === collection.slug,
					})),
				]}
			/>
			{description && description !== collection.name && (
				<p className="mx-auto -mt-2 mb-10 max-w-prose text-center text-base text-slate-700">{description}</p>
			)}
			{products.length === 0 ? (
				<p className="py-16 text-center font-display text-display-sm">This collection is empty for now.</p>
			) : (
				<div className={listingGridClassName}>
					{products.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>
			)}
		</div>
	);
};
