import Link from "next/link";
import type { ReactNode } from "react";
import { type CardProduct, ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { YNSMedia } from "@/lib/yns-media";

/** Home / Section / Page trail. The last item is the current page. */
export function Breadcrumbs({ items }: { items: [label: string, href?: string][] }) {
	return (
		<nav className="breadcrumbs" aria-label="Breadcrumb">
			<ol>
				{items.map(([label, href], i) => (
					<li key={`${label}-${href ?? i}`}>
						{href && i < items.length - 1 ? (
							<Link href={href}>{label}</Link>
						) : (
							<span aria-current="page">{label}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}

export function ListingHeader({
	title,
	description,
	image,
}: {
	title: string;
	description?: string | null;
	image?: string | null;
}) {
	return (
		<div className="listing-header">
			<div>
				<h1>{title}</h1>
				{description && <p className="listing-description">{description}</p>}
			</div>
			{image && (
				<div className="listing-hero">
					<div className="media">
						<YNSMedia src={image} alt="" fill sizes="200px" className="object-cover" />
					</div>
				</div>
			)}
		</div>
	);
}

export function ListingToolbar({ count, children }: { count: number; children?: ReactNode }) {
	return (
		<div className="listing-toolbar">
			<p className="listing-count">
				<strong>{count}</strong> {count === 1 ? "product" : "products"}
			</p>
			{children}
		</div>
	);
}

export function ProductGridList({ products, wide = false }: { products: CardProduct[]; wide?: boolean }) {
	if (products.length === 0) {
		return (
			<div className="empty-state">
				<h2>Nothing matches yet</h2>
				<p>Try removing a filter, or browse everything in the shop.</p>
				<Link href="/products" className="button primary">
					All products
				</Link>
			</div>
		);
	}
	return (
		<>
			<h2 className="sr-only">Products</h2>
			<div className={wide ? "product-grid related-grid" : "product-grid"}>
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
		</>
	);
}

/** Toolbar + grid placeholder sized like the real content, so the streamed listing does not shift. */
export function ListingSkeleton({ sidebar = true, count = 6 }: { sidebar?: boolean; count?: number }) {
	return (
		<div className={sidebar ? "listing-layout listing-skeleton" : "listing-skeleton"} aria-hidden>
			{sidebar && <div className="filter-sidebar filter-sidebar-skeleton" />}
			<div className="listing-main">
				<div className="listing-toolbar">
					<p className="listing-count">
						<strong>&nbsp;</strong>
					</p>
					<span className="sort-select sort-select-skeleton" />
				</div>
				<div className={sidebar ? "product-grid" : "product-grid related-grid"}>
					{Array.from({ length: count }, (_, i) => (
						<ProductCardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
