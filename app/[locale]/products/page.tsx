import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/product-card";
import { getCommerce } from "@/lib/commerce";
import { getActiveCurrency } from "@/lib/currency";
import { getCachedTranslations, localePath } from "@/lib/translations";
import { ProductsPagination } from "./products-pagination";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", labelKey: "sortNewest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", labelKey: "sortPriceLow", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", labelKey: "sortPriceHigh", orderBy: "price", orderDirection: "desc" },
	{ value: "name", labelKey: "sortName", orderBy: "name", orderDirection: "asc" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Metadata");
	return {
		title: t("productsTitle"),
		description: t("productsDescription"),
	};
}

async function ProductList({
	page,
	sort,
	locale,
	currency,
}: {
	page?: string;
	sort?: string;
	locale: string;
	currency: string;
}) {
	const currentPage = Math.max(1, Number(page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = sortOptions.find((s) => s.value === sort) ?? sortOptions[0];

	const api = getCommerce({ lang: locale, currency });

	const [result, t] = await Promise.all([
		api.productBrowse({
			active: true,
			limit: PRODUCTS_PER_PAGE,
			offset,
			orderBy: sortOption.orderBy,
			orderDirection: sortOption.orderDirection,
		}),
		getCachedTranslations(locale, "Products"),
	]);

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">{t("noProducts")}</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} locale={locale} currency={currency} />
				))}
			</div>

			<ProductsPagination currentPage={currentPage} totalPages={totalPages} sort={sort} />
		</>
	);
}

function SortLink({
	option,
	currentSort,
	label,
	locale,
}: {
	option: (typeof sortOptions)[number];
	currentSort?: string;
	label: string;
	locale: string;
}) {
	const isActive = option.value === (currentSort ?? "newest");
	const href =
		option.value === "newest"
			? localePath(locale, "/products")
			: localePath(locale, `/products?sort=${option.value}`);

	return (
		<Link
			prefetch={true}
			href={href}
			className={`text-sm transition-colors ${isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
		>
			{label}
		</Link>
	);
}

export default async function ProductsPage({
	searchParams,
	params,
}: {
	searchParams: Promise<{ page?: string; sort?: string }>;
	params: Promise<{ locale: string }>;
}) {
	const [{ page, sort }, { locale }] = await Promise.all([searchParams, params]);
	const [t, currency] = await Promise.all([
		getTranslations({ locale, namespace: "Products" }),
		getActiveCurrency(locale),
	]);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-10">
				<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">{t("title")}</h1>
				<p className="mt-2 text-muted-foreground">{t("description")}</p>
			</div>

			<div className="mb-8 flex flex-wrap items-center gap-3">
				<span className="text-sm text-muted-foreground">{t("sortBy")}</span>
				{sortOptions.map((option) => (
					<SortLink
						key={option.value}
						option={option}
						currentSort={sort}
						label={t(option.labelKey)}
						locale={locale}
					/>
				))}
			</div>

			<ProductList page={page} sort={sort} locale={locale} currency={currency} />
		</div>
	);
}
