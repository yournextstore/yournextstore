import { type Metadata } from "next/types";
import { RedirectType, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductList } from "@/ui/products/productList";
import { ProductNotFound } from "@/ui/products/ProductNotFound";
import { Search } from "@/lib/api";
import { publicUrl } from "@/env.mjs";

export const generateMetadata = async ({
	searchParams,
}: {
	searchParams: {
		q?: string;
	};
}): Promise<Metadata> => {
	const t = await getTranslations("/search.metadata");
	return {
		title: t("title", { query: searchParams.q }),
		alternates: { canonical: `${publicUrl}/search` },
	};
};

export default async function SearchPage({
	searchParams,
}: {
	searchParams: {
		q?: string;
	};
}) {
	const query = searchParams.q;

	if (!query) {
		return redirect("/", RedirectType.replace);
	}

	const t = await getTranslations("/search.page");

	const products = await Search.searchProducts(query);

	return (
		<main>
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("title", { query })}
			</h1>
			{products?.length ? <ProductList products={products} /> : <ProductNotFound query={query} />}
		</main>
	);
}
