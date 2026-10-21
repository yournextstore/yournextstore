import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { SortSelect } from "@/app/products/products-sort-select";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { getCategories } from "@/lib/catalog";
import { getFilterFacets } from "@/lib/facets";
import { CHIP_ACTIVE, CHIP_ALL, CHIP_IDLE, TOOLBAR_PILL } from "@/lib/toolbar";

export const SORT_OPTIONS = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low → High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High → Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

function ControlsFallback({ withFilters }: { withFilters: boolean }) {
	return (
		<div aria-hidden className="flex gap-3">
			<span className={`${TOOLBAR_PILL} w-28`} />
			{withFilters && <span className={`${TOOLBAR_PILL} w-24`} />}
		</div>
	);
}

/**
 * The original's filter bar: search on the left, category chips and sort on the right.
 * Chips are links (category pages are real routes); only sort and the filter sheet read the
 * URL, so they alone sit in a Suspense boundary with a same-sized fallback.
 */
export async function ListingToolbar({
	activeCategory,
	showSort = true,
}: {
	activeCategory?: string;
	showSort?: boolean;
}) {
	const [categories, facets] = await Promise.all([getCategories(), getFilterFacets()]);
	const withFilters =
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="flex flex-col items-start justify-between gap-3 border-b border-border py-5 lg:flex-row lg:items-center">
			<search className="w-full max-w-xs shrink-0">
				<form action="/search" className="relative">
					<label htmlFor="listing-search" className="sr-only">
						Search products
					</label>
					<Search
						className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
						strokeWidth={1.5}
						aria-hidden
					/>
					<input
						id="listing-search"
						type="search"
						name="q"
						placeholder="Search products..."
						className="h-10 w-full rounded-full border border-border bg-card pr-4 pl-10 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-brand-display focus:outline-none"
					/>
				</form>
			</search>
			<div className="flex flex-wrap items-center gap-3 lg:justify-end">
				{categories.length > 0 && (
					<nav aria-label="Categories">
						<ul className="flex flex-wrap gap-2">
							<li>
								<Link
									href="/products"
									aria-current={activeCategory ? undefined : "page"}
									className={activeCategory ? CHIP_IDLE : CHIP_ALL}
								>
									All
								</Link>
							</li>
							{categories.map((category) => (
								<li key={category.id}>
									<Link
										href={`/category/${category.slug}`}
										aria-current={activeCategory === category.slug ? "page" : undefined}
										className={activeCategory === category.slug ? CHIP_ACTIVE : CHIP_IDLE}
									>
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				)}
				<Suspense fallback={<ControlsFallback withFilters={withFilters} />}>
					<div className="flex gap-3">
						{showSort && <SortSelect options={SORT_OPTIONS} />}
						{withFilters && <ProductFiltersMobile facets={facets} showCategories={false} />}
					</div>
				</Suspense>
			</div>
		</div>
	);
}

export function ListingHeader({ kicker, title }: { kicker: string; title: string }) {
	return (
		<div className="border-b border-border pt-12 pb-8">
			<p className="kicker mb-2">{kicker}</p>
			<h1 className="wrap-break-word font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-tight text-foreground">
				{title}
			</h1>
		</div>
	);
}
