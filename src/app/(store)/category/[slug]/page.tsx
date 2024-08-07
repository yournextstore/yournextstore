import { type Metadata } from "next/types";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import * as Commerce from "commerce-kit";
import { ProductList } from "@/ui/products/productList";
import { deslugify } from "@/lib/utils";
import { publicUrl } from "@/env.mjs";

export const generateMetadata = async ({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> => {
	const products = await Commerce.productBrowse({
		first: 100,
		filter: { category: params.slug },
	});

	if (products.length === 0) {
		return notFound();
	}

	const t = await getTranslations("/category.metadata");

	return {
		title: t("title", { categoryName: deslugify(params.slug) }),
		alternates: { canonical: `${publicUrl}/category/${params.slug}` },
	};
};

export default async function CategoryPage({ params }: { params: { slug: string } }) {
	const products = await Commerce.productBrowse({
		first: 100,
		filter: { category: params.slug },
	});

	if (products.length === 0) {
		return notFound();
	}

	const t = await getTranslations("/category.page");

	return (
		<main className="pb-8">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("title", { categoryName: deslugify(params.slug) })}
			</h1>
			<ProductList products={products} />
		</main>
	);
}
