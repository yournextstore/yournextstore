import type { APIProductsBrowseResult } from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { QuickAddButton } from "@/components/quick-add-button";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { getCategoryCounts } from "@/lib/swag";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];

export const PRODUCTS_PER_PAGE = 24;

/**
 * The original's listing heading: a small FILTER label, then every category as a huge word with
 * its count, the active one in italics. `title` replaces the line on pages that are not a
 * category view (a collection).
 */
export async function ListingHeading({ active, title }: { active?: string | null; title?: string }) {
	const { total, categories } = await getCategoryCounts();

	return (
		<div className="px-4 pt-4 pb-8 lg:px-[14px]">
			{/* Listing pages run full width and fold the cart panel (see globals.css). */}
			<div data-wide hidden />
			<div className="flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:items-start">
				<p className="shrink-0 text-t14 uppercase sm:pt-3">Filter</p>
				{title ? (
					<h1 className="font-sans text-t30 italic wrap-break-word sm:text-t56">{title}</h1>
				) : (
					<nav aria-label="Categories" className="min-w-0">
						<h1 className="sr-only">
							{active ? categories.find((c) => c.slug === active)?.name : "All products"}
						</h1>
						<ul className="flex flex-wrap items-baseline gap-x-5 gap-y-0 font-sans text-t30 sm:text-t56">
							<li>
								<Link
									href="/products"
									aria-current={!active ? "page" : undefined}
									className={cn("hover:underline", !active && "italic")}
								>
									All Products <span className="tabular-nums">({total})</span>
								</Link>
							</li>
							{categories.map((category) => (
								<li key={category.slug} className="min-w-0 wrap-break-word">
									<Link
										href={`/category/${category.slug}`}
										aria-current={active === category.slug ? "page" : undefined}
										className={cn("hover:underline", active === category.slug && "italic")}
									>
										{category.name} <span className="tabular-nums">({category.count})</span>
									</Link>
								</li>
							))}
						</ul>
					</nav>
				)}
			</div>
		</div>
	);
}

/** The original's Catalogue / Grid View switch, docked above the bottom bar on listing pages. */
export function ViewToggle({
	basePath,
	view,
	query = {},
}: {
	basePath: string;
	view: "grid" | "list";
	query?: Record<string, string | undefined>;
}) {
	const href = (next: "grid" | "list") => {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(query)) {
			if (value && key !== "view" && key !== "page") params.set(key, value);
		}
		if (next === "list") params.set("view", "list");
		return params.size ? `${basePath}?${params}` : basePath;
	};
	const item = (next: "grid" | "list", label: string) => (
		<Link
			href={href(next)}
			aria-current={view === next ? "page" : undefined}
			className={cn(
				"flex h-10 flex-1 items-center justify-center font-sans text-t16 font-bold text-black",
				view === next
					? "bg-swag-blue text-white"
					: "halftone bg-[#7fa8ff] [--dot:rgb(0_0_0/0.35)] hover:bg-swag-blue hover:text-white",
			)}
		>
			{label}
		</Link>
	);
	return (
		<div className="sticky bottom-[var(--dock-h)] z-30 flex w-full lg:w-2/3">
			{item("grid", "Catalogue")}
			{item("list", "List View")}
		</div>
	);
}

export function ListingSkeleton({ basePath }: { basePath: string }) {
	return (
		<div className="flex min-h-svh flex-col">
			<div className="flex-1">
				<ProductGridSkeleton count={8} />
			</div>
			<ViewToggle basePath={basePath} view="grid" />
		</div>
	);
}

export async function ListingResults({
	products,
	view,
	currentPage,
	totalCount,
	basePath,
	query,
}: {
	products: BrowseProduct[];
	view: "grid" | "list";
	currentPage: number;
	totalCount: number;
	basePath: string;
	query: Record<string, string | undefined>;
}) {
	const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

	return (
		<div className="flex min-h-svh flex-col">
			<div className="flex-1">
				{products.length === 0 ? (
					<p className="px-4 py-24 text-center text-t14 uppercase">Nothing here yet.</p>
				) : view === "list" ? (
					<ProductTable products={products} offset={(currentPage - 1) * PRODUCTS_PER_PAGE} />
				) : (
					<div className="grid grid-cols-2 lg:grid-cols-4">
						{products.map((product, index) => (
							<ProductCard key={product.id} product={product} priority={index < 4} />
						))}
					</div>
				)}
				<ListingPagination
					basePath={basePath}
					currentPage={currentPage}
					totalPages={totalPages}
					filters={query}
				/>
			</div>
			<ViewToggle basePath={basePath} view={view} query={query} />
		</div>
	);
}

/** The original's "Grid View": a spreadsheet of the catalogue with a quick-add column. */
async function ProductTable({ products, offset }: { products: BrowseProduct[]; offset: number }) {
	const { currency, locale, taxBehavior } = await getStoreConfig();

	return (
		<table className="w-full table-fixed border-collapse text-left text-t14 uppercase">
			<thead className="bg-black text-white">
				<tr>
					<th scope="col" className="hidden w-[16%] p-1.5 font-normal lg:table-cell">
						No.
					</th>
					<th scope="col" className="w-12 p-1.5 font-normal lg:w-[10%]">
						<span className="sr-only lg:not-sr-only">Thumbnail</span>
					</th>
					<th scope="col" className="p-1.5 font-normal">
						Product
					</th>
					<th scope="col" className="w-[28%] p-1.5 font-normal lg:w-[16%]">
						Price
					</th>
					<th scope="col" className="w-12 p-1.5 font-normal lg:w-[18%]">
						<span className="sr-only">Add</span>
					</th>
				</tr>
			</thead>
			<tbody>
				{products.map((product, index) => {
					const { min, max } = priceRange(product.variants, taxBehavior);
					const price =
						min !== max
							? `${formatMoney({ amount: min, currency, locale })}+`
							: formatMoney({ amount: min, currency, locale });
					const thumb = getProductThumbnail(product.images);
					const single =
						product.variants.length === 1 && product.variants[0]?.stock !== 0 ? product.variants[0] : null;
					const href = `/product/${product.slug}`;
					return (
						<tr
							key={product.id}
							className="relative border-b border-swag-gray align-middle hover:bg-black/[0.03]"
						>
							<td className="hidden p-1.5 tabular-nums lg:table-cell">
								{String(offset + index + 1).padStart(3, "0")}
							</td>
							<td className="p-0">
								<div className="relative aspect-[2/3] w-9 bg-white">
									{thumb && <YNSMedia src={thumb} alt="" fill sizes="40px" className="object-cover" />}
								</div>
							</td>
							<td className="p-1.5">
								<Link href={href} className="line-clamp-2 after:absolute after:inset-0 hover:underline">
									{product.name}
								</Link>
							</td>
							<td className="p-1.5 tabular-nums">{price}</td>
							<td className="relative z-10 p-0">
								<div className="flex h-full justify-end">
									{single ? (
										<QuickAddButton
											variantId={single.id}
											variantSku={single.sku}
											variantPrice={single.price}
											variantPriceGross={"priceGross" in single ? single.priceGross : null}
											variantImages={single.images}
											product={{
												id: product.id,
												name: product.name,
												slug: product.slug,
												images: product.images,
											}}
											className="hidden lg:block lg:w-full"
										/>
									) : null}
									<Link
										href={href}
										className={cn(
											"flex h-10 w-12 items-center justify-center bg-black text-white",
											single ? "lg:hidden" : "lg:w-full lg:font-sans lg:text-t16 lg:normal-case",
										)}
									>
										<span className="sr-only">View {product.name}</span>
										<ArrowUpRight className={cn("h-5 w-5", !single && "lg:hidden")} aria-hidden />
										{!single && (
											<span className="hidden lg:inline" aria-hidden>
												Choose options
											</span>
										)}
									</Link>
								</div>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
