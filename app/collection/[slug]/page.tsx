import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		return { title: "Collection Not Found", robots: { index: false, follow: true } };
	}

	const description =
		typeof collection.description === "string"
			? collection.description
			: `Shop the ${collection.name} collection.`;
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

function CollectionHeader({ collection, count }: { collection: APICollectionGetByIdResult; count: number }) {
	return (
		<section className="bg-background border-b border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<nav
					aria-label="Breadcrumb"
					className="pt-8 sm:pt-10 flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground"
				>
					<YnsLink href="/" className="hover:text-foreground transition-colors">
						Home
					</YnsLink>
					<span aria-hidden>—</span>
					<YnsLink href="/products" className="hover:text-foreground transition-colors">
						Collections
					</YnsLink>
					<span aria-hidden>—</span>
					<span className="text-foreground">{collection.name}</span>
				</nav>

				<div className="pt-6 sm:pt-8 pb-10 flex items-end gap-3 sm:gap-4">
					<h1 className="font-display text-5xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-[-0.01em] text-foreground uppercase">
						{collection.name}
					</h1>
					<span className="font-display text-base sm:text-lg text-muted-foreground mb-3 sm:mb-5">
						<sup>{count}</sup>
					</span>
				</div>

				{collection.description && typeof collection.description === "string" && (
					<p className="pb-10 max-w-xl text-sm leading-relaxed text-muted-foreground">
						{collection.description}
					</p>
				)}
			</div>
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-[color:var(--cream)] mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-3 w-1/2 bg-secondary rounded animate-pulse" />
							<div className="h-3 w-3/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const ids = collection.productCollections.map((pc) => pc.product.id);
	const products = (await Promise.all(ids.map((id) => commerce.productGet({ idOrSlug: id })))).filter(
		(product) => product !== null,
	);

	return <ProductGrid title={collection.name} products={products} showViewAll={false} />;
}

export default async function CollectionPage(props: PageProps<"/collection/[slug]">) {
	"use cache";
	cacheLife("minutes");

	const { slug } = await props.params;
	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		notFound();
	}

	const count = collection.productCollections.length;

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} count={count} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</>
	);
}
