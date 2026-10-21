import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { MenuGrid, MenuLayout, MenuSidebar } from "@/components/menu";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCollectionProducts, getMenuCategories, plainText } from "@/lib/catalog";
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
		plainText(collection.description) ?? `Shop the ${collection.name} collection at ${storeName}.`;
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

/** A compact version of the home hero: oat copy panel beside the collection's photograph. */
function CollectionHeader({
	collection,
	image,
	count,
}: {
	collection: APICollectionGetByIdResult;
	image: string | undefined;
	count: number;
}) {
	const description = plainText(collection.description);
	return (
		<section className="mx-auto grid w-full max-w-[1280px] bg-muted lg:min-h-[320px] lg:grid-cols-[46%_54%]">
			{image ? (
				<div className="relative h-[220px] overflow-hidden sm:h-[300px] lg:col-start-2 lg:row-start-1 lg:h-auto">
					<YNSMedia
						src={image}
						alt=""
						fill
						priority
						fetchPriority="high"
						sizes="(min-width: 1024px) 54vw, 100vw"
						className="object-cover"
					/>
				</div>
			) : null}
			<div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:col-start-1 lg:row-start-1 lg:p-14">
				<p className="mb-5 text-[11px] uppercase tracking-[0.18em] text-eyebrow">
					Collection · {count} {count === 1 ? "item" : "items"}
				</p>
				<h1 className="font-display text-[clamp(34px,4vw,56px)] leading-[1.04] tracking-[-0.04em]">
					{collection.name}
				</h1>
				{description ? (
					<p className="mt-5 max-w-[40ch] text-body-md leading-[1.65] text-muted-foreground">{description}</p>
				) : null}
			</div>
		</section>
	);
}

function CollectionPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="mx-auto h-[300px] w-full max-w-[1280px] animate-pulse bg-muted lg:h-[320px]" />
			<MenuLayout leading={<div className="h-64" />}>
				<ProductGridSkeleton />
			</MenuLayout>
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

	const [products, categories] = await Promise.all([getCollectionProducts(collection), getMenuCategories()]);
	const image = collection.image ?? products.find((product) => product.images[0])?.images[0];
	const links = [
		{ href: "/products", label: "All items" },
		...categories.map((c) => ({ href: `/category/${c.path}`, label: c.name })),
	];

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} image={image} count={products.length} />
			<MenuLayout leading={<MenuSidebar links={links} />}>
				{products.length > 0 ? (
					<MenuGrid>
						{products.map((product, index) => (
							<ProductCard key={product.id} product={product} priority={index < 2} headingLevel="h2" />
						))}
					</MenuGrid>
				) : (
					<p className="py-16 text-body-md text-muted-foreground">Nothing in this collection yet.</p>
				)}
			</MenuLayout>
		</>
	);
};
