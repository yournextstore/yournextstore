import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { TiptapRenderer } from "@/components/tiptap-renderer";
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
		return { title: "Collection Not Found — Your Next Store" };
	}

	const description = typeof collection.description === "string" ? collection.description : undefined;

	return {
		title: `${collection.name} — Your Next Store`,
		description,
		openGraph: {
			title: collection.name,
			description,
			images: collection.image ? [collection.image] : undefined,
		},
	};
}

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	const totalCount = collection.productCollections.length;

	return (
		<section className="bg-[var(--color-primary-container)] border-b border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
				<div>
					<span className="label-caps text-[var(--color-on-primary-container)]">Collection</span>
					<h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] leading-[1.05] mt-3 text-[var(--color-on-primary-container)]">
						{collection.name}
					</h1>
					{collection.description && (
						<div className="mt-6 text-base md:text-lg leading-relaxed text-[var(--color-on-surface-variant)] prose max-w-xl">
							{typeof collection.description === "string" ? (
								<p>{collection.description}</p>
							) : (
								<TiptapRenderer content={collection.description} />
							)}
						</div>
					)}
					<div className="mt-6 inline-block label-caps neo-border px-3 py-2 bg-[var(--color-surface-container-lowest)]">
						{totalCount} {totalCount === 1 ? "product" : "products"}
					</div>
				</div>
				{collection.image && (
					<div className="relative w-full aspect-[4/3] neo-border bg-[var(--color-surface-container-lowest)] hover:neo-shadow transition-shadow">
						<YNSMedia
							src={collection.image}
							alt={collection.name}
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							priority
						/>
					</div>
				)}
			</div>
		</section>
	);
}

function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = collection.productCollections.map((pc) => pc.product);

	if (products.length === 0) {
		return (
			<div className="neo-border bg-[var(--color-surface-container-lowest)] py-24 text-center">
				<p className="font-serif text-2xl mb-2">Empty collection</p>
				<p className="text-[var(--color-on-surface-variant)]">No products are assigned here yet.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
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
			<section className="px-5 md:px-20 py-12 md:py-16 border-b border-foreground">
				<div className="max-w-[1280px] mx-auto">
					<Suspense fallback={<div className="h-96" />}>
						<CollectionProducts collection={collection} />
					</Suspense>
				</div>
			</section>
		</main>
	);
}
