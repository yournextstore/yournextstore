import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { productGridClass } from "@/components/product-grid-skeleton";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { getCatalogCategories, getHomeProducts, getStoreIdentity } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every read below is cached, so the whole home page prerenders with the shell (no Suspense,
// no streamed sections, no layout shift).
export default async function Home() {
	const [categories, { arrivals }, { storeName }] = await Promise.all([
		getCatalogCategories(),
		getHomeProducts(),
		getStoreIdentity(),
	]);

	return (
		<div className="frame space-y-10">
			<h1 className="sr-only">{storeName}</h1>
			<HeroCarousel />

			{categories.length > 0 ? (
				<section aria-labelledby="home-categories" className="w-full space-y-5">
					<h2 id="home-categories" className="text-xl font-semibold">
						Categories
					</h2>
					<div
						className={cn(
							"grid w-full grid-cols-1 gap-4",
							// Three categories sit in one row; otherwise two, then four to a row.
							categories.length === 3 ? "sm:grid-cols-3" : "xs:grid-cols-2 lg:grid-cols-4",
						)}
					>
						{categories.map((category) => (
							<CategoryCard key={category.slug} category={category} />
						))}
					</div>
				</section>
			) : null}

			{arrivals.length > 0 ? (
				<section aria-labelledby="home-featured" className="w-full space-y-5">
					<div className="flex items-center justify-between gap-4">
						<h2 id="home-featured" className="leading-[1.1] font-semibold md:text-xl">
							Featured products
						</h2>
						<Link
							href="/products"
							className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							View all
							<ArrowRight aria-hidden="true" className="size-4" />
						</Link>
					</div>
					<div className={productGridClass}>
						{arrivals.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			) : null}
		</div>
	);
}
