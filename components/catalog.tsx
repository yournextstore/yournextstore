import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard, type ProductCardProduct } from "@/components/product-card";
import { cn } from "@/lib/utils";

export const PRODUCTS_PER_PAGE = 24;

/* ── Sort ──────────────────────────────────────────────────────────────────
   minshop's sort row: three fields, the active one carries an arrow and a second
   click flips its direction. `?sort=<field>&dir=<asc|desc>`; defaults are omitted. */

type SortField = "newest" | "price" | "name";
type SortDir = "asc" | "desc";

type SortEntry = { field: SortField; label: string; orderBy: "createdAt" | "price" | "name"; dir: SortDir };

const NEWEST: SortEntry = { field: "newest", label: "Newest", orderBy: "createdAt", dir: "desc" };
const SORT_FIELDS: SortEntry[] = [
	NEWEST,
	{ field: "price", label: "Price", orderBy: "price", dir: "asc" },
	{ field: "name", label: "Name", orderBy: "name", dir: "asc" },
];

export type CatalogSort = { field: SortField; dir: SortDir };

export const DEFAULT_SORT: CatalogSort = { field: "newest", dir: "desc" };

export function parseSort(params: { sort?: string; dir?: string }): CatalogSort {
	const entry = SORT_FIELDS.find((s) => s.field === params.sort) ?? NEWEST;
	const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : entry.dir;
	return { field: entry.field, dir };
}

export function sortQuery(sort: CatalogSort) {
	const entry = SORT_FIELDS.find((s) => s.field === sort.field) ?? NEWEST;
	return { orderBy: entry.orderBy, orderDirection: sort.dir };
}

function sortHref(basePath: string, sort: CatalogSort) {
	const entry = SORT_FIELDS.find((s) => s.field === sort.field) ?? NEWEST;
	const params = new URLSearchParams();
	if (sort.field !== DEFAULT_SORT.field) params.set("sort", sort.field);
	if (sort.dir !== entry.dir) params.set("dir", sort.dir);
	return params.size ? `${basePath}?${params}` : basePath;
}

export function SortRow({ basePath, current = DEFAULT_SORT }: { basePath: string; current?: CatalogSort }) {
	return (
		<div className="mb-8 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs uppercase tracking-widest text-muted-foreground">
			<span>Sort</span>
			{SORT_FIELDS.map((option) => {
				const active = option.field === current.field;
				const next: CatalogSort = active
					? { field: option.field, dir: current.dir === "asc" ? "desc" : "asc" }
					: { field: option.field, dir: option.dir };
				return (
					<Link
						key={option.field}
						href={sortHref(basePath, next)}
						aria-current={active ? "true" : undefined}
						scroll={false}
						className={cn("py-1 transition-colors hover:text-foreground", active && "text-foreground")}
					>
						{option.label}
						{active ? (current.dir === "asc" ? " ↑" : " ↓") : ""}
					</Link>
				);
			})}
		</div>
	);
}

/* ── Heading, category row ─────────────────────────────────────────────── */

export function CatalogHeading({ eyebrow, title }: { eyebrow: ReactNode; title: string }) {
	return (
		<div className="mb-10">
			<div className="eyebrow text-muted-foreground">{eyebrow}</div>
			<h1 className="mt-2 font-serif text-4xl tracking-tight text-balance sm:text-5xl">{title}</h1>
		</div>
	);
}

export function CategoryRow({ links }: { links: { href: string; label: string }[] }) {
	if (links.length === 0) return null;
	return (
		<nav
			aria-label="Categories"
			className="mb-12 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-muted-foreground"
		>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="border-b border-transparent pb-0.5 transition-colors hover:border-foreground hover:text-foreground"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/* ── Grid ──────────────────────────────────────────────────────────────── */

export function CatalogGrid({
	products,
	headingLevel = "h2",
	columns = 3,
	priority = true,
}: {
	products: ProductCardProduct[];
	headingLevel?: "h2" | "h3";
	columns?: 3 | 4;
	priority?: boolean;
}) {
	if (products.length === 0) {
		return (
			<p role="status" className="text-muted-foreground">
				No products yet.
			</p>
		);
	}
	return (
		<ul
			className={cn("grid grid-cols-2 gap-x-6 gap-y-12", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}
		>
			{products.map((product, index) => (
				<li key={product.id} className="reveal" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
					<ProductCard product={product} priority={priority && index < 3} headingLevel={headingLevel} />
				</li>
			))}
		</ul>
	);
}

export function CatalogGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div aria-hidden="true" className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
			{Array.from({ length: count }, (_, i) => (
				<div key={`s-${i}`}>
					<div className="aspect-square animate-pulse rounded-md bg-card" />
					<div className="mt-4 h-5 w-3/4 animate-pulse rounded-sm bg-secondary" />
					<div className="mt-1 h-5 w-1/4 animate-pulse rounded-sm bg-secondary" />
				</div>
			))}
		</div>
	);
}

/* ── Pagination ────────────────────────────────────────────────────────── */

function pageNumbers(current: number, total: number) {
	return Array.from({ length: total }, (_, i) => i + 1).reduce<(number | "gap")[]>((acc, page) => {
		if (page === 1 || page === total || Math.abs(page - current) <= 1) {
			acc.push(page);
		} else if (acc.at(-1) !== "gap") {
			acc.push("gap");
		}
		return acc;
	}, []);
}

export function CatalogPagination({
	basePath,
	currentPage,
	totalPages,
	params = {},
}: {
	basePath: string;
	currentPage: number;
	totalPages: number;
	params?: Record<string, string | undefined>;
}) {
	if (totalPages <= 1) return null;
	const href = (page: number) => {
		const search = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value && key !== "page") search.set(key, value);
		}
		if (page > 1) search.set("page", String(page));
		return search.size ? `${basePath}?${search}` : basePath;
	};
	const link =
		"px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground";

	return (
		<nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-1">
			{currentPage > 1 && (
				<Link href={href(currentPage - 1)} rel="prev" className={link}>
					Prev
				</Link>
			)}
			{pageNumbers(currentPage, totalPages).map((page, index) =>
				page === "gap" ? (
					<span key={`gap-${index}`} className="px-2 text-xs text-faint">
						…
					</span>
				) : (
					<Link
						key={page}
						href={href(page)}
						aria-current={page === currentPage ? "page" : undefined}
						className={cn(link, page === currentPage && "font-medium text-foreground")}
					>
						{page}
					</Link>
				),
			)}
			{currentPage < totalPages && (
				<Link href={href(currentPage + 1)} rel="next" className={link}>
					Next
				</Link>
			)}
		</nav>
	);
}
