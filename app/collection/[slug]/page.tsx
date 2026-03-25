import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		return { title: "Collection Not Found — Vela" };
	}

	const description = typeof collection.description === "string" ? collection.description : undefined;

	return {
		title: `${collection.name} — Vela`,
		description,
		openGraph: {
			title: collection.name,
			description,
			images: collection.image ? [collection.image] : undefined,
		},
	};
}

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	const description = String(typeof collection.description === "string" ? collection.description : "");

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
							<p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
								{description
									? description
									: "A quieter edit of considered pieces, selected to work together without asking for too much attention."}
							</p>
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
							/>
							<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,241,234,0.14)_0%,rgba(21,17,15,0.14)_100%)]" />
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="section-shell-tight">
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
				{Array.from({ length: 10 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="mb-3 aspect-[4/5] bg-secondary animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = collection.productCollections.map((pc) => pc.product);

	return (
		<ProductGrid
			title={`Inside ${collection.name}`}
			description={`${products.length} pieces selected for this edit.`}
			products={products}
			showViewAll={false}
		/>
	);
}

export default async function CollectionPage(props: PageProps<"/collection/[slug]">) {
	"use cache";
	cacheLife("minutes");

	const { slug } = await props.params;
	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		notFound();
	}

	return (
		<main>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</main>
	);
}
