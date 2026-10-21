import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCollectionData, getCollectionProducts, pieces, richTextToPlain } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

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

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	const description = richTextToPlain(collection.description);
	return (
		<>
			<div className="grid-site gap-y-3 px-3 pt-16 lg:pt-20">
				<h1 className="col-span-2 text-heading lg:col-span-12">{collection.name}</h1>
				{description && (
					<p className="col-span-2 text-copy font-normal lg:col-span-4 lg:col-start-4">{description}</p>
				)}
			</div>
			{collection.image && (
				<div className="relative mx-1 mt-3 aspect-[4/3] overflow-hidden rounded-sm bg-paper lg:aspect-[21/8]">
					<YNSMedia
						src={collection.image}
						alt=""
						fill
						sizes="100vw"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				</div>
			)}
		</>
	);
}

function CollectionProductsSkeleton() {
	return (
		<section className="card mx-1 mt-1 bg-paper">
			<div className="h-6" />
			<ProductGridSkeleton count={4} className="mt-12 lg:mt-16 lg:grid-cols-4" />
		</section>
	);
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	return (
		<section className="card mx-1 mt-1 bg-paper" aria-labelledby="collection-count">
			<p id="collection-count" className="flex h-6 items-center lg:grid-site">
				<span className="lg:col-span-3 lg:col-start-4">{pieces(products.length)}</span>
			</p>
			{products.length === 0 ? (
				<p className="py-24 text-center">Nothing in this collection yet.</p>
			) : (
				<ul className={cn(PRODUCT_GRID, "mt-12 lg:mt-16 lg:grid-cols-4")}>
					{products.map((product, index) => (
						<li key={product.id}>
							<ProductCard product={product} priority={index === 0} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<div data-flush className="min-h-svh">
			<div className="px-3 pt-16 lg:pt-20">
				<div className="h-[29px] w-48 animate-pulse rounded-sm bg-black/5" />
			</div>
			<div className="mt-3">
				<CollectionProductsSkeleton />
			</div>
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

const CollectionContent = async ({ params }: { params: PageProps<"/collection/[slug]">["params"] }) => {
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		notFound();
	}

	return (
		<div data-flush>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} />
			<div className="mt-3">
				<Suspense fallback={<CollectionProductsSkeleton />}>
					<CollectionProducts collection={collection} />
				</Suspense>
			</div>
		</div>
	);
};
