import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getCommerce } from "@/lib/commerce";
import { getCachedTranslations, localePath } from "@/lib/translations";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	locale: string;
	currency: string;
	title?: string;
	description?: string;
	products?: (Product | APICollectionGetByIdResult["productCollections"][number]["product"])[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

export async function ProductGrid({
	locale,
	currency,
	title,
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	const api = getCommerce({ lang: locale, currency });

	const t = await getCachedTranslations(locale, "ProductGrid");
	const displayTitle = title ?? t("title");
	const displayDescription = description ?? t("description");
	const displayProducts = products ?? (await api.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<h2 className="text-2xl sm:text-3xl font-medium text-foreground">{displayTitle}</h2>
					<p className="mt-2 text-muted-foreground">{displayDescription}</p>
				</div>
				{showViewAll && (
					<Link
						prefetch={true}
						href={localePath(locale, viewAllHref)}
						className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						{t("viewAll")}
						<ArrowRight className="h-4 w-4" />
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} locale={locale} currency={currency} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<Link
						prefetch={true}
						href={localePath(locale, viewAllHref)}
						className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						{t("viewAllProducts")}
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			)}
		</section>
	);
}
