import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DISPLAY_GRID, DisplayCard } from "@/components/product-card";
import { BANNER_TITLE, Banner } from "@/components/sections/hero";
import { ProductGridSkeletonSection } from "@/components/sections/product-grid";
import { BANNER_IMAGES, getCollectionData, getCollectionProducts } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { richToText } from "@/lib/display";
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
		richToText(collection.description) || `Shop the ${collection.name} collection at ${storeName}.`;
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

const PAGE = "min-h-svh px-4 pt-4 pb-12 md:px-8 lg:px-[100px] lg:pt-5 lg:pb-[100px]";

function CollectionPageSkeleton() {
	return (
		<div className={PAGE}>
			<div className="h-[260px] bg-[#ebe8e3] md:h-[400px]" />
			<ProductGridSkeletonSection />
		</div>
	);
}

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

	const products = await getCollectionProducts(collection);
	const description = richToText(collection.description);
	const image = collection.image ? { src: collection.image, alt: collection.name } : BANNER_IMAGES.listing;

	// The original's Featured / Recommended pages: a banner with the title, then the showcase grid.
	return (
		<div className={PAGE}>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<Banner image={image}>
				<h1 className={BANNER_TITLE}>{collection.name}</h1>
				{description && (
					<p className="mt-5 max-w-[27rem] text-sal-nav font-bold leading-6 text-paragraph">{description}</p>
				)}
				<p className="mt-5 text-sal-sm font-bold uppercase tracking-wide text-paragraph">
					{products.length} {products.length === 1 ? "item" : "items"}
				</p>
			</Banner>
			{products.length > 0 ? (
				<div className="mt-14 md:mt-24 lg:mx-[50px]">
					<h2 className="sr-only">Products</h2>
					<div className={DISPLAY_GRID}>
						{products.map((product) => (
							<DisplayCard key={product.id} product={product} />
						))}
					</div>
				</div>
			) : (
				<p className="mt-14 text-center text-sal-base text-muted-foreground">
					This collection is empty for now.
				</p>
			)}
		</div>
	);
};
