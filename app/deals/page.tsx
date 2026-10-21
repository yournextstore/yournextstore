import type { Metadata } from "next";
import Link from "next/link";
import { ListingToolbar } from "@/components/gf/listing";
import { PageBar } from "@/components/gf/page-bar";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID } from "@/components/product-grid-skeleton";
import { getDiscountedProducts } from "@/lib/catalog";
import { gfGreenPill } from "@/lib/gf-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Special offers",
	alternates: { canonical: "/deals" },
};

/** Products whose price sits below their list price — nothing else, so the page cannot overpromise. */
export default async function DealsPage() {
	const products = await getDiscountedProducts();

	return (
		<div className="min-h-svh">
			<PageBar title="Special offers" />
			{products.length === 0 ? (
				<div className="flex flex-col items-center py-16 text-center">
					<p className="text-gf-h5 text-muted-foreground">Nothing is on offer right now.</p>
					<Link href="/products" className={cn(gfGreenPill, "mt-6 h-[50px] w-auto px-8")}>
						Browse the catalog
					</Link>
				</div>
			) : (
				<>
					<ListingToolbar
						count={`${products.length} ${products.length === 1 ? "product" : "products"} on offer`}
					/>
					<h2 className="sr-only">Products</h2>
					<div className={PRODUCT_GRID}>
						{products.map((product, index) => (
							<ProductCard key={product.id} product={product} priority={index < 2} />
						))}
					</div>
				</>
			)}
		</div>
	);
}
