import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { getCommerce } from "@/lib/commerce";
import { getCachedTranslations } from "@/lib/translations";

export function RelatedProducts(props: {
	productId: string;
	categorySlug?: string;
	locale: string;
	currency: string;
}) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

async function RelatedProductsContent({
	productId,
	categorySlug,
	locale,
	currency,
}: {
	productId: string;
	categorySlug?: string;
	locale: string;
	currency: string;
}) {
	const api = getCommerce({ lang: locale, currency });

	const [result, t] = await Promise.all([
		api.productBrowse({
			active: true,
			limit: 7,
			...(categorySlug ? { category: categorySlug } : {}),
		}),
		getCachedTranslations(locale, "RelatedProducts"),
	]);

	const related = result.data.filter((p) => p.id !== productId).slice(0, 6);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			locale={locale}
			currency={currency}
			title={t("title")}
			description={t("description")}
			products={related}
			showViewAll={false}
		/>
	);
}
