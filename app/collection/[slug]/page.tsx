import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { AccentName } from "@/components/brand/em";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCollectionProducts, richTextToPlain } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
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
	const description = richTextToPlain(collection.description);
	return (
		<section className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
			<div className="max-w-xl">
				<p className="eyebrow">Collection</p>
				<h1 className="mt-4 font-display text-title-xl md:text-[3.75rem] md:leading-[1.05]">
					<AccentName name={collection.name} />
				</h1>
				{description && <p className="mt-5 text-lead text-ink/75">{description}</p>}
			</div>
			{collection.image && (
				<div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line">
					<YNSMedia
						src={collection.image}
						alt=""
						fill
						sizes="(min-width: 1024px) 50vw, 100vw"
						className="object-cover"
						priority
					/>
					<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page/50 to-transparent" />
				</div>
			)}
		</section>
	);
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	if (products.length === 0) {
		return (
			<div className="mt-16 max-w-md">
				<p className="font-display text-title-sm">This collection is being prepared</p>
				<p className="mt-3 text-muted-foreground">In the meantime, everything else is on the shelf.</p>
				<Link href="/products" className="btn-line mt-8">
					Shop everything
				</Link>
			</div>
		);
	}

	return (
		<>
			<p className="mt-16 text-sm text-muted-foreground">
				{products.length} {products.length === 1 ? "product" : "products"}
			</p>
			<div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
		</>
	);
}

function CollectionProductsSkeleton() {
	return (
		<>
			<div className="mt-16 h-5" />
			<ProductGridSkeleton className="mt-8" />
		</>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="container-page pb-20 pt-14 md:pb-28 md:pt-18">
			<div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
				<div className="space-y-4">
					<div className="h-4 w-24 animate-pulse rounded bg-surface" />
					<div className="h-14 w-72 animate-pulse rounded bg-surface" />
				</div>
				<div className="aspect-[16/10] animate-pulse rounded-xl bg-surface" />
			</div>
			<CollectionProductsSkeleton />
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
		<div className="container-page pb-20 pt-14 md:pb-28 md:pt-18">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} />
			<Suspense fallback={<CollectionProductsSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</div>
	);
};
