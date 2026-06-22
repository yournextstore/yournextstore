import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

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
};

export async function ProductGrid({
	title = "Best Sellers",
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-[100rem] mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
					<div className="lg:col-span-3 relative aspect-[4/5] lg:aspect-auto lg:min-h-[600px]">
						<Image
							src="/scraped-1.jpg"
							alt="Glossy lips wearing a warm nude lip balm"
							fill
							sizes="(max-width: 1024px) 100vw, 25vw"
							className="object-cover"
						/>
					</div>

					<div className="lg:col-span-9 px-4 sm:px-6 lg:px-12 py-14 lg:py-20">
						<div className="flex items-end justify-between mb-10">
							<div>
								<p className="text-eyebrow text-[color:var(--color-terracotta-deep)] mb-3">The Bestsellers</p>
								<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground">
									{title}
								</h2>
								{description && <p className="mt-3 text-foreground/65 max-w-md">{description}</p>}
							</div>
							{showViewAll && (
								<div className="hidden sm:flex items-center gap-3">
									<YnsLink
										prefetch={"eager"}
										href={viewAllHref}
										className="text-eyebrow text-foreground/70 hover:text-foreground transition-colors"
									>
										View All
									</YnsLink>
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-foreground/20 text-foreground/70">
											<svg
												viewBox="0 0 24 24"
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.5"
											>
												<path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</span>
										<span className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-foreground/20 text-foreground/70">
											<svg
												viewBox="0 0 24 24"
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.5"
											>
												<path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</span>
									</div>
								</div>
							)}
						</div>

						<div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-10">
							{displayProducts.slice(0, 6).map((product, index) => (
								<ProductCard key={product.id} product={product} priority={index === 0} />
							))}
						</div>

						{showViewAll && (
							<div className="mt-10 text-center sm:hidden">
								<YnsLink prefetch={"eager"} href={viewAllHref} className="text-eyebrow text-foreground/70">
									View all products
								</YnsLink>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
