import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { commerce } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

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

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	return (
		<section className="relative overflow-hidden bg-secondary/30">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 lg:py-20">
					<div className="max-w-2xl">
						<h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
							{collection.name}
						</h1>
						{collection.description && (
							<p className="mt-4 text-lg leading-relaxed text-muted-foreground">
								{typeof collection.description === "string"
									? collection.description
									: "Explore our curated collection"}
							</p>
						)}
					</div>
				</div>
			</div>
			{collection.image && (
				<div className="absolute top-0 right-0 hidden h-full w-1/2 lg:block">
					<YNSMedia
						src={collection.image}
						alt={collection.name}
						fill
						sizes="50vw"
						className="object-cover opacity-30"
						priority
					/>
					<div className="absolute inset-0 bg-linear-to-r from-secondary/30 to-transparent" />
				</div>
			)}
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
			<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] animate-pulse rounded-sm bg-secondary" />
						<div className="mt-3 space-y-2">
							<div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
							<div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
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

	return (
		<ProductGrid
			title={`${collection.name} Collection`}
			description={`${products.length} products`}
			products={products}
			showViewAll={false}
			columns={4}
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
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{collection.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<CollectionHeader collection={collection} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</>
	);
}
