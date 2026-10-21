import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import {
	CatalogGrid,
	CatalogHeading,
	CatalogPagination,
	CategoryRow,
	DEFAULT_SORT,
	PRODUCTS_PER_PAGE,
	SortRow,
	sortQuery,
} from "@/components/catalog";
import { getCategoryLinks, picturedFirst } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// The storefront opens on the catalog itself, as minshop does. The first page is fully
// cached, so the home page prerenders whole; sorting and paging continue on /products.
async function getFirstPage() {
	"use cache";
	cacheLife("minutes");
	return commerce.productBrowse({ active: true, limit: PRODUCTS_PER_PAGE, ...sortQuery(DEFAULT_SORT) });
}

export default async function Home() {
	const [products, categories] = await Promise.all([getFirstPage(), getCategoryLinks()]);
	const totalPages = Math.ceil(products.meta.count / PRODUCTS_PER_PAGE);

	return (
		<div className="shell">
			<CatalogHeading eyebrow="Shop" title="All products" />
			<CategoryRow links={categories} />
			<SortRow basePath="/products" />
			<CatalogGrid products={picturedFirst(products.data)} />
			<CatalogPagination basePath="/products" currentPage={1} totalPages={totalPages} />
		</div>
	);
}
