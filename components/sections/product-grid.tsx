import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { type CardProduct, ProductCard } from "@/components/product-card";
import { CARD_GRID } from "@/components/product-grid-skeleton";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";

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
	className?: string;
};

/** Archive block in grid mode: an uppercase centred intro over a 2/4-column card grid. */
export async function ProductGrid({
	title = "Featured products",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;
	if (displayProducts.length === 0) return null;

	return (
		<section className={cn("mx-auto max-w-[82rem] px-4 py-12 sm:py-16", className)}>
			<div className="mx-auto mb-8 max-w-3xl text-center">
				<h2 className="text-2xl tracking-tight uppercase">{title}</h2>
				{description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
			</div>
			<div className={CARD_GRID}>
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			{showViewAll ? (
				<div className="mt-8 text-center">
					<Link href={viewAllHref} className="btn-rose">
						View all products
					</Link>
				</div>
			) : null}
		</section>
	);
}

/**
 * Archive block in "autoScroll" mode: the row drifts sideways and pauses on hover or focus.
 * The second copy only closes the loop; it is hidden from assistive tech and the tab order.
 */
export async function ProductMarquee({
	title,
	products,
	align = "center",
}: {
	title: string;
	products: CardProduct[];
	align?: "center" | "start";
}) {
	if (products.length === 0) return null;
	const animate = products.length >= 3;
	const item = "w-[44vw] max-w-[21rem] shrink-0 md:w-[29vw] lg:w-[22vw] lg:max-w-[20rem]";

	return (
		<section
			aria-label={title}
			className={cn("mx-auto max-w-[82rem]", align === "center" ? "px-4 py-12 sm:py-16" : "pt-8")}
		>
			<h2
				className={cn(
					align === "center"
						? "mb-8 text-center text-2xl tracking-tight uppercase"
						: "mb-4 text-lg font-semibold",
				)}
			>
				{title}
			</h2>
			<div className="marquee overflow-hidden motion-reduce:overflow-x-auto">
				<div
					className={cn("flex w-max", animate && "marquee-track")}
					style={{ animationDuration: `${products.length * 9}s` }}
				>
					<div className="flex gap-4 pe-4">
						{products.map((product) => (
							<div key={product.id} className={item}>
								<ProductCard product={product} sizes="(max-width: 768px) 44vw, 320px" />
							</div>
						))}
					</div>
					{animate ? (
						<div aria-hidden="true" className="flex gap-4 pe-4 motion-reduce:hidden">
							{products.map((product) => (
								<div key={product.id} className={item}>
									<ProductCard product={product} sizes="(max-width: 768px) 44vw, 320px" tabIndex={-1} />
								</div>
							))}
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
