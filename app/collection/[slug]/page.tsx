import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmptyListing } from "@/components/listing";
import { headingSizes } from "@/components/munch/styles";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton, productGridClass } from "@/components/product-grid-skeleton";
import { getCollectionData, getCollectionProducts, richTextToPlain } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
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

function CollectionPageSkeleton() {
	return (
		<section className="shell flex min-h-svh flex-col gap-10 pt-26 pb-10">
			<div className="flex flex-col gap-s">
				<div className="h-[21px] w-40 animate-pulse rounded bg-[#f4ebdb] lg:h-6" />
				<div className="h-[62px] w-72 animate-pulse rounded bg-[#f4ebdb] lg:h-[106px]" />
			</div>
			<ProductGridSkeleton count={9} />
		</section>
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

	const products = await getCollectionProducts(collection);
	const description = richTextToPlain(collection.description);

	return (
		<section className="shell flex min-h-svh flex-col gap-10 pt-26 pb-10">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<div className="flex flex-col gap-s">
				<nav aria-label="Breadcrumb" className="text-b-sm leading-[1.5] lg:text-b-md">
					<Link href="/">Home</Link>
					{" / "}
					<Link href="/products">Shop all</Link>
					{" / "}
					<span aria-current="page">{collection.name}</span>
				</nav>
				<h1 className={headingSizes.page}>{collection.name}</h1>
				{description && <p className="max-w-180 text-b-lg leading-[1.5] lg:text-b-xl">{description}</p>}
			</div>
			{products.length === 0 ? (
				<EmptyListing message="Nothing here yet. Have a look at everything else in the shop." />
			) : (
				<div className={productGridClass}>
					{products.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>
			)}
		</section>
	);
};
