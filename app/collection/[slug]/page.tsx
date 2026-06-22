import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
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
import { isPreview } from "@/lib/demo-products";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: SearchParams;
}): Promise<Metadata> {
	const { slug } = await params;
	const preview = await isPreview(await searchParams);

	if (preview) {
		return {
			title: `${slug} — Your Next Store`,
			robots: { index: false, follow: false },
		};
	}

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
		<section className="relative overflow-hidden bg-cream-grain border-b border-[#e8dcc8]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-20 sm:py-24">
					<div className="max-w-2xl mx-auto text-center">
						<p className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-4">Collection</p>
						<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground">{collection.name}</h1>
						{collection.description && (
							<p className="mt-5 text-base text-muted-foreground leading-relaxed">
								{typeof collection.description === "string"
									? collection.description
									: "Explore our curated collection"}
							</p>
						)}
						<div className="mt-6 mx-auto h-px w-12 bg-[#c9a87c]" />
					</div>
				</div>
			</div>
			{collection.image && (
				<div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-30">
					<YNSMedia
						src={collection.image}
						alt={collection.name}
						fill
						sizes="50vw"
						className="object-cover"
						priority
					/>
				</div>
			)}
		</section>
	);
}

function PreviewCollectionHeader({ slug }: { slug: string }) {
	return (
		<section className="relative overflow-hidden bg-cream-grain border-b border-[#e8dcc8]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-20 sm:py-24">
					<div className="max-w-2xl mx-auto text-center">
						<p className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-4">Collection</p>
						<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground capitalize">
							{slug.replace(/-/g, " ")}
						</h1>
						<p className="mt-5 text-base text-muted-foreground leading-relaxed">
							A small, hand-poured selection from the current Édition Hiver.
						</p>
						<div className="mt-6 mx-auto h-px w-12 bg-[#c9a87c]" />
					</div>
				</div>
			</div>
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary rounded-sm mb-5 animate-pulse" />
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
			title={`${collection.name}`}
			eyebrow={`${products.length} pieces`}
			products={products}
			showViewAll={false}
		/>
	);
}

export default async function CollectionPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: SearchParams;
}) {
	const { slug } = await props.params;
	const preview = await isPreview(await props.searchParams);

	if (preview) {
		return (
			<main>
				<PreviewCollectionHeader slug={slug} />
				<ProductGrid title="The collection" eyebrow="Curated for you" preview showViewAll={false} limit={6} />
			</main>
		);
	}

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
