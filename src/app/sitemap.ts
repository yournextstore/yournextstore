import { CATEGORIES } from "@/app/config.yns";
import { publicUrl } from "@/env.mjs";
import { deslugify } from "@/lib/utils";
import * as Commerce from "commerce-kit";
import type { MetadataRoute } from "next";

const Categories = CATEGORIES.map(({ slug }) => ({ name: deslugify(slug), slug }));

type Item = MetadataRoute.Sitemap[number];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await Commerce.productBrowse({ first: 100 });
	const productUrls = products.map(
		(product) =>
			({
				url: `${publicUrl}/product/${product.metadata.slug}`,
				lastModified: new Date(product.updated * 1000),
				changeFrequency: "daily",
				priority: 0.8,
			}) satisfies Item,
	);

	const categoryUrls = Categories.map(
		(category) =>
			({
				url: `${publicUrl}/category/${category.slug}`,
				lastModified: new Date(),
				changeFrequency: "daily",
				priority: 0.5,
			}) satisfies Item,
	);

	return [
		{
			url: publicUrl,
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1,
		},
		...productUrls,
		...categoryUrls,
	];
}
