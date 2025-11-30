import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { type Product, ProductGrid } from "@/components/sections/product-grid";
import { type Collection, commerce } from "@/lib/commerce";

type CollectionWithProducts = Collection & {
	productCollections: Array<{
		position: string | null;
		productId: string;
		collectionId: string;
		product: Product;
	}>;
};

async function getCollection(slug: string) {
	"use cache";
	cacheLife("seconds");

	try {
		const collection = await commerce.request<CollectionWithProducts>(`/collections/${slug}`);
		return collection;
	} catch {
		return null;
	}
}

function CollectionHeader({ collection }: { collection: Collection }) {
	return (
		<section className="relative overflow-hidden bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 lg:py-20">
					<div className="max-w-2xl">
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
							{collection.name}
						</h1>
						{collection.description && (
							<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
								{typeof collection.description === "string"
									? collection.description
									: "Explore our curated collection"}
							</p>
						)}
					</div>
				</div>
			</div>
			{collection.image && (
				<div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
					<Image
						src={collection.image}
						alt={collection.name}
						fill
						className="object-cover opacity-30"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-transparent" />
				</div>
			)}
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CollectionProducts({ collection }: { collection: CollectionWithProducts }) {
	const products = collection.productCollections.map((pc) => pc.product);

	return (
		<ProductGrid
			title={`${collection.name} Collection`}
			description={`${products.length} products`}
			products={products}
			showViewAll={false}
		/>
	);
}

export default async function CollectionPage(props: { params: Promise<{ slug: string }> }) {
	const { slug } = await props.params;
	const collection = await getCollection(slug);

	if (!collection) {
		notFound();
	}

	return (
		<main>
			<CollectionHeader collection={collection} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</main>
	);
}
