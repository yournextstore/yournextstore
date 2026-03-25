import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { ProductsPagination } from "./products-pagination";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export const metadata: Metadata = {
	title: "All Products — Vela",
	description: "Browse our complete product collection.",
};

async function ProductList({ page, sort }: { page?: string; sort?: string }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = sortOptions.find((s) => s.value === sort) ?? sortOptions[0];

	const result = await commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products available yet.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<ProductsPagination currentPage={currentPage} totalPages={totalPages} sort={sort} />
		</>
	);
}

function SortLink({ option, currentSort }: { option: (typeof sortOptions)[number]; currentSort?: string }) {
	const isActive = option.value === (currentSort ?? "newest");
	const href = option.value === "newest" ? "/products" : `/products?sort=${option.value}`;

	return (
		<YnsLink
			prefetch="eager"
			href={href}
			className={`text-[0.72rem] uppercase tracking-[0.18em] transition-colors ${
				isActive
					? "border-b border-foreground pb-1 text-foreground"
					: "text-muted-foreground hover:text-foreground"
			}`}
		>
			{option.label}
		</YnsLink>
	);
}

export default async function ProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; sort?: string }>;
}) {
	const { page, sort } = await searchParams;

	return (
		<div className="section-shell-tight">
			<div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
				<div className="space-y-3">
					<p className="editorial-kicker">Product Index</p>
					<h1 className="section-title">All products</h1>
					<p className="max-w-2xl text-sm leading-7 text-muted-foreground">
						Browse the full catalog of furniture, lighting, and smaller objects selected for quieter
						interiors.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3 border-t border-border/80 pt-4 lg:border-t-0 lg:pt-0">
					<span className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">Sort</span>
					{sortOptions.map((option) => (
						<SortLink key={option.value} option={option} currentSort={sort} />
					))}
				</div>
			</div>

			<ProductList page={page} sort={sort} />
		</div>
	);
}
