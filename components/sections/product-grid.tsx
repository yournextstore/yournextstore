import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductCarousel } from "@/components/product-carousel";
import { Button } from "@/components/ui/button";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	layout?: "grid" | "carousel";
	className?: string;
};

/** Photographed, priced products first: a zero-priced set or an imageless card should not lead a row. */
async function getShowcaseProducts(limit: number) {
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	const leads = (product: Product) =>
		product.images.length > 0 && product.variants.some((variant) => Number(variant.price) > 0);
	return [...data.filter(leads), ...data.filter((product) => !leads(product))].slice(0, limit);
}

export async function ProductGrid({
	title = "Featured Products",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	layout = "grid",
	className = "shell py-16",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await getShowcaseProducts(limit));

	return (
		<section className={className}>
			<div className="mb-8 flex items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold text-ink">{title}</h2>
					{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
				</div>
				{showViewAll && (
					<Button variant="link" asChild className="px-0 text-ink">
						<Link href={viewAllHref}>View all &rarr;</Link>
					</Button>
				)}
			</div>

			{layout === "carousel" ? (
				<ProductCarousel label={title}>
					{displayProducts.map((product, index) => (
						<ProductCard
							key={product.id}
							product={product}
							priority={index === 0}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 300px"
						/>
					))}
				</ProductCarousel>
			) : (
				<div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-6 lg:grid-cols-4">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} sizes="(max-width: 1024px) 50vw, 300px" />
					))}
				</div>
			)}
		</section>
	);
}
