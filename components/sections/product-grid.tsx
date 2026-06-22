import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
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
	eyebrow?: string;
};

export async function ProductGrid({
	title = "Your Healthy Hair Routine Starts Here",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-24 sm:pb-32">
				<div className="flex items-end justify-between mb-8 gap-4">
					<h2 className="font-serif text-[1.5rem] sm:text-[1.85rem] lg:text-[2.1rem] leading-tight tracking-tight text-foreground italic max-w-[28ch]">
						{title.split(" Starts Here").length > 1 ? (
							<>
								<span className="not-italic font-normal">{title.replace(" Starts Here", "")}</span>{" "}
								<span className="italic">Starts Here</span>
							</>
						) : (
							title
						)}
					</h2>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="shrink-0 text-[10px] sm:text-[11px] font-medium tracking-[0.22em] uppercase text-foreground underline underline-offset-[6px] decoration-foreground/40 hover:decoration-foreground transition-colors"
						>
							Find Your Perfect Ritual
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{displayProducts.map((product, i) => (
						<ProductCard
							key={product.id}
							product={product}
							cardBg={
								i % 4 === 0
									? "yns-card-mauve"
									: i % 4 === 1
										? "yns-card-lavender"
										: i % 4 === 2
											? "yns-card-cream"
											: "yns-card-mauve"
							}
							showSaveBadge={i === 0}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
