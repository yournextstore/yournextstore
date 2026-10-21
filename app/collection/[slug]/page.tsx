import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Crumbs } from "@/components/grilli/crumbs";
import { PageBanner } from "@/components/grilli/page-banner";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCollectionProducts, richTextToPlain } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { BANNER_IMAGE } from "@/lib/editorial";
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

function CollectionProductsSkeleton() {
	return (
		<section className="container-g min-h-svh py-[70px] lg:py-[100px]">
			<div className="mb-10 h-[22px]" />
			<ProductGridSkeleton />
		</section>
	);
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	return (
		<section aria-labelledby="collection-products" className="container-g py-[70px] lg:py-[100px]">
			<h2
				id="collection-products"
				className="mb-10 text-center text-label-2 font-bold tracking-3 text-silver uppercase"
			>
				{products.length} {products.length === 1 ? "product" : "products"}
			</h2>
			{products.length === 0 ? (
				<p className="py-16 text-center text-body-4 text-silver">This collection is empty for now.</p>
			) : (
				<div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
					{products.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>
			)}
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<>
			<PageBanner kicker="Collection" title={" "} />
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

	// The product grid renders in this same boundary (its data is cached): a nested Suspense
	// would stream it in after the footer has painted and push the footer down.
	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<PageBanner
				kicker="Collection"
				title={collection.name}
				text={richTextToPlain(collection.description) || null}
				image={BANNER_IMAGE}
			>
				<Crumbs
					trail={[
						{ href: "/", label: "Home" },
						{ href: "/products", label: "Shop" },
					]}
					current={collection.name}
				/>
			</PageBanner>
			<CollectionProducts collection={collection} />
		</>
	);
};
