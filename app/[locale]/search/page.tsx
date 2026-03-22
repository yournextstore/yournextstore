import { Search } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/product-card";
import { getCommerce } from "@/lib/commerce";
import { getActiveCurrency } from "@/lib/currency";
import { getCachedTranslations } from "@/lib/translations";
import { SearchPagination } from "./search-pagination";

const PRODUCTS_PER_PAGE = 12;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
	const { q } = await searchParams;
	const t = await getTranslations("Metadata");
	return {
		title: q ? t("searchTitleWithQuery", { query: q }) : t("searchTitle"),
		description: q ? t("searchDescriptionWithQuery", { query: q }) : t("searchDescription"),
	};
}

async function SearchResults({
	q,
	page,
	locale,
	currency,
}: {
	q?: string;
	page?: string;
	locale: string;
	currency: string;
}) {
	const currentPage = Math.max(1, Number(page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const t = await getCachedTranslations(locale, "Search");

	if (!q?.trim()) {
		return (
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center">
					<Search className="mx-auto h-12 w-12 text-muted-foreground" />
					<h1 className="mt-4 text-2xl font-medium text-foreground">{t("title")}</h1>
					<p className="mt-2 text-muted-foreground">{t("enterTerm")}</p>
				</div>
			</section>
		);
	}

	const api = getCommerce({ lang: locale, currency });

	const result = await api.productBrowse({
		query: q.trim(),
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center">
					<Search className="mx-auto h-12 w-12 text-muted-foreground" />
					<h1 className="mt-4 text-2xl font-medium text-foreground">{t("noResults")}</h1>
					<p className="mt-2 text-muted-foreground">{t("noResultsFor", { query: q })}</p>
				</div>
			</section>
		);
	}

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="mb-12">
				<h1 className="text-2xl sm:text-3xl font-medium text-foreground">{t("resultsFor", { query: q })}</h1>
				<p className="mt-2 text-muted-foreground">
					{`${result.meta.count} ${result.meta.count === 1 ? "product" : "products"} found`}
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} locale={locale} currency={currency} />
				))}
			</div>

			<SearchPagination currentPage={currentPage} totalPages={totalPages} query={q} />
		</section>
	);
}

export default async function SearchPage({
	searchParams,
	params,
}: {
	searchParams: Promise<{ q?: string; page?: string }>;
	params: Promise<{ locale: string }>;
}) {
	const [{ q, page }, { locale }] = await Promise.all([searchParams, params]);
	const currency = await getActiveCurrency(locale);
	return <SearchResults q={q} page={page} locale={locale} currency={currency} />;
}
