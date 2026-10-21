import type { APIProductFiltersResult } from "commerce-kit";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { SortSelect } from "@/app/products/products-sort-select";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import type { CatalogCategory } from "@/lib/catalog";
import { sortOptions } from "@/lib/sort";
import { cn } from "@/lib/utils";

/** Static stand-ins for the client controls: a Suspense fallback must not read search params. */
function ControlSkeleton({ className }: { className?: string }) {
	return <span aria-hidden className={cn("block h-9 rounded-md border border-slate-line", className)} />;
}

function CategoryList({ categories, active }: { categories: CatalogCategory[]; active: string | null }) {
	const items: { name: string; slug: string | null; href: string }[] = [
		{ name: "All products", slug: null, href: "/products" },
		...categories.map((category) => ({
			name: category.name,
			slug: category.slug,
			href: `/category/${category.slug}`,
		})),
	];
	return (
		<nav aria-label="Categories">
			<ul className="flex flex-wrap gap-x-5 gap-y-1 md:mb-4 md:ml-3 md:block md:space-y-2">
				{items.map((item) => {
					const isActive = item.slug === active;
					return (
						<li key={item.href}>
							<Link
								href={item.href}
								aria-current={isActive ? "page" : undefined}
								className={cn(
									"inline-block py-1 text-sm transition-colors md:py-0",
									isActive ? "font-semibold text-slate-ink" : "text-slate-ink/80 hover:text-slate-ink",
								)}
							>
								{item.name}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

/**
 * CategoryFilters: the title with a "Sort" control over a rule, plain category links and
 * ruled filter accordions in a left column, and the product cards in the remaining two thirds.
 */
export function ListingLayout({
	title,
	kicker,
	categories,
	activeCategory,
	facets,
	showSort = true,
	children,
}: {
	title: string;
	kicker?: ReactNode;
	categories: CatalogCategory[];
	activeCategory: string | null;
	facets: APIProductFiltersResult;
	showSort?: boolean;
	children: ReactNode;
}) {
	const filtersAvailable =
		facets.brands.length > 0 || facets.variantTypes.length > 0 || facets.priceBounds.max > 0;

	return (
		<div className="container-ae min-h-svh pt-10 sm:pt-12">
			{kicker}
			<div className="flex flex-wrap items-end gap-x-6 gap-y-3 border-b border-slate-line pb-4">
				<h1 className="wrap-break-word min-w-[min(100%,12rem)] flex-1 text-[2rem] font-bold leading-tight sm:text-[2.25rem]">
					{title}
				</h1>
				<div className="flex items-center gap-2">
					{filtersAvailable && (
						<Suspense fallback={<ControlSkeleton className="w-24 md:hidden" />}>
							<ProductFiltersMobile facets={facets} showCategories={false} showCollections={false} />
						</Suspense>
					)}
					{showSort && (
						<Suspense fallback={<ControlSkeleton className="w-40" />}>
							<SortSelect
								options={sortOptions}
								className="h-9 min-w-40 rounded-md border-slate-line font-semibold text-slate-ink"
							/>
						</Suspense>
					)}
				</div>
			</div>

			<div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-12">
				<aside className="md:col-span-4 lg:pr-6">
					<CategoryList categories={categories} active={activeCategory} />
					{filtersAvailable && (
						<Suspense fallback={<div className="hidden h-40 md:block" />}>
							<ProductFilters facets={facets} showCategories={false} showCollections={false} />
						</Suspense>
					)}
				</aside>
				<div className="min-w-0 md:col-span-8">{children}</div>
			</div>
		</div>
	);
}

export function ListingGridSkeleton() {
	return <ProductGridSkeleton className="min-h-svh sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" />;
}
